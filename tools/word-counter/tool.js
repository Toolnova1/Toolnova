/*
==================================================
TOOLNOVA — WORD COUNTER
==================================================

All word-counting logic lives inside this tool.

This file does not depend on the homepage script.

==================================================
*/

document.addEventListener("DOMContentLoaded", () => {

  const input =
    document.getElementById(
      "wordCounterInput"
    );

  const clearButton =
    document.getElementById(
      "clearText"
    );

  const wordCount =
    document.getElementById(
      "wordCount"
    );

  const characterCount =
    document.getElementById(
      "characterCount"
    );

  const characterNoSpacesCount =
    document.getElementById(
      "characterNoSpacesCount"
    );

  const sentenceCount =
    document.getElementById(
      "sentenceCount"
    );

  const lineCount =
    document.getElementById(
      "lineCount"
    );

  const paragraphCount =
    document.getElementById(
      "paragraphCount"
    );


  /*
  -----------------------------------------------
  UPDATE COUNTS
  -----------------------------------------------
  */

  function updateCounts() {

    const text =
      input.value;


    /*
    WORDS
    */

    const trimmedText =
      text.trim();

    const words =
      trimmedText
        ? trimmedText.split(/\s+/).length
        : 0;


    /*
    CHARACTERS
    */

    const characters =
      text.length;


    /*
    CHARACTERS WITHOUT SPACES
    */

    const charactersWithoutSpaces =
      text.replace(/\s/g, "").length;


    /*
    SENTENCES
    */

    const sentenceMatches =
      text.match(
        /[^.!?]+[.!?]+/g
      );

    const sentences =
      sentenceMatches
        ? sentenceMatches.length
        : (
            trimmedText
              ? 1
              : 0
          );


    /*
    LINES
    */

    const lines =
      text
        ? text.split(/\r?\n/).length
        : 0;


    /*
    PARAGRAPHS
    */

    const paragraphs =
      text
        .split(/\n\s*\n/)
        .filter(
          paragraph =>
            paragraph.trim().length > 0
        )
        .length;


    /*
    UPDATE UI
    */

    wordCount.textContent =
      words.toLocaleString();

    characterCount.textContent =
      characters.toLocaleString();

    characterNoSpacesCount.textContent =
      charactersWithoutSpaces.toLocaleString();

    sentenceCount.textContent =
      sentences.toLocaleString();

    lineCount.textContent =
      lines.toLocaleString();

    paragraphCount.textContent =
      paragraphs.toLocaleString();

  }


  /*
  -----------------------------------------------
  TEXT INPUT
  -----------------------------------------------
  */

  input.addEventListener(
    "input",
    updateCounts
  );


  /*
  -----------------------------------------------
  CLEAR BUTTON
  -----------------------------------------------
  */

  clearButton.addEventListener(
    "click",
    () => {

      input.value = "";

      updateCounts();

      input.focus();

    }
  );


  /*
  -----------------------------------------------
  INITIAL STATE
  -----------------------------------------------
  */

  updateCounts();

});
