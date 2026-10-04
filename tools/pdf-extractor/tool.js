document.addEventListener("DOMContentLoaded", () => {
  const pdfInput = document.getElementById("pdfInput");
  const pageNumbers = document.getElementById("pageNumbers");
  const extractButton = document.getElementById("extractButton");
  const clearButton = document.getElementById("clearButton");

  const pdfInfo = document.getElementById("pdfInfo");
  const pdfMessage = document.getElementById("pdfMessage");

  const downloadArea = document.getElementById("downloadArea");
  const downloadPdf = document.getElementById("downloadPdf");

  let selectedFile = null;
  let totalPages = 0;
  let downloadUrl = null;


  // =========================================
  // INITIAL STATE
  // =========================================

  downloadArea.style.display = "none";
  extractButton.disabled = true;


  // =========================================
  // FILE SELECTION
  // =========================================

  pdfInput.addEventListener("change", async () => {
    clearMessage();

    downloadArea.style.display = "none";

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      downloadUrl = null;
    }

    selectedFile = null;
    totalPages = 0;

    const file = pdfInput.files[0];

    if (!file) {
      pdfInfo.textContent = "";
      extractButton.disabled = true;
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      showMessage(
        "Please select a valid PDF file.",
        "error"
      );

      pdfInput.value = "";
      pdfInfo.textContent = "";
      extractButton.disabled = true;

      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();

      if (
        typeof PDFLib === "undefined" ||
        !PDFLib.PDFDocument
      ) {
        throw new Error(
          "PDF library could not be loaded."
        );
      }

      const pdfDoc =
        await PDFLib.PDFDocument.load(arrayBuffer);

      totalPages = pdfDoc.getPageCount();
      selectedFile = file;

      pdfInfo.textContent =
        `${file.name} • ${totalPages} page${
          totalPages === 1 ? "" : "s"
        }`;

      extractButton.disabled = false;

      showMessage(
        "PDF loaded successfully. Enter the pages you want to extract.",
        "success"
      );

    } catch (error) {
      console.error(error);

      selectedFile = null;
      totalPages = 0;

      pdfInfo.textContent = "";
      extractButton.disabled = true;

      showMessage(
        "This PDF could not be read. Please choose a valid PDF file.",
        "error"
      );
    }
  });


  // =========================================
  // EXTRACT PAGES
  // =========================================

  extractButton.addEventListener("click", async () => {

    clearMessage();

    if (!selectedFile) {
      showMessage(
        "Please select a PDF file first.",
        "error"
      );

      return;
    }

    if (!pageNumbers.value.trim()) {
      showMessage(
        "Please enter the page numbers you want to extract.",
        "error"
      );

      pageNumbers.focus();

      return;
    }

    const pages = parsePageNumbers(
      pageNumbers.value,
      totalPages
    );

    if (!pages.length) {
      showMessage(
        `Please enter valid page numbers between 1 and ${totalPages}.`,
        "error"
      );

      pageNumbers.focus();

      return;
    }

    try {

      extractButton.disabled = true;
      extractButton.textContent = "Extracting...";

      const sourceBytes =
        await selectedFile.arrayBuffer();

      const sourcePdf =
        await PDFLib.PDFDocument.load(sourceBytes);

      const newPdf =
        await PDFLib.PDFDocument.create();

      const zeroBasedPages =
        pages.map(page => page - 1);

      const copiedPages =
        await newPdf.copyPages(
          sourcePdf,
          zeroBasedPages
        );

      copiedPages.forEach(page => {
        newPdf.addPage(page);
      });

      const pdfBytes =
        await newPdf.save();

      const blob =
        new Blob(
          [pdfBytes],
          {
            type: "application/pdf"
          }
        );

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }

      downloadUrl =
        URL.createObjectURL(blob);

      downloadPdf.href = downloadUrl;

      downloadPdf.download =
        createDownloadName(
          selectedFile.name
        );

      downloadArea.style.display = "flex";

      showMessage(
        `Successfully extracted ${
          pages.length
        } page${
          pages.length === 1 ? "" : "s"
        }.`,
        "success"
      );

    } catch (error) {

      console.error(error);

      showMessage(
        "Something went wrong while extracting the PDF pages.",
        "error"
      );

    } finally {

      extractButton.disabled = false;
      extractButton.textContent =
        "Extract Pages";
    }
  });


  // =========================================
  // CLEAR
  // =========================================

  clearButton.addEventListener("click", () => {

    pdfInput.value = "";
    pageNumbers.value = "";

    selectedFile = null;
    totalPages = 0;

    pdfInfo.textContent = "";

    downloadArea.style.display = "none";

    clearMessage();

    extractButton.disabled = true;

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      downloadUrl = null;
    }

  });


  // =========================================
  // PAGE NUMBER PARSER
  // =========================================

  function parsePageNumbers(value, maxPages) {

    const pages = new Set();

    const parts =
      value
        .split(",")
        .map(part => part.trim())
        .filter(Boolean);

    for (const part of parts) {

      // Range such as 2-5
      if (part.includes("-")) {

        const rangeParts =
          part
            .split("-")
            .map(item => item.trim());

        if (rangeParts.length !== 2) {
          continue;
        }

        const start =
          Number(rangeParts[0]);

        const end =
          Number(rangeParts[1]);

        if (
          !Number.isInteger(start) ||
          !Number.isInteger(end)
        ) {
          continue;
        }

        if (
          start < 1 ||
          end < 1 ||
          start > maxPages ||
          end > maxPages
        ) {
          continue;
        }

        const rangeStart =
          Math.min(start, end);

        const rangeEnd =
          Math.max(start, end);

        for (
          let page = rangeStart;
          page <= rangeEnd;
          page++
        ) {
          pages.add(page);
        }

      } else {

        // Single page such as 4
        const page =
          Number(part);

        if (
          Number.isInteger(page) &&
          page >= 1 &&
          page <= maxPages
        ) {
          pages.add(page);
        }
      }
    }

    return Array.from(pages).sort(
      (a, b) => a - b
    );
  }


  // =========================================
  // DOWNLOAD FILE NAME
  // =========================================

  function createDownloadName(fileName) {

    const cleanName =
      fileName
        .replace(/\.pdf$/i, "")
        .replace(/[^a-z0-9-_]+/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    return `${
      cleanName || "document"
    }-extracted-pages.pdf`;
  }


  // =========================================
  // MESSAGES
  // =========================================

  function showMessage(message, type) {

    pdfMessage.textContent = message;

    pdfMessage.className =
      `tool-message ${type}`;
  }


  function clearMessage() {

    pdfMessage.textContent = "";

    pdfMessage.className =
      "tool-message";
  }


  // =========================================
  // KEYBOARD SHORTCUT
  // =========================================

  pageNumbers.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" &&
        !extractButton.disabled
      ) {
        event.preventDefault();
        extractButton.click();
      }

    }
  );

});
