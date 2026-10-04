/*
==================================================
TOOLNOVA — JSON FORMATTER
==================================================

Provides:

- Format JSON
- Minify JSON
- Validate JSON
- Copy output
- Clear input/output

Everything runs locally in the browser.

==================================================
*/

document.addEventListener("DOMContentLoaded", () => {

  const input =
    document.getElementById(
      "jsonInput"
    );

  const output =
    document.getElementById(
      "jsonOutput"
    );

  const formatButton =
    document.getElementById(
      "formatJson"
    );

  const minifyButton =
    document.getElementById(
      "minifyJson"
    );

  const validateButton =
    document.getElementById(
      "validateJson"
    );

  const copyButton =
    document.getElementById(
      "copyJson"
    );

  const clearButton =
    document.getElementById(
      "clearJson"
    );

  const message =
    document.getElementById(
      "jsonMessage"
    );


  /*
  -----------------------------------------------
  SHOW MESSAGE
  -----------------------------------------------
  */

  function showMessage(text) {

    message.textContent =
      text;

  }


  /*
  -----------------------------------------------
  CLEAR MESSAGE
  -----------------------------------------------
  */

  function clearMessage() {

    message.textContent =
      "";

  }


  /*
  -----------------------------------------------
  PARSE JSON
  -----------------------------------------------
  */

  function parseJSON() {

    const text =
      input.value.trim();


    if (!text) {

      showMessage(
        "Please enter some JSON first."
      );

      return null;

    }


    try {

      return JSON.parse(
        text
      );

    } catch (error) {

      showMessage(
        `Invalid JSON: ${error.message}`
      );

      return null;

    }

  }


  /*
  -----------------------------------------------
  FORMAT JSON
  -----------------------------------------------
  */

  function formatJSON() {

    const data =
      parseJSON();


    if (data === null) {

      return;

    }


    output.value =
      JSON.stringify(
        data,
        null,
        2
      );


    showMessage(
      "JSON formatted successfully."
    );

  }


  /*
  -----------------------------------------------
  MINIFY JSON
  -----------------------------------------------
  */

  function minifyJSON() {

    const data =
      parseJSON();


    if (data === null) {

      return;

    }


    output.value =
      JSON.stringify(
        data
      );


    showMessage(
      "JSON minified successfully."
    );

  }


  /*
  -----------------------------------------------
  VALIDATE JSON
  -----------------------------------------------
  */

  function validateJSON() {

    const text =
      input.value.trim();


    if (!text) {

      showMessage(
        "Please enter some JSON first."
      );

      return;

    }


    try {

      JSON.parse(
        text
      );


      showMessage(
        "✓ Valid JSON."
      );

    } catch (error) {

      showMessage(
        `✕ Invalid JSON: ${error.message}`
      );

    }

  }


  /*
  -----------------------------------------------
  COPY OUTPUT
  -----------------------------------------------
  */

  async function copyJSON() {

    const text =
      output.value;


    if (!text) {

      showMessage(
        "There is no output to copy."
      );

      return;

    }


    try {

      await navigator.clipboard.writeText(
        text
      );


      showMessage(
        "JSON copied to clipboard."
      );

    } catch (error) {

      output.select();

      document.execCommand(
        "copy"
      );


      showMessage(
        "JSON copied to clipboard."
      );

    }

  }


  /*
  -----------------------------------------------
  CLEAR
  -----------------------------------------------
  */

  function clearJSON() {

    input.value =
      "";

    output.value =
      "";

    clearMessage();

    input.focus();

  }


  /*
  -----------------------------------------------
  EVENTS
  -----------------------------------------------
  */

  formatButton.addEventListener(
    "click",
    formatJSON
  );


  minifyButton.addEventListener(
    "click",
    minifyJSON
  );


  validateButton.addEventListener(
    "click",
    validateJSON
  );


  copyButton.addEventListener(
    "click",
    copyJSON
  );


  clearButton.addEventListener(
    "click",
    clearJSON
  );


  /*
  -----------------------------------------------
  KEYBOARD SHORTCUT
  -----------------------------------------------

  Ctrl + Enter = Format JSON
  -----------------------------------------------
  */

  input.addEventListener(
    "keydown",
    event => {

      if (
        event.ctrlKey &&
        event.key === "Enter"
      ) {

        event.preventDefault();

        formatJSON();

      }

    }
  );

});
