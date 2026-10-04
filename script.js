/*
==================================================
TOOLNOVA CORE SCRIPT
==================================================

This file controls:

- Tool registry rendering
- Categories
- Tool search
- Hero search
- Tool count
- Advertisement loading
- Basic navigation behavior

Tools themselves remain inside their own folders.

==================================================
*/


document.addEventListener("DOMContentLoaded", () => {

  initializeToolbox();

  initializeSearch();

  initializeAds();

});


/*
==================================================
TOOLBOX
==================================================
*/

function initializeToolbox() {

  const toolsGrid =
    document.getElementById("toolsGrid");

  const categoryBar =
    document.getElementById("categoryBar");

  const toolsCount =
    document.getElementById("toolsCount");

  const noResults =
    document.getElementById("noResults");


  if (
    !toolsGrid ||
    !categoryBar ||
    typeof TOOLNOVA_TOOLS === "undefined"
  ) {
    return;
  }


  const activeTools =
    getActiveTools();


  let currentCategory = "all";

  let currentSearch = "";


  /*
  -----------------------------------------------
  CREATE CATEGORY BUTTONS
  -----------------------------------------------
  */

  const categories =
    getToolCategories();


  categories
    .filter(category => category !== "all")
    .forEach(category => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "category-button";

      button.dataset.category =
        category;

      button.textContent =
        category;


      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".category-button"
            )
            .forEach(item => {

              item.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );


          currentCategory =
            category;


          renderTools();

        }
      );


      categoryBar.appendChild(button);

    });


  /*
  -----------------------------------------------
  ALL TOOLS BUTTON
  -----------------------------------------------
  */

  const allButton =
    categoryBar.querySelector(
      '[data-category="all"]'
    );


  if (allButton) {

    allButton.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".category-button"
          )
          .forEach(item => {

            item.classList.remove(
              "active"
            );

          });


        allButton.classList.add(
          "active"
        );


        currentCategory =
          "all";


        renderTools();

      }
    );

  }


  /*
  -----------------------------------------------
  RENDER FUNCTION
  -----------------------------------------------
  */

  function renderTools() {

    toolsGrid.innerHTML = "";


    const filteredTools =
      activeTools.filter(tool => {

        const matchesCategory =
          currentCategory === "all" ||
          tool.category === currentCategory;


        const searchText =
          currentSearch
            .trim()
            .toLowerCase();


        const matchesSearch =
          !searchText ||
          tool.name
            .toLowerCase()
            .includes(searchText) ||
          tool.description
            .toLowerCase()
            .includes(searchText) ||
          tool.category
            .toLowerCase()
            .includes(searchText);


        return (
          matchesCategory &&
          matchesSearch
        );

      });


    /*
    ---------------------------------------------
    UPDATE COUNT
    ---------------------------------------------
    */

    if (toolsCount) {

      if (filteredTools.length === activeTools.length) {

        toolsCount.textContent =
          `${activeTools.length} tools available`;

      } else {

        toolsCount.textContent =
          `${filteredTools.length} of ${activeTools.length} tools`;

      }

    }


    /*
    ---------------------------------------------
    NO RESULTS
    ---------------------------------------------
    */

    if (noResults) {

      noResults.hidden =
        filteredTools.length !== 0;

    }


    /*
    ---------------------------------------------
    CREATE CARDS
    ---------------------------------------------
    */

    filteredTools.forEach(tool => {

      const card =
        createToolCard(tool);

      toolsGrid.appendChild(card);

    });

  }


  /*
  -----------------------------------------------
  INITIAL RENDER
  -----------------------------------------------
  */

  renderTools();


  /*
  -----------------------------------------------
  EXPOSE SEARCH HANDLER
  -----------------------------------------------
  */

  window.ToolNovaToolSearch = function(searchValue) {

    currentSearch =
      searchValue || "";

    renderTools();

  };

}


/*
==================================================
CREATE TOOL CARD
==================================================
*/

function createToolCard(tool) {

  const article =
    document.createElement("article");

  article.className =
    "tool-card";


  article.setAttribute(
    "data-tool-id",
    tool.id
  );


  article.innerHTML = `

    <a
      href="${tool.url}"
      class="tool-card-link"
      aria-label="Open ${escapeHTML(tool.name)}"
    >

      <div class="tool-icon ${escapeHTML(tool.iconClass || "")}">
        ${escapeHTML(tool.icon || "✦")}
      </div>

      <div class="tool-content">

        <div class="tool-category">
          ${escapeHTML(tool.category)}
        </div>

        <h3>
          ${escapeHTML(tool.name)}
        </h3>

        <p>
          ${escapeHTML(tool.description)}
        </p>

      </div>

      <div class="tool-arrow">
        →
      </div>

    </a>

  `;


  return article;

}


/*
==================================================
SEARCH
==================================================
*/

function initializeSearch() {

  const heroSearch =
    document.getElementById(
      "heroToolSearch"
    );


  const toolsSearch =
    document.getElementById(
      "toolsSearch"
    );


  const clearButton =
    document.getElementById(
      "clearToolsSearch"
    );


  /*
  -----------------------------------------------
  HERO SEARCH
  -----------------------------------------------
  */

  if (heroSearch) {

    heroSearch.addEventListener(
      "input",
      () => {

        const value =
          heroSearch.value.trim();


        if (value) {

          const toolsSection =
            document.getElementById(
              "tools"
            );


          if (toolsSection) {

            toolsSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }


        if (toolsSearch) {

          toolsSearch.value =
            value;

        }


        if (
          typeof window.ToolNovaToolSearch ===
          "function"
        ) {

          window.ToolNovaToolSearch(
            value
          );

        }

      }
    );


    heroSearch.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        ) {

          const toolsSection =
            document.getElementById(
              "tools"
            );


          if (toolsSection) {

            toolsSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }

      }
    );

  }


  /*
  -----------------------------------------------
  TOOLS SEARCH
  -----------------------------------------------
  */

  if (toolsSearch) {

    toolsSearch.addEventListener(
      "input",
      () => {

        const value =
          toolsSearch.value;


        if (
          typeof window.ToolNovaToolSearch ===
          "function"
        ) {

          window.ToolNovaToolSearch(
            value
          );

        }


        if (heroSearch) {

          heroSearch.value =
            value;

        }

      }
    );

  }


  /*
  -----------------------------------------------
  CLEAR SEARCH
  -----------------------------------------------
  */

  if (clearButton) {

    clearButton.addEventListener(
      "click",
      () => {

        if (toolsSearch) {

          toolsSearch.value =
            "";

        }


        if (heroSearch) {

          heroSearch.value =
            "";

        }


        if (
          typeof window.ToolNovaToolSearch ===
          "function"
        ) {

          window.ToolNovaToolSearch(
            ""
          );

        }


        if (toolsSearch) {

          toolsSearch.focus();

        }

      }
    );

  }

}


/*
==================================================
ADVERTISEMENT SYSTEM
==================================================
*/

function initializeAds() {

  if (
    typeof TOOLNOVA_ADS ===
    "undefined"
  ) {
    return;
  }


  if (
    TOOLNOVA_ADS.enabled !== true
  ) {
    return;
  }


  loadConfiguredAd(
    "nativeTop",
    "native-top"
  );


  loadConfiguredAd(
    "banner300x250",
    "banner-300x250"
  );


  loadConfiguredAd(
    "banner468x60",
    "banner-468x60"
  );


  /*
  Mobile banner can be enabled later
  without changing the core system.
  */

}


/*
==================================================
LOAD AD
==================================================
*/

function loadConfiguredAd(
  configName,
  slotName
) {

  const config =
    getAdConfig(configName);


  if (
    !config ||
    config.enabled !== true
  ) {
    return;
  }


  const slot =
    document.querySelector(
      `[data-ad-slot="${slotName}"]`
    );


  if (!slot) {
    return;
  }


  /*
  -----------------------------------------------
  SECURITY / SCRIPT PARSING
  -----------------------------------------------

  Ad networks provide script tags as HTML.

  We insert normal HTML first, then recreate
  script elements so browsers execute them.
  -----------------------------------------------
  */

  slot.innerHTML =
    config.html;


  const scripts =
    slot.querySelectorAll(
      "script"
    );


  scripts.forEach(
    oldScript => {

      const newScript =
        document.createElement(
          "script"
        );


      Array.from(
        oldScript.attributes
      ).forEach(
        attribute => {

          newScript.setAttribute(
            attribute.name,
            attribute.value
          );

        }
      );


      newScript.text =
        oldScript.text;


      oldScript.parentNode.replaceChild(
        newScript,
        oldScript
      );

    }
  );

}


/*
==================================================
HTML ESCAPE
==================================================
*/

function escapeHTML(value) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}
