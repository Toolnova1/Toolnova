document.addEventListener("DOMContentLoaded", () => {

  const display = document.getElementById("calculatorDisplay");
  const message = document.getElementById("calculatorMessage");
  const buttons = document.querySelectorAll(".calculator-button");

  let expression = "";
  let justCalculated = false;


  // =========================================
  // DISPLAY
  // =========================================

  function updateDisplay() {

    display.value = expression || "0";

  }


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
  // SAFE CALCULATION
  // =========================================

  function calculateExpression(value) {

    let calculation = value;

    // Convert percentage into decimal
    calculation = calculation.replace(
      /(\d+(?:\.\d+)?)%/g,
      "($1/100)"
    );

    // Only allow safe calculator characters
    if (!/^[0-9+\-*/().\s]+$/.test(calculation)) {
      throw new Error("Invalid expression");
    }

    // Evaluate the mathematical expression
    const result = Function(
      `"use strict"; return (${calculation})`
    )();

    if (
      typeof result !== "number" ||
      !Number.isFinite(result)
    ) {
      throw new Error("Invalid calculation");
    }

    return Number(
      result.toFixed(12)
    );

  }


  // =========================================
  // ADD VALUE
  // =========================================

  function addValue(value) {

    if (justCalculated) {

      if (
        /[0-9.]/.test(value)
      ) {

        expression = "";

      }

      justCalculated = false;

    }


    // Prevent multiple decimal points
    if (value === ".") {

      const currentNumber =
        expression.split(/[+\-*/]/).pop();

      if (currentNumber.includes(".")) {
        return;
      }

    }


    // Prevent duplicate operators
    if (
      /[+\-*/]$/.test(expression) &&
      /[+\-*/]/.test(value)
    ) {

      expression =
        expression.slice(0, -1) + value;

      updateDisplay();

      return;
    }


    // Prevent starting with multiplication/division
    if (
      expression === "" &&
      (value === "*" || value === "/")
    ) {

      return;
    }


    expression += value;

    updateDisplay();

  }


  // =========================================
  // CLEAR
  // =========================================

  function clearCalculator() {

    expression = "";

    justCalculated = false;

    updateDisplay();

    showMessage("");

  }


  // =========================================
  // DELETE
  // =========================================

  function deleteLast() {

    if (justCalculated) {

      clearCalculator();

      return;
    }


    expression = expression.slice(0, -1);

    updateDisplay();

  }


  // =========================================
  // CALCULATE
  // =========================================

  function calculate() {

    if (!expression) {
      return;
    }


    // Remove trailing operator
    const cleanedExpression =
      expression.replace(/[+\-*/]+$/, "");


    if (!cleanedExpression) {
      return;
    }


    try {

      const result =
        calculateExpression(cleanedExpression);

      expression = String(result);

      justCalculated = true;

      updateDisplay();

      showMessage(
        "Calculation completed.",
        "success"
      );

    } catch (error) {

      showMessage(
        "Invalid calculation. Please check your expression.",
        "error"
      );

    }

  }


  // =========================================
  // BUTTON EVENTS
  // =========================================

  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      const value =
        button.dataset.value;

      const action =
        button.dataset.action;


      if (action === "clear") {

        clearCalculator();

        return;

      }


      if (action === "delete") {

        deleteLast();

        return;

      }


      if (action === "calculate") {

        calculate();

        return;

      }


      if (value !== undefined) {

        addValue(value);

      }

    });

  });


  // =========================================
  // KEYBOARD SUPPORT
  // =========================================

  document.addEventListener("keydown", (event) => {

    const key = event.key;


    if (
      /^[0-9.]$/.test(key)
    ) {

      addValue(key);

      return;

    }


    if (
      ["+", "-", "*", "/"].includes(key)
    ) {

      addValue(key);

      return;

    }


    if (key === "%") {

      addValue("%");

      return;

    }


    if (key === "Enter" || key === "=") {

      event.preventDefault();

      calculate();

      return;

    }


    if (key === "Backspace") {

      deleteLast();

      return;

    }


    if (key === "Escape") {

      clearCalculator();

    }

  });


  // =========================================
  // INITIAL STATE
  // =========================================

  updateDisplay();

});
