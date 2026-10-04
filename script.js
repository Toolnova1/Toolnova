const modal = document.getElementById("toolModal");
const modalClose = document.getElementById("modalClose");
const modalOverlay = document.querySelector(".modal-overlay");
const toolContent = document.getElementById("toolContent");

const toolCards = document.querySelectorAll(".tool-card");


function openModal(content) {
  toolContent.innerHTML = content;

  modal.classList.add("active");

  document.body.style.overflow = "hidden";
}


function closeModal() {
  modal.classList.remove("active");

  document.body.style.overflow = "";
}


modalClose.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", closeModal);


document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});


toolCards.forEach((card) => {

  card.addEventListener("click", () => {

    const tool = card.dataset.tool;

    if (tool === "word-counter") {
      showWordCounter();
    }

    if (tool === "case-converter") {
      showCaseConverter();
    }

    if (tool === "password-generator") {
      showPasswordGenerator();
    }

    if (tool === "calculator") {
      showCalculator();
    }

    if (tool === "json-formatter") {
      showJsonFormatter();
    }

    if (tool === "unit-converter") {
      showUnitConverter();
    }

  });

});


/* =========================
   WORD COUNTER
========================= */

function showWordCounter() {

  openModal(`
    <div class="tool-interface">

      <h2>Word Counter</h2>

      <p>
        Enter your text below to count words, characters and lines.
      </p>

      <textarea
        class="tool-textarea"
        id="wordInput"
        placeholder="Type or paste your text here..."
      ></textarea>

      <div class="tool-result-grid">

        <div class="result-box">
          <strong id="wordCount">0</strong>
          <span>Words</span>
        </div>

        <div class="result-box">
          <strong id="characterCount">0</strong>
          <span>Characters</span>
        </div>

        <div class="result-box">
          <strong id="lineCount">0</strong>
          <span>Lines</span>
        </div>

      </div>

    </div>
  `);

  const input = document.getElementById("wordInput");

  const wordCount = document.getElementById("wordCount");

  const characterCount =
    document.getElementById("characterCount");

  const lineCount =
    document.getElementById("lineCount");


  input.addEventListener("input", () => {

    const text = input.value;

    const trimmed = text.trim();

    const words =
      trimmed === ""
        ? []
        : trimmed.split(/\s+/);

    const lines =
      text === ""
        ? 0
        : text.split(/\n/).length;


    wordCount.textContent = words.length;

    characterCount.textContent = text.length;

    lineCount.textContent = lines;

  });

}


/* =========================
   CASE CONVERTER
========================= */

function showCaseConverter() {

  openModal(`
    <div class="tool-interface">

      <h2>Case Converter</h2>

      <p>
        Enter text and convert it instantly.
      </p>

      <textarea
        class="tool-textarea"
        id="caseInput"
        placeholder="Enter your text..."
      ></textarea>

      <div class="tool-actions">

        <button class="tool-action" id="upperCase">
          UPPERCASE
        </button>

        <button class="tool-action" id="lowerCase">
          lowercase
        </button>

        <button class="tool-action" id="titleCase">
          Title Case
        </button>

        <button class="tool-action" id="clearCase">
          Clear
        </button>

      </div>

    </div>
  `);


  const input =
    document.getElementById("caseInput");


  document
    .getElementById("upperCase")
    .addEventListener("click", () => {

      input.value =
        input.value.toUpperCase();

    });


  document
    .getElementById("lowerCase")
    .addEventListener("click", () => {

      input.value =
        input.value.toLowerCase();

    });


  document
    .getElementById("titleCase")
    .addEventListener("click", () => {

      input.value =
        input.value
          .toLowerCase()
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
          );

    });


  document
    .getElementById("clearCase")
    .addEventListener("click", () => {

      input.value = "";

    });

}


/* =========================
   PASSWORD GENERATOR
========================= */

function showPasswordGenerator() {

  openModal(`
    <div class="tool-interface">

      <h2>Password Generator</h2>

      <p>
        Generate a random password for your accounts.
      </p>

      <input
        class="tool-textarea"
        id="passwordOutput"
        readonly
        placeholder="Your password will appear here..."
      >

      <div class="tool-actions">

        <button class="tool-action" id="generatePassword">
          Generate Password
        </button>

        <button class="tool-action" id="copyPassword">
          Copy
        </button>

      </div>

    </div>
  `);


  const output =
    document.getElementById("passwordOutput");


  function generatePassword() {

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "abcdefghijklmnopqrstuvwxyz" +
      "0123456789" +
      "!@#$%^&*()_+-=";


    let password = "";


    for (let i = 0; i < 16; i++) {

      const index =
        Math.floor(
          Math.random() * characters.length
        );

      password += characters[index];

    }


    output.value = password;

  }


  document
    .getElementById("generatePassword")
    .addEventListener(
      "click",
      generatePassword
    );


  document
    .getElementById("copyPassword")
    .addEventListener(
      "click",
      async () => {

        if (!output.value) return;

        await navigator.clipboard.writeText(
          output.value
        );

        document.getElementById(
          "copyPassword"
        ).textContent = "Copied!";

        setTimeout(() => {

          document.getElementById(
            "copyPassword"
          ).textContent = "Copy";

        }, 1200);

      }
    );


  generatePassword();

}


/* =========================
   CALCULATOR
========================= */

function showCalculator() {

  openModal(`
    <div class="tool-interface">

      <h2>Calculator</h2>

      <p>
        Enter a mathematical expression.
      </p>

      <input
        class="tool-textarea"
        id="calculatorInput"
        placeholder="Example: 25 * 4 + 10"
      >

      <div class="tool-actions">

        <button class="tool-action" id="calculate">
          Calculate
        </button>

        <button class="tool-action" id="clearCalculator">
          Clear
        </button>

      </div>

      <div
        class="result-box"
        style="margin-top: 20px;"
      >

        <strong id="calculatorResult">
          —
        </strong>

        <span>
          Result
        </span>

      </div>

    </div>
  `);


  const input =
    document.getElementById("calculatorInput");

  const result =
    document.getElementById("calculatorResult");


  document
    .getElementById("calculate")
    .addEventListener("click", () => {

      try {

        const expression =
          input.value.trim();


        if (!expression) {

          result.textContent = "Enter a calculation";

          return;

        }


        if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {

          result.textContent =
            "Invalid expression";

          return;

        }


        const answer =
          Function(
            `"use strict"; return (${expression})`
          )();


        if (!Number.isFinite(answer)) {

          result.textContent =
            "Invalid result";

          return;

        }


        result.textContent = answer;

      } catch {

        result.textContent =
          "Invalid calculation";

      }

    });


  document
    .getElementById("clearCalculator")
    .addEventListener("click", () => {

      input.value = "";

      result.textContent = "—";

    });

}


/* =========================
   JSON FORMATTER
========================= */

function showJsonFormatter() {

  openModal(`
    <div class="tool-interface">

      <h2>JSON Formatter</h2>

      <p>
        Paste JSON below and format it instantly.
      </p>

      <textarea
        class="tool-textarea"
        id="jsonInput"
        placeholder='{"name":"ToolNova","type":"website"}'
      ></textarea>

      <div class="tool-actions">

        <button class="tool-action" id="formatJson">
          Format JSON
        </button>

        <button class="tool-action" id="minifyJson">
          Minify
        </button>

        <button class="tool-action" id="clearJson">
          Clear
        </button>

      </div>

    </div>
  `);


  const input =
    document.getElementById("jsonInput");


  document
    .getElementById("formatJson")
    .addEventListener("click", () => {

      try {

        const parsed =
          JSON.parse(input.value);

        input.value =
          JSON.stringify(
            parsed,
            null,
            2
          );

      } catch {

        alert("Invalid JSON.");

      }

    });


  document
    .getElementById("minifyJson")
    .addEventListener("click", () => {

      try {

        const parsed =
          JSON.parse(input.value);

        input.value =
          JSON.stringify(parsed);

      } catch {

        alert("Invalid JSON.");

      }

    });


  document
    .getElementById("clearJson")
    .addEventListener("click", () => {

      input.value = "";

    });

}


/* =========================
   UNIT CONVERTER
========================= */

function showUnitConverter() {

  openModal(`
    <div class="tool-interface">

      <h2>Unit Converter</h2>

      <p>
        Convert kilometers to miles or miles to kilometers.
      </p>

      <input
        class="tool-textarea"
        id="unitInput"
        type="number"
        placeholder="Enter value"
      >

      <div class="tool-actions">

        <button class="tool-action" id="kmToMiles">
          KM → Miles
        </button>

        <button class="tool-action" id="milesToKm">
          Miles → KM
        </button>

      </div>

      <div
        class="result-box"
        style="margin-top: 20px;"
      >

        <strong id="unitResult">
          —
        </strong>

        <span>
          Result
        </span>

      </div>

    </div>
  `);


  const input =
    document.getElementById("unitInput");

  const result =
    document.getElementById("unitResult");


  document
    .getElementById("kmToMiles")
    .addEventListener("click", () => {

      const value =
        Number(input.value);

      if (!Number.isFinite(value)) {

        result.textContent =
          "Enter a valid number";

        return;

      }

      result.textContent =
        `${(value * 0.621371).toFixed(4)} miles`;

    });


  document
    .getElementById("milesToKm")
    .addEventListener("click", () => {

      const value =
        Number(input.value);

      if (!Number.isFinite(value)) {

        result.textContent =
          "Enter a valid number";

        return;

      }

      result.textContent =
        `${(value * 1.609344).toFixed(4)} km`;

    });

}
