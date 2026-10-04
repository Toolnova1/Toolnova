/*
==================================================
TOOLNOVA — CASE CONVERTER
==================================================

Text capitalization logic for the Case Converter
tool.

==================================================
*/

document.addEventListener("DOMContentLoaded", () => {

  const input =
    document.getElementById(
      "caseConverterInput"
    );

  const clearButton =
    document.getElementById(
      "clearText"
    );

  const uppercaseButton =
    document.getElementById(
      "uppercaseButton"
    );

  const lowercaseButton =
    document.getElementById(
      "lowercaseButton"
    );

  const titlecaseButton =
    document.getElementById(
      "titlecaseButton"
    );

  const sentencecaseButton =
    document.getElementById(
      "sentencecaseButton"
    );

  const capitalizeButton =
    document.getElementById(
      "capitalizeButton"
    );

  const characterCount =
    document.getElementById(
      "characterCount"
    );

  const wordCount =
    document.getElementById(
      "wordCount"
    );


  /*
  -----------------------------------------------
  UPDATE TEXT STATISTICS
  -----------------------------------------------
  */

  function updateStats() {

    const text =
      input.value;


    const words =
      text.trim()
        ? text.trim().split(/\s+/).length
        : 0;


    characterCount.textContent =
      text.length.toLocaleString();


    wordCount.textContent =
      words.toLocaleString();

  }


  /*
  -----------------------------------------------
  UPPERCASE
  -----------------------------------------------
  */

  uppercaseButton.addEventListener(
    "click",
    () => {

      input.value =
        input.value.toUpperCase();

      updateStats();

      input.focus();

    }
  );


  /*
  -----------------------------------------------
  LOWERCASE
  -----------------------------------------------
  */

  lowercaseButton.addEventListener(
    "click",
    () => {

      input.value =
        input.value.toLowerCase();

      updateStats();

      input.focus();

    }
  );


  /*
  -----------------------------------------------
  TITLE CASE
  -----------------------------------------------
  */

  titlecaseButton.addEventListener(
    "click",
    () => {

      input.value =
        input.value
          .toLowerCase()
          .replace(
            /\b\w/g,
            character =>
              character.toUpperCase()
          );

      updateStats();

      input.focus();

    }
  );


  /*
  -----------------------------------------------
  SENTENCE CASE
  -----------------------------------------------
  */

  sentencecaseButton.addEventListener(
    "click",
    () => {

      const text =
        input.value.toLowerCase();


      input.value =
        text.replace(
          /(^\s*[a-z])|([.!?]\s*[a-z])/g,
          match =>
            match.toUpperCase()
        );


      updateStats();

      input.focus();

    }
  );


  /*
  -----------------------------------------------
  CAPITALIZE WORDS
  -----------------------------------------------
  */

  capitalizeButton.addEventListener(
    "click",
    () => {

      input.value =
        input.value.replace(
          /\b\p{L}/gu,
          character =>
            character.toUpperCase()
        );

      updateStats();

      input.focus();

    }
  );


  /*
  -----------------------------------------------
  CLEAR
  -----------------------------------------------
  */

  clearButton.addEventListener(
    "click",
    () => {

      input.value = "";

      updateStats();

      input.focus();

    }
  );


  /*
  -----------------------------------------------
  LIVE STATS
  -----------------------------------------------
  */

  input.addEventListener(
    "input",
    updateStats
  );


  /*
  -----------------------------------------------
  INITIAL STATE
  -----------------------------------------------
  */

  updateStats();

});
