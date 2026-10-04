document.addEventListener("DOMContentLoaded", () => {

  const pdfInput =
    document.getElementById("pdfInput");

  const fileList =
    document.getElementById("pdfFileList");

  const mergeButton =
    document.getElementById("mergePdfButton");

  const clearButton =
    document.getElementById("clearPdfButton");

  const message =
    document.getElementById("pdfMessage");

  const downloadArea =
    document.getElementById("pdfDownloadArea");

  const downloadLink =
    document.getElementById("downloadMergedPdf");


  let selectedFiles = [];

  let mergedPdfUrl = null;


  // =========================================
  // MESSAGE
  // =========================================

  function showMessage(text, type = "") {

    message.textContent = text;

    message.className = "tool-message";

    if (type) {
      message.classList.add(type);
    }

  }


  // =========================================
  // FILE SIZE
  // =========================================

  function formatFileSize(bytes) {

    if (!bytes) {
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
        Math.log(bytes) / Math.log(1024)
      );

    const safeIndex =
      Math.min(index, units.length - 1);

    const size =
      bytes / Math.pow(1024, safeIndex);

    return `${size.toFixed(
      safeIndex === 0 ? 0 : 2
    )} ${units[safeIndex]}`;

  }


  // =========================================
  // RENDER FILE LIST
  // =========================================

  function renderFileList() {

    fileList.innerHTML = "";


    if (selectedFiles.length === 0) {

      mergeButton.disabled = true;

      return;

    }


    selectedFiles.forEach(
      (file, index) => {

        const item =
          document.createElement("div");

        item.className =
          "pdf-file-item";


        const number =
          document.createElement("span");

        number.className =
          "pdf-file-number";

        number.textContent =
          index + 1;


        const details =
          document.createElement("div");

        details.className =
          "pdf-file-details";


        const name =
          document.createElement("strong");

        name.textContent =
          file.name;


        const size =
          document.createElement("span");

        size.textContent =
          formatFileSize(file.size);


        details.appendChild(name);

        details.appendChild(size);


        const removeButton =
          document.createElement("button");

        removeButton.type =
          "button";

        removeButton.className =
          "secondary-button";

        removeButton.textContent =
          "Remove";


        removeButton.addEventListener(
          "click",
          () => {

            selectedFiles.splice(
              index,
              1
            );

            renderFileList();

            showMessage("");

          }
        );


        item.appendChild(number);

        item.appendChild(details);

        item.appendChild(removeButton);


        fileList.appendChild(item);

      }
    );


    mergeButton.disabled =
      selectedFiles.length < 2;

  }


  // =========================================
  // ADD FILES
  // =========================================

  function addFiles(files) {

    const incomingFiles =
      Array.from(files);


    const validFiles =
      incomingFiles.filter(
        file =>
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf")
      );


    if (validFiles.length === 0) {

      showMessage(
        "Please select valid PDF files.",
        "error"
      );

      return;

    }


    validFiles.forEach(file => {

      const duplicate =
        selectedFiles.some(
          existing =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        );


      if (!duplicate) {

        selectedFiles.push(file);

      }

    });


    renderFileList();


    if (selectedFiles.length >= 2) {

      showMessage(
        `${selectedFiles.length} PDF files selected. Ready to merge.`,
        "success"
      );

    } else {

      showMessage(
        "Select at least two PDF files.",
        "error"
      );

    }

  }


  // =========================================
  // MERGE PDFs
  // =========================================

  async function mergePdfs() {

    if (selectedFiles.length < 2) {

      showMessage(
        "Please select at least two PDF files.",
        "error"
      );

      return;

    }


    if (
      typeof PDFLib === "undefined"
    ) {

      showMessage(
        "PDF library could not be loaded. Please refresh the page.",
        "error"
      );

      return;

    }


    try {

      mergeButton.disabled =
        true;

      showMessage(
        "Merging PDF files...",
        ""
      );


      const mergedPdf =
        await PDFLib.PDFDocument.create();


      for (
        let index = 0;
        index < selectedFiles.length;
        index++
      ) {

        const file =
          selectedFiles[index];


        const arrayBuffer =
          await file.arrayBuffer();


        const sourcePdf =
          await PDFLib.PDFDocument.load(
            arrayBuffer
          );


        const pageIndices =
          sourcePdf
            .getPageIndices();


        const copiedPages =
          await mergedPdf.copyPages(
            sourcePdf,
            pageIndices
          );


        copiedPages.forEach(
          page => {

            mergedPdf.addPage(page);

          }
        );

      }


      const mergedBytes =
        await mergedPdf.save();


      const blob =
        new Blob(
          [mergedBytes],
          {
            type: "application/pdf"
          }
        );


      if (mergedPdfUrl) {

        URL.revokeObjectURL(
          mergedPdfUrl
        );

      }


      mergedPdfUrl =
        URL.createObjectURL(blob);


      downloadLink.href =
        mergedPdfUrl;


      downloadLink.download =
        "toolnova-merged.pdf";


      downloadArea.style.display =
        "flex";


      showMessage(
        "PDF files merged successfully.",
        "success"
      );


    } catch (error) {

      console.error(
        "PDF merge error:",
        error
      );


      showMessage(
        "Unable to merge these PDF files. Please make sure they are valid PDFs.",
        "error"
      );

    } finally {

      mergeButton.disabled =
        selectedFiles.length < 2;

    }

  }


  // =========================================
  // CLEAR
  // =========================================

  function clearTool() {

    selectedFiles = [];


    pdfInput.value = "";

    fileList.innerHTML = "";


    mergeButton.disabled =
      true;


    if (mergedPdfUrl) {

      URL.revokeObjectURL(
        mergedPdfUrl
      );

      mergedPdfUrl = null;

    }


    downloadLink.href =
      "#";


    downloadArea.style.display =
      "none";


    showMessage("");

  }


  // =========================================
  // EVENTS
  // =========================================

  pdfInput.addEventListener(
    "change",
    () => {

      addFiles(
        pdfInput.files
      );

      // Allow selecting the same
      // files again later.
      pdfInput.value = "";

    }
  );


  mergeButton.addEventListener(
    "click",
    mergePdfs
  );


  clearButton.addEventListener(
    "click",
    clearTool
  );


  // =========================================
  // INITIAL STATE
  // =========================================

  downloadArea.style.display =
    "none";

});
