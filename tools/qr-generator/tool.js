document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("qrInput");
  const generateButton = document.getElementById("generateQr");
  const clearButton = document.getElementById("clearQr");
  const downloadButton = document.getElementById("downloadQr");
  const output = document.getElementById("qrOutput");
  const outputWrapper = document.getElementById("qrOutputWrapper");
  const message = document.getElementById("qrMessage");

  let qrCode = null;


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
  // GENERATE QR CODE
  // =========================================

  function generateQrCode() {

    const value = input.value.trim();

    if (!value) {

      output.innerHTML = "";

      outputWrapper.style.display = "none";

      downloadButton.style.display = "none";

      showMessage(
        "Please enter some text or a URL first.",
        "error"
      );

      input.focus();

      return;
    }


    if (typeof QRCode === "undefined") {

      showMessage(
        "QR Code library could not be loaded. Please refresh the page.",
        "error"
      );

      return;
    }


    output.innerHTML = "";

    qrCode = new QRCode(output, {
      text: value,
      width: 256,
      height: 256,
      colorDark: "#111827",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });


    outputWrapper.style.display = "flex";

    downloadButton.style.display = "inline-flex";

    showMessage(
      "QR code generated successfully.",
      "success"
    );

  }


  // =========================================
  // DOWNLOAD QR CODE
  // =========================================

  function downloadQrCode() {

    const canvas = output.querySelector("canvas");

    const image = output.querySelector("img");

    let imageUrl = "";


    if (canvas) {

      imageUrl = canvas.toDataURL("image/png");

    } else if (image) {

      imageUrl = image.src;

    } else {

      showMessage(
        "Generate a QR code before downloading.",
        "error"
      );

      return;
    }


    const link = document.createElement("a");

    link.href = imageUrl;

    link.download = "toolnova-qr-code.png";

    document.body.appendChild(link);

    link.click();

    link.remove();


    showMessage(
      "QR code downloaded.",
      "success"
    );

  }


  // =========================================
  // CLEAR
  // =========================================

  function clearQrCode() {

    input.value = "";

    output.innerHTML = "";

    qrCode = null;

    outputWrapper.style.display = "none";

    downloadButton.style.display = "none";

    showMessage("");

    input.focus();

  }


  // =========================================
  // EVENTS
  // =========================================

  generateButton.addEventListener(
    "click",
    generateQrCode
  );


  downloadButton.addEventListener(
    "click",
    downloadQrCode
  );


  clearButton.addEventListener(
    "click",
    clearQrCode
  );


  input.addEventListener("keydown", (event) => {

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter"
    ) {

      event.preventDefault();

      generateQrCode();

    }

  });


  // =========================================
  // INITIAL STATE
  // =========================================

  outputWrapper.style.display = "none";

  downloadButton.style.display = "none";

});
