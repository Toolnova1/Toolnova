/*
==================================================
TOOLNOVA TOOL REGISTRY
==================================================

This file controls the tools shown on ToolNova.

To add a NEW tool in the future:

1. Create a new folder inside /tools/
2. Create that tool's files.
3. Add one object to this list.

The main homepage does NOT need to be rewritten.

==================================================
*/

const TOOLNOVA_TOOLS = [

  /* ==============================================
     TEXT TOOLS
  ============================================== */

  {
    id: "word-counter",

    name: "Word Counter",

    description:
      "Count words, characters and lines instantly.",

    category: "Text",

    icon: "Aa",

    iconClass: "purple",

    url:
      "tools/word-counter/index.html",

    status: "active"
  },


  {
    id: "character-counter",

    name: "Character Counter",

    description:
      "Count characters with and without spaces.",

    category: "Text",

    icon: "123",

    iconClass: "blue",

    url:
      "tools/character-counter/index.html",

    status: "active"
  },


  {
    id: "case-converter",

    name: "Case Converter",

    description:
      "Convert text to uppercase, lowercase and title case.",

    category: "Text",

    icon: "Aa",

    iconClass: "purple",

    url:
      "tools/case-converter/index.html",

    status: "active"
  },


  /* ==============================================
     SECURITY
  ============================================== */

  {
    id: "password-generator",

    name: "Password Generator",

    description:
      "Generate strong and secure random passwords.",

    category: "Security",

    icon: "🔐",

    iconClass: "green",

    url:
      "tools/password-generator/index.html",

    status: "active"
  },


  /* ==============================================
     DEVELOPER
  ============================================== */

  {
    id: "json-formatter",

    name: "JSON Formatter",

    description:
      "Format, validate and minify JSON data easily.",

    category: "Developer",

    icon: "{ }",

    iconClass: "pink",

    url:
      "tools/json-formatter/index.html",

    status: "active"
  },


  /* ==============================================
     GENERAL UTILITY
  ============================================== */

  {
    id: "qr-generator",

    name: "QR Code Generator",

    description:
      "Create QR codes from text, links and other information.",

    category: "Utility",

    icon: "▦",

    iconClass: "cyan",

    url:
      "tools/qr-generator/index.html",

    status: "active"
  },


  {
    id: "calculator",

    name: "Calculator",

    description:
      "Perform quick calculations directly in your browser.",

    category: "Utility",

    icon: "123",

    iconClass: "orange",

    url:
      "tools/calculator/index.html",

    status: "active"
  },


  {
    id: "unit-converter",

    name: "Unit Converter",

    description:
      "Convert common units quickly and accurately.",

    category: "Utility",

    icon: "↔",

    iconClass: "cyan",

    url:
      "tools/unit-converter/index.html",

    status: "active"
  },


  /* ==============================================
     IMAGE TOOLS
  ============================================== */

  {
    id: "image-compressor",

    name: "Image Compressor",

    description:
      "Compress images while keeping useful image quality.",

    category: "Image",

    icon: "▧",

    iconClass: "yellow",

    url:
      "tools/image-compressor/index.html",

    status: "active"
  },


  /* ==============================================
     PDF TOOLS
  ============================================== */

  {
    id: "pdf-merger",

    name: "PDF Merger",

    description:
      "Combine multiple PDF files into one document.",

    category: "PDF",

    icon: "PDF",

    iconClass: "red",

    url:
      "tools/pdf-merger/index.html",

    status: "active"
  },


  {
    id: "pdf-extractor",

    name: "PDF Page Extractor",

    description:
      "Extract selected pages from a PDF document.",

    category: "PDF",

    icon: "PDF",

    iconClass: "red",

    url:
      "tools/pdf-extractor/index.html",

    status: "active"
  },


  {
    id: "pdf-text-extractor",

    name: "PDF Text Extractor",

    description:
      "Extract readable text from supported PDF files.",

    category: "PDF",

    icon: "TXT",

    iconClass: "indigo",

    url:
      "tools/pdf-text-extractor/index.html",

    status: "active"
  }

];


/*
==================================================
HELPER FUNCTIONS
==================================================
*/

function getActiveTools() {

  return TOOLNOVA_TOOLS.filter(
    tool => tool.status === "active"
  );

}


function getToolById(id) {

  return TOOLNOVA_TOOLS.find(
    tool => tool.id === id
  );

}


function getToolCategories() {

  const categories = [
    "all"
  ];

  TOOLNOVA_TOOLS.forEach(tool => {

    if (
      tool.status === "active" &&
      !categories.includes(tool.category)
    ) {

      categories.push(
        tool.category
      );

    }

  });

  return categories;

}
