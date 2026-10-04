import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const pdfInput = document.getElementById("pdfInput");
  const extractTextButton = document.getElementById("extractTextButton");
  const copyTextButton = document.getElementById("copyTextButton");
  const downloadTextButton = document.getElementById("downloadTextButton");
  const clearButton = document.getElementById("clearButton");

  const pdfInfo = document.getElementById("pdfInfo");
  const pdfMessage = document.getElementById("pdfMessage");
  const textOutput = document.getElementById("textOutput");
  const textStats = document.getElementById("textStats");

  let selectedFile = null;
  let downloadUrl = null;


  // =========================================
  // PDF.JS WORKER
  // =========================================

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";


  // =========================================
  // INITIAL STATE
  // =========================================

  extractTextButton.disabled = true;
  copyTextButton.disabled = true;
  downloadTextButton.disabled = true;


  // =========================================
  // FILE SELECTION
  // =========================================

  pdfInput.addEventListener("change", () => {

    clearMessage();

    textOutput.value = "";
    textStats.textContent = "";

    copyTextButton.disabled = true;
    downloadTextButton.disabled = true;

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      downloadUrl = null;
    }

    selectedFile = null;

    const file = pdfInput.files[0];

    if (!file) {
      pdfInfo.textContent = "";
      extractTextButton.disabled = true;
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {

      pdfInput.value = "";

      pdfInfo.textContent = "";

      extractTextButton.disabled = true;

      showMessage(
        "Please select a valid PDF file.",
        "error"
      );

      return;
    }

    selectedFile = file;

    pdfInfo.textContent =
      `${file.name} • ${formatFileSize(file.size)}`;

    extractTextButton.disabled = false;

    showMessage(
      "PDF selected successfully. Click Extract Text to continue.",
      "success"
    );
  });


  // =========================================
  // EXTRACT TEXT
  // =========================================

  extractTextButton.addEventListener(
    "click",
    async () => {

      clearMessage();

      if (!selectedFile) {

        showMessage(
          "Please select a PDF file first.",
          "error"
        );

        return;
      }

      try {

        extractTextButton.disabled = true;
        copyTextButton.disabled = true;
        downloadTextButton.disabled = true;

        extractTextButton.textContent =
          "Extracting...";

        textOutput.value = "";
        textStats.textContent = "";

        const arrayBuffer =
          await selectedFile.arrayBuffer();

        const loadingTask =
          pdfjsLib.getDocument({
            data: new Uint8Array(arrayBuffer)
          });

        const pdf =
          await loadingTask.promise;

        const extractedPages = [];

        for (
          let pageNumber = 1;
          pageNumber <= pdf.numPages;
          pageNumber++
        ) {

          const page =
            await pdf.getPage(pageNumber);

          const textContent =
            await page.getTextContent();

          const pageText =
            buildPageText(textContent.items);

          if (pageText.trim()) {

            extractedPages.push(
              `--- Page ${pageNumber} ---\n\n${pageText}`
            );

          } else {

            extractedPages.push(
              `--- Page ${pageNumber} ---\n\n[No selectable text found on this page.]`
            );

          }
        }

        const finalText =
          extractedPages.join("\n\n");

        textOutput.value = finalText;

        updateStats(finalText, pdf.numPages);

        copyTextButton.disabled =
          !finalText.trim();

        downloadTextButton.disabled =
          !finalText.trim();

        showMessage(
          `Text extracted successfully from ${pdf.numPages} page${
            pdf.numPages === 1 ? "" : "s"
          }.`,
          "success"
        );

      } catch (error) {

        console.error(error);

        textOutput.value = "";
        textStats.textContent = "";

        showMessage(
          "The PDF could not be processed. It may be damaged, encrypted, or unsupported.",
          "error"
        );

      } finally {

        extractTextButton.disabled = false;

        extractTextButton.textContent =
          "Extract Text";
      }
    }
  );


  // =========================================
  // COPY TEXT
  // =========================================

  copyTextButton.addEventListener(
    "click",
    async () => {

      const text =
        textOutput.value.trim();

      if (!text) {

        showMessage(
          "There is no extracted text to copy.",
          "error"
        );

        return;
      }

      try {

        await navigator.clipboard.writeText(text);

        showMessage(
          "Extracted text copied to clipboard.",
          "success"
        );

      } catch (error) {

        textOutput.focus();
        textOutput.select();

        try {
          document.execCommand("copy");

          showMessage(
            "Extracted text copied to clipboard.",
            "success"
          );

        } catch (copyError) {

          showMessage(
            "Copy failed. Please select the text manually.",
            "error"
          );
        }
      }
    }
  );


  // =========================================
  // DOWNLOAD TXT
  // =========================================

  downloadTextButton.addEventListener(
    "click",
    () => {

      const text =
        textOutput.value.trim();

      if (!text) {

        showMessage(
          "There is no extracted text to download.",
          "error"
        );

        return;
      }

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }

      const blob =
        new Blob(
          [text],
          {
            type: "text/plain;charset=utf-8"
          }
        );

      downloadUrl =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = downloadUrl;

      link.download =
        createTextFileName(
          selectedFile
            ? selectedFile.name
            : "document.pdf"
        );

      document.body.appendChild(link);

      link.click();

      link.remove();

      showMessage(
        "Text file downloaded successfully.",
        "success"
      );
    }
  );


  // =========================================
  // CLEAR
  // =========================================

  clearButton.addEventListener(
    "click",
    () => {

      pdfInput.value = "";

      selectedFile = null;

      pdfInfo.textContent = "";

      textOutput.value = "";

      textStats.textContent = "";

      extractTextButton.disabled = true;
      copyTextButton.disabled = true;
      downloadTextButton.disabled = true;

      clearMessage();

      if (downloadUrl) {

        URL.revokeObjectURL(downloadUrl);

        downloadUrl = null;
      }
    }
  );


  // =========================================
  // BUILD PAGE TEXT
  // =========================================

  function buildPageText(items) {

    let text = "";
    let previousItem = null;

    for (const item of items) {

      if (!item.str) {
        continue;
      }

      if (
        previousItem &&
        shouldAddLineBreak(
          previousItem,
          item
        )
      ) {
        text += "\n";
      } else if (
        previousItem &&
        shouldAddSpace(
          previousItem,
          item
        )
      ) {
        text += " ";
      }

      text += item.str;

      previousItem = item;
    }

    return cleanText(text);
  }


  // =========================================
  // LINE DETECTION
  // =========================================

  function shouldAddLineBreak(
    previousItem,
    currentItem
  ) {

    const previousTransform =
      previousItem.transform;

    const currentTransform =
      currentItem.transform;

    if (
      !previousTransform ||
      !currentTransform
    ) {
      return false;
    }

    const previousY =
      previousTransform[5];

    const currentY =
      currentTransform[5];

    return Math.abs(
      previousY - currentY
    ) > 5;
  }


  // =========================================
  // SPACE DETECTION
  // =========================================

  function shouldAddSpace(
    previousItem,
    currentItem
  ) {

    if (
      previousItem.hasEOL ||
      currentItem.hasEOL
    ) {
      return false;
    }

    const previousText =
      previousItem.str || "";

    const currentText =
      currentItem.str || "";

    if (
      !previousText ||
      !currentText
    ) {
      return false;
    }

    return (
      !previousText.endsWith(" ") &&
      !currentText.startsWith(" ")
    );
  }


  // =========================================
  // CLEAN TEXT
  // =========================================

  function cleanText(text) {

    return text
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }


  // =========================================
  // TEXT STATS
  // =========================================

  function updateStats(
    text,
    pageCount
  ) {

    const characters =
      text.length;

    const charactersNoSpaces =
      text.replace(/\s/g, "").length;

    const words =
      text
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;

    const lines =
      text
        .split("\n")
        .filter(line => line.trim())
        .length;

    textStats.textContent =
      `${pageCount} page${
        pageCount === 1 ? "" : "s"
      } • ${words} words • ${
        characters
      } characters • ${
        charactersNoSpaces
      } characters without spaces • ${
        lines
      } lines`;
  }


  // =========================================
  // FILE SIZE
  // =========================================

  function formatFileSize(bytes) {

    if (bytes === 0) {
      return "0 Bytes";
    }

    const units = [
      "Bytes",
      "KB",
      "MB",
      "GB"
    ];

    const index =
      Math.floor(
        Math.log(bytes) /
        Math.log(1024)
      );

    const size =
      bytes /
      Math.pow(1024, index);

    return `${size.toFixed(
      index === 0 ? 0 : 2
    )} ${units[index]}`;
  }


  // =========================================
  // DOWNLOAD NAME
  // =========================================

  function createTextFileName(
    fileName
  ) {

    const cleanName =
      fileName
        .replace(/\.pdf$/i, "")
        .replace(/[^a-z0-9-_]+/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    return `${
      cleanName || "document"
    }-extracted-text.txt`;
  }


  // =========================================
  // MESSAGES
  // =========================================

  function showMessage(
    message,
    type
  ) {

    pdfMessage.textContent =
      message;

    pdfMessage.className =
      `tool-message ${type}`;
  }


  function clearMessage() {

    pdfMessage.textContent = "";

    pdfMessage.className =
      "tool-message";
  }

});
