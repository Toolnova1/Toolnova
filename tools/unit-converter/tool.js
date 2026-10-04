document.addEventListener("DOMContentLoaded", () => {

  const categorySelect =
    document.getElementById("unitCategory");

  const fromSelect =
    document.getElementById("fromUnit");

  const toSelect =
    document.getElementById("toUnit");

  const input =
    document.getElementById("unitInput");

  const result =
    document.getElementById("unitResult");

  const swapButton =
    document.getElementById("swapUnits");

  const clearButton =
    document.getElementById("clearUnits");

  const message =
    document.getElementById("unitMessage");


  // =========================================
  // UNIT DATA
  // =========================================

  const units = {

    length: {

      meter: {
        name: "Meter",
        toBase: value => value
      },

      kilometer: {
        name: "Kilometer",
        toBase: value => value * 1000
      },

      centimeter: {
        name: "Centimeter",
        toBase: value => value / 100
      },

      millimeter: {
        name: "Millimeter",
        toBase: value => value / 1000
      },

      mile: {
        name: "Mile",
        toBase: value => value * 1609.344
      },

      yard: {
        name: "Yard",
        toBase: value => value * 0.9144
      },

      foot: {
        name: "Foot",
        toBase: value => value * 0.3048
      },

      inch: {
        name: "Inch",
        toBase: value => value * 0.0254
      }

    },


    weight: {

      kilogram: {
        name: "Kilogram",
        toBase: value => value
      },

      gram: {
        name: "Gram",
        toBase: value => value / 1000
      },

      milligram: {
        name: "Milligram",
        toBase: value => value / 1000000
      },

      pound: {
        name: "Pound",
        toBase: value => value * 0.45359237
      },

      ounce: {
        name: "Ounce",
        toBase: value => value * 0.028349523125
      }

    },


    temperature: {

      celsius: {
        name: "Celsius",
        toBase: value => value,
        fromBase: value => value
      },

      fahrenheit: {
        name: "Fahrenheit",
        toBase: value => (value - 32) * 5 / 9,
        fromBase: value => (value * 9 / 5) + 32
      },

      kelvin: {
        name: "Kelvin",
        toBase: value => value - 273.15,
        fromBase: value => value + 273.15
      }

    },


    volume: {

      liter: {
        name: "Liter",
        toBase: value => value
      },

      milliliter: {
        name: "Milliliter",
        toBase: value => value / 1000
      },

      gallon: {
        name: "US Gallon",
        toBase: value => value * 3.785411784
      },

      quart: {
        name: "US Quart",
        toBase: value => value * 0.946352946
      },

      pint: {
        name: "US Pint",
        toBase: value => value * 0.473176473
      },

      cup: {
        name: "US Cup",
        toBase: value => value * 0.2365882365
      },

      fluidOunce: {
        name: "US Fluid Ounce",
        toBase: value => value * 0.0295735295625
      }

    },


    area: {

      squareMeter: {
        name: "Square Meter",
        toBase: value => value
      },

      squareKilometer: {
        name: "Square Kilometer",
        toBase: value => value * 1000000
      },

      squareCentimeter: {
        name: "Square Centimeter",
        toBase: value => value / 10000
      },

      squareFoot: {
        name: "Square Foot",
        toBase: value => value * 0.09290304
      },

      squareYard: {
        name: "Square Yard",
        toBase: value => value * 0.83612736
      },

      acre: {
        name: "Acre",
        toBase: value => value * 4046.8564224
      },

      hectare: {
        name: "Hectare",
        toBase: value => value * 10000
      }

    },


    time: {

      second: {
        name: "Second",
        toBase: value => value
      },

      millisecond: {
        name: "Millisecond",
        toBase: value => value / 1000
      },

      minute: {
        name: "Minute",
        toBase: value => value * 60
      },

      hour: {
        name: "Hour",
        toBase: value => value * 3600
      },

      day: {
        name: "Day",
        toBase: value => value * 86400
      },

      week: {
        name: "Week",
        toBase: value => value * 604800
      }

    },


    speed: {

      meterPerSecond: {
        name: "Meter / Second",
        toBase: value => value
      },

      kilometerPerHour: {
        name: "Kilometer / Hour",
        toBase: value => value / 3.6
      },

      milePerHour: {
        name: "Mile / Hour",
        toBase: value => value * 0.44704
      },

      footPerSecond: {
        name: "Foot / Second",
        toBase: value => value * 0.3048
      },

      knot: {
        name: "Knot",
        toBase: value => value * 0.514444444444
      }

    }

  };


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
  // FORMAT RESULT
  // =========================================

  function formatNumber(value) {

    if (!Number.isFinite(value)) {
      return "0";
    }


    if (Math.abs(value) < 0.000000001) {
      return "0";
    }


    return Number(
      value.toPrecision(12)
    ).toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 10
      }
    );

  }


  // =========================================
  // POPULATE UNITS
  // =========================================

  function populateUnits() {

    const category =
      categorySelect.value;

    const categoryUnits =
      units[category];


    fromSelect.innerHTML = "";

    toSelect.innerHTML = "";


    Object.entries(categoryUnits).forEach(
      ([key, unit]) => {

        const fromOption =
          document.createElement("option");

        fromOption.value = key;

        fromOption.textContent =
          unit.name;

        fromSelect.appendChild(
          fromOption
        );


        const toOption =
          document.createElement("option");

        toOption.value = key;

        toOption.textContent =
          unit.name;

        toSelect.appendChild(
          toOption
        );

      }
    );


    const availableUnits =
      Object.keys(categoryUnits);


    if (availableUnits.length > 1) {

      fromSelect.value =
        availableUnits[0];

      toSelect.value =
        availableUnits[1];

    }


    convert();

  }


  // =========================================
  // CONVERT
  // =========================================

  function convert() {

    const rawValue =
      input.value.trim();


    if (rawValue === "") {

      result.textContent = "0";

      showMessage("");

      return;
    }


    const value =
      Number(rawValue);


    if (!Number.isFinite(value)) {

      result.textContent = "0";

      showMessage(
        "Please enter a valid number.",
        "error"
      );

      return;
    }


    const category =
      categorySelect.value;

    const categoryUnits =
      units[category];


    const fromUnit =
      categoryUnits[fromSelect.value];

    const toUnit =
      categoryUnits[toSelect.value];


    if (!fromUnit || !toUnit) {
      return;
    }


    try {

      let baseValue =
        fromUnit.toBase(value);


      let convertedValue;


      if (
        category === "temperature" &&
        typeof toUnit.fromBase === "function"
      ) {

        convertedValue =
          toUnit.fromBase(baseValue);

      } else {

        // For normal units, every unit uses
        // the same base-unit system.
        const fromBaseValue =
          fromUnit.toBase(value);

        const baseOfOne =
          toUnit.toBase(1);

        convertedValue =
          fromBaseValue / baseOfOne;

      }


      result.textContent =
        formatNumber(convertedValue);

      showMessage(
        "Conversion updated.",
        "success"
      );

    } catch (error) {

      result.textContent = "0";

      showMessage(
        "Unable to convert this value.",
        "error"
      );

    }

  }


  // =========================================
  // SWAP
  // =========================================

  function swapUnits() {

    const currentFrom =
      fromSelect.value;

    fromSelect.value =
      toSelect.value;

    toSelect.value =
      currentFrom;

    convert();

  }


  // =========================================
  // CLEAR
  // =========================================

  function clearUnits() {

    input.value = "";

    result.textContent = "0";

    showMessage("");

    input.focus();

  }


  // =========================================
  // EVENTS
  // =========================================

  categorySelect.addEventListener(
    "change",
    populateUnits
  );


  fromSelect.addEventListener(
    "change",
    convert
  );


  toSelect.addEventListener(
    "change",
    convert
  );


  input.addEventListener(
    "input",
    convert
  );


  swapButton.addEventListener(
    "click",
    swapUnits
  );


  clearButton.addEventListener(
    "click",
    clearUnits
  );


  // =========================================
  // INITIALIZE
  // =========================================

  populateUnits();

});
