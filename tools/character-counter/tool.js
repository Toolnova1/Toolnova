/*
==================================================
TOOLNOVA — CHARACTER COUNTER
==================================================

Character counting logic for the Character Counter
tool only.

==================================================
*/

document.addEventListener("DOMContentLoaded", () => {

  const input =
    document.getElementById(
      "characterCounterInput"
    );

  const clearButton =
    document.getElementById(
      "clearText"
    );

  const characterCount =
    document.getElementById(
      "characterCount"
    );

  const characterNoSpacesCount =
    document.getElementById(
      "characterNoSpacesCount"
    );

  const letterCount =
    document.getElementById(
      "letterCount"
    );

  const numberCount =
    document.getElementById(
      "numberCount"
    );

  const spaceCount =
    document.getElementById(
      "spaceCount"
    );

  const lineCount =
    document.getElementById(
      "lineCount"
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
    TOTAL CHARACTERS
    */

    const characters =
      text.length;


    /*
    CHARACTERS WITHOUT SPACES
    */

    const charactersWithoutSpaces =
      text.replace(/\s/g, "").length;


    /*
    LETTERS
    */

    const letters =
      text.match(
        /[\p{L}]/gu
      );


    const totalLetters =
      letters
        ? letters.length
        : 0;


    /*
    NUMBERS
    */

    const numbers =
      text.match(
        /\d/g
      );


    const totalNumbers =
      numbers
        ? numbers.length
        : 0;


    /*
    SPACES

    Only normal spaces are counted here,
    not line breaks or tabs.
    */

    const spaces =
      text.match(
        / /g
      );


    const totalSpaces =
      spaces
        ? spaces.length
        : 0;


    /*
    LINES
    */

    const lines =
      text
        ? text.split(/\r?\n/).length
        : 0;


    /*
    UPDATE UI
    */

    characterCount.textContent =
      characters.toLocaleString();

    characterNoSpacesCount.textContent =
      charactersWithoutSpaces.toLocaleString();

    letterCount.textContent =
      totalLetters.toLocaleString();

    numberCount.textContent =
      totalNumbers.toLocaleString();

    spaceCount.textContent =
      totalSpaces.toLocaleString();

    lineCount.textContent =
      lines.toLocaleString();

  }


  /*
  -----------------------------------------------
  INPUT EVENT
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
