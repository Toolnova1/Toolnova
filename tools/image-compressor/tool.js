document.addEventListener("DOMContentLoaded", () => {

  const imageInput =
    document.getElementById("imageInput");

  const qualityRange =
    document.getElementById("qualityRange");

  const qualityValue =
    document.getElementById("qualityValue");

  const compressButton =
    document.getElementById("compressButton");

  const downloadButton =
    document.getElementById("downloadButton");

  const clearButton =
    document.getElementById("clearButton");

  const originalPreview =
    document.getElementById("originalPreview");

  const compressedPreview =
    document.getElementById("compressedPreview");

  const originalSize =
    document.getElementById("originalSize");

  const compressedSize =
    document.getElementById("compressedSize");

  const compressionPercentage =
    document.getElementById("compressionPercentage");

  const imageInfo =
    document.getElementById("imageInfo");

  const message =
    document.getElementById("imageMessage");

  let selectedFile = null;
  let originalImageUrl = null;
  let compressedBlob = null;
  let compressedUrl = null;


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
  // FORMAT FILE SIZE
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
  // CLEAN URLS
  // =========================================

  function revokeUrls() {

    if (originalImageUrl) {

      URL.revokeObjectURL(
        originalImageUrl
      );

      originalImageUrl = null;

    }


    if (compressedUrl) {

      URL.revokeObjectURL(
        compressedUrl
      );

      compressedUrl = null;

    }

  }


  // =========================================
  // UPDATE QUALITY
  // =========================================

  function updateQualityLabel() {

    qualityValue.textContent =
      `${qualityRange.value}%`;

  }


  // =========================================
  // LOAD IMAGE
  // =========================================

  function loadSelectedImage(file) {

    if (!file) {
      return;
    }


    if (!file.type.startsWith("image/")) {

      showMessage(
        "Please select a valid image file.",
        "error"
      );

      return;
    }


    selectedFile = file;

    compressedBlob = null;


    if (compressedUrl) {

      URL.revokeObjectURL(
        compressedUrl
      );

      compressedUrl = null;

    }


    originalImageUrl =
      URL.createObjectURL(file);


    originalPreview.src =
      originalImageUrl;


    originalSize.textContent =
      formatFileSize(file.size);


    imageInfo.textContent =
      `${file.name} • ${formatFileSize(file.size)}`;


    compressedPreview.removeAttribute(
      "src"
    );


    compressedSize.textContent =
      "—";


    compressionPercentage.textContent =
      "—";


    compressButton.disabled = false;

    downloadButton.disabled = true;


    showMessage(
      "Image loaded. Choose the quality and compress it.",
      "success"
    );

  }


  // =========================================
  // COMPRESS IMAGE
  // =========================================

  function compressImage() {

    if (!selectedFile) {

      showMessage(
        "Please select an image first.",
        "error"
      );

      return;

    }


    const image =
      new Image();


    image.onload = () => {

      const canvas =
        document.createElement("canvas");

      const context =
        canvas.getContext("2d");


      if (!context) {

        showMessage(
          "Your browser does not support image compression.",
          "error"
        );

        return;

      }


      canvas.width =
        image.naturalWidth;

      canvas.height =
        image.naturalHeight;


      // White background helps JPEG output
      // when the original image has transparency.
      if (
        selectedFile.type === "image/jpeg"
      ) {

        context.fillStyle = "#ffffff";

        context.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

      }


      context.drawImage(
        image,
        0,
        0
      );


      const quality =
        Number(qualityRange.value) / 100;


      let outputType =
        selectedFile.type;


      // Canvas compression is most consistent
      // with JPEG and WebP.
      if (
        outputType !== "image/jpeg" &&
        outputType !== "image/webp"
      ) {

        outputType = "image/jpeg";

      }


      canvas.toBlob(
        (blob) => {

          if (!blob) {

            showMessage(
              "Compression failed. Please try another image.",
              "error"
            );

            return;

          }


          compressedBlob =
            blob;


          if (compressedUrl) {

            URL.revokeObjectURL(
              compressedUrl
            );

          }


          compressedUrl =
            URL.createObjectURL(blob);


          compressedPreview.src =
            compressedUrl;


          compressedSize.textContent =
            formatFileSize(blob.size);


          const originalBytes =
            selectedFile.size;

          const compressedBytes =
            blob.size;


          const reduction =
            (
              (originalBytes - compressedBytes) /
              originalBytes
            ) * 100;


          if (reduction >= 0) {

            compressionPercentage.textContent =
              `${reduction.toFixed(1)}% smaller`;

          } else {

            const increase =
              Math.abs(reduction);

            compressionPercentage.textContent =
              `${increase.toFixed(1)}% larger`;

          }


          downloadButton.disabled = false;


          showMessage(
            "Image compressed successfully.",
            "success"
          );

        },
        outputType,
        quality
      );


      image.src = "";

    };


    image.onerror = () => {

      showMessage(
        "Unable to read this image.",
        "error"
      );

    };


    image.src =
      originalImageUrl;

  }


  // =========================================
  // DOWNLOAD
  // =========================================

  function downloadImage() {

    if (!compressedBlob || !compressedUrl) {

      showMessage(
        "Please compress the image first.",
        "error"
      );

      return;

    }


    const originalName =
      selectedFile.name
        .replace(/\.[^/.]+$/, "");


    const extension =
      compressedBlob.type === "image/webp"
        ? "webp"
        : "jpg";


    const link =
      document.createElement("a");


    link.href =
      compressedUrl;

    link.download =
      `${originalName}-compressed.${extension}`;


    document.body.appendChild(link);

    link.click();

    link.remove();


    showMessage(
      "Compressed image downloaded.",
      "success"
    );

  }


  // =========================================
  // CLEAR
  // =========================================

  function clearTool() {

    revokeUrls();

    selectedFile = null;

    compressedBlob = null;


    imageInput.value = "";

    originalPreview.removeAttribute(
      "src"
    );

    compressedPreview.removeAttribute(
      "src"
    );


    originalSize.textContent =
      "—";

    compressedSize.textContent =
      "—";

    compressionPercentage.textContent =
      "—";

    imageInfo.textContent =
      "";

    compressButton.disabled =
      true;

    downloadButton.disabled =
      true;


    qualityRange.value =
      "80";

    updateQualityLabel();

    showMessage("");

  }


  // =========================================
  // EVENTS
  // =========================================

  imageInput.addEventListener(
    "change",
    () => {

      const file =
        imageInput.files[0];

      loadSelectedImage(file);

    }
  );


  qualityRange.addEventListener(
    "input",
    updateQualityLabel
  );


  compressButton.addEventListener(
    "click",
    compressImage
  );


  downloadButton.addEventListener(
    "click",
    downloadImage
  );


  clearButton.addEventListener(
    "click",
    clearTool
  );


  // =========================================
  // INITIAL STATE
  // =========================================

  updateQualityLabel();

  compressButton.disabled =
    true;

  downloadButton.disabled =
    true;

});
