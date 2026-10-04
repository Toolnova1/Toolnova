/*
==================================================
TOOLNOVA — PASSWORD GENERATOR
==================================================

Secure password generation happens locally in the
user's browser.

==================================================
*/

document.addEventListener("DOMContentLoaded", () => {

  const output =
    document.getElementById(
      "passwordOutput"
    );

  const copyButton =
    document.getElementById(
      "copyPassword"
    );

  const generateButton =
    document.getElementById(
      "generatePassword"
    );

  const lengthSlider =
    document.getElementById(
      "passwordLength"
    );

  const lengthValue =
    document.getElementById(
      "lengthValue"
    );

  const uppercaseCheckbox =
    document.getElementById(
      "includeUppercase"
    );

  const lowercaseCheckbox =
    document.getElementById(
      "includeLowercase"
    );

  const numbersCheckbox =
    document.getElementById(
      "includeNumbers"
    );

  const symbolsCheckbox =
    document.getElementById(
      "includeSymbols"
    );

  const message =
    document.getElementById(
      "passwordMessage"
    );


  /*
  -----------------------------------------------
  CHARACTER SETS
  -----------------------------------------------
  */

  const CHARACTERS = {

    uppercase:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

    lowercase:
      "abcdefghijklmnopqrstuvwxyz",

    numbers:
      "0123456789",

    symbols:
      "!@#$%^&*()_+-=[]{}|;:,.<>?"

  };


  /*
  -----------------------------------------------
  SECURE RANDOM NUMBER
  -----------------------------------------------
  */

  function secureRandom(max) {

    const cryptoObject =
      window.crypto ||
      window.msCrypto;


    if (
      !cryptoObject ||
      !cryptoObject.getRandomValues
    ) {

      return Math.floor(
        Math.random() * max
      );

    }


    const array =
      new Uint32Array(1);


    cryptoObject.getRandomValues(
      array
    );


    return (
      array[0] % max
    );

  }


  /*
  -----------------------------------------------
  RANDOM CHARACTER
  -----------------------------------------------
  */

  function randomCharacter(characters) {

    return characters[
      secureRandom(
        characters.length
      )
    ];

  }


  /*
  -----------------------------------------------
  SHUFFLE
  -----------------------------------------------
  */

  function shuffle(array) {

    for (
      let index = array.length - 1;
      index > 0;
      index--
    ) {

      const randomIndex =
        secureRandom(
          index + 1
        );


      [
        array[index],
        array[randomIndex]
      ] = [
        array[randomIndex],
        array[index]
      ];

    }


    return array;

  }


  /*
  -----------------------------------------------
  GENERATE PASSWORD
  -----------------------------------------------
  */

  function generatePassword() {

    const length =
      Number(
        lengthSlider.value
      );


    let characterPool =
      "";


    const requiredCharacters =
      [];


    /*
    UPPERCASE
    */

    if (
      uppercaseCheckbox.checked
    ) {

      characterPool +=
        CHARACTERS.uppercase;

      requiredCharacters.push(
        randomCharacter(
          CHARACTERS.uppercase
        )
      );

    }


    /*
    LOWERCASE
    */

    if (
      lowercaseCheckbox.checked
    ) {

      characterPool +=
        CHARACTERS.lowercase;

      requiredCharacters.push(
        randomCharacter(
          CHARACTERS.lowercase
        )
      );

    }


    /*
    NUMBERS
    */

    if (
      numbersCheckbox.checked
    ) {

      characterPool +=
        CHARACTERS.numbers;

      requiredCharacters.push(
        randomCharacter(
          CHARACTERS.numbers
        )
      );

    }


    /*
    SYMBOLS
    */

    if (
      symbolsCheckbox.checked
    ) {

      characterPool +=
        CHARACTERS.symbols;

      requiredCharacters.push(
        randomCharacter(
          CHARACTERS.symbols
        )
      );

    }


    /*
    NO OPTIONS SELECTED
    */

    if (
      characterPool.length === 0
    ) {

      output.value = "";

      showMessage(
        "Select at least one character type."
      );

      return;

    }


    /*
    LENGTH TOO SHORT
    */

    if (
      length < requiredCharacters.length
    ) {

      output.value = "";

      showMessage(
        "Increase the password length."
      );

      return;

    }


    /*
    BUILD PASSWORD
    */

    const passwordCharacters =
      [...requiredCharacters];


    while (
      passwordCharacters.length <
      length
    ) {

      passwordCharacters.push(
        randomCharacter(
          characterPool
        )
      );

    }


    /*
    SHUFFLE REQUIRED CHARACTERS
    */

    shuffle(
      passwordCharacters
    );


    const password =
      passwordCharacters.join("");


    output.value =
      password;


    clearMessage();

  }


  /*
  -----------------------------------------------
  COPY PASSWORD
  -----------------------------------------------
  */

  async function copyPassword() {

    const password =
      output.value;


    if (!password) {

      showMessage(
        "Generate a password first."
      );

      return;

    }


    try {

      await navigator.clipboard.writeText(
        password
      );


      showMessage(
        "Password copied to clipboard."
      );

    } catch (error) {

      output.select();

      document.execCommand(
        "copy"
      );


      showMessage(
        "Password copied to clipboard."
      );

    }

  }


  /*
  -----------------------------------------------
  MESSAGE
  -----------------------------------------------
  */

  function showMessage(text) {

    message.textContent =
      text;

  }


  function clearMessage() {

    message.textContent =
      "";

  }


  /*
  -----------------------------------------------
  LENGTH SLIDER
  -----------------------------------------------
  */

  lengthSlider.addEventListener(
    "input",
    () => {

      lengthValue.textContent =
        lengthSlider.value;

      generatePassword();

    }
  );


  /*
  -----------------------------------------------
  GENERATE BUTTON
  -----------------------------------------------
  */

  generateButton.addEventListener(
    "click",
    generatePassword
  );


  /*
  -----------------------------------------------
  COPY BUTTON
  -----------------------------------------------
  */

  copyButton.addEventListener(
    "click",
    copyPassword
  );


  /*
  -----------------------------------------------
  OPTION CHANGES
  -----------------------------------------------
  */

  [
    uppercaseCheckbox,
    lowercaseCheckbox,
    numbersCheckbox,
    symbolsCheckbox
  ].forEach(
    checkbox => {

      checkbox.addEventListener(
        "change",
        generatePassword
      );

    }
  );


  /*
  -----------------------------------------------
  INITIAL PASSWORD
  -----------------------------------------------
  */

  lengthValue.textContent =
    lengthSlider.value;


  generatePassword();

});
