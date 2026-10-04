/*
==================================================
TOOLNOVA AD CONFIGURATION
==================================================

All advertising settings are kept here.

Future ad changes should normally be made in this
file instead of changing the main website code.

==================================================
*/

const TOOLNOVA_ADS = {

  enabled: true,

  /*
  -----------------------------------------------
  NATIVE BANNER
  -----------------------------------------------
  */
  nativeTop: {
    enabled: true,

    type: "native",

    html: `
      <script async="async" data-cfasync="false"
        src="https://pl31660278.profitableratecpmnetwork.com/79fe092c9671c2c87d14b5ed0464215d/invoke.js">
      </script>

      <div id="container-79fe092c9671c2c87d14b5ed0464215d"></div>
    `
  },


  /*
  -----------------------------------------------
  300 x 250 BANNER
  -----------------------------------------------
  */
  banner300x250: {
    enabled: true,

    type: "banner",

    html: `
      <script>
        atOptions = {
          'key' : '9ac2b4a07e8337e3a86b08549f0307c0',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      </script>

      <script
        src="https://www.highrevenueformat.com/9ac2b4a07e8337e3a86b08549f0307c0/invoke.js">
      </script>
    `
  },


  /*
  -----------------------------------------------
  468 x 60 BANNER
  -----------------------------------------------
  */
  banner468x60: {
    enabled: true,

    type: "banner",

    html: `
      <script>
        atOptions = {
          'key' : 'd83e32887f070e7ab9fb2b62192718ad',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      </script>

      <script
        src="https://www.highrevenueformat.com/d83e32887f070e7ab9fb2b62192718ad/invoke.js">
      </script>
    `
  },


  /*
  -----------------------------------------------
  320 x 50 MOBILE BANNER
  -----------------------------------------------
  */
  banner320x50: {
    enabled: true,

    type: "banner",

    html: `
      <script>
        atOptions = {
          'key' : '8da8c7fe6109aaedab176077584db05f',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      </script>

      <script
        src="https://www.highrevenueformat.com/8da8c7fe6109aaedab176077584db05f/invoke.js">
      </script>
    `
  },


  /*
  -----------------------------------------------
  160 x 300 SIDEBAR
  -----------------------------------------------
  */
  banner160x300: {
    enabled: false,

    type: "banner",

    html: `
      <script>
        atOptions = {
          'key' : 'b7536fffc38b038f010fe57578d19b0d',
          'format' : 'iframe',
          'height' : 300,
          'width' : 160,
          'params' : {}
        };
      </script>

      <script
        src="https://www.highrevenueformat.com/b7536fffc38b038f010fe57578d19b0d/invoke.js">
      </script>
    `
  },


  /*
  -----------------------------------------------
  160 x 600 SIDEBAR
  -----------------------------------------------
  */
  banner160x600: {
    enabled: false,

    type: "banner",

    html: `
      <script>
        atOptions = {
          'key' : '6e4ba5f3394083f443b2bdd76f1d3c3c',
          'format' : 'iframe',
          'height' : 600,
          'width' : 160,
          'params' : {}
        };
      </script>

      <script
        src="https://www.highrevenueformat.com/6e4ba5f3394083f443b2bdd76f1d3c3c/invoke.js">
      </script>
    `
  },


  /*
  -----------------------------------------------
  POPUNDER
  -----------------------------------------------
  */

  popunder: {
    enabled: false,

    type: "script",

    html: `
      <script
        src="https://pl31660277.profitableratecpmnetwork.com/ea/0a/95/ea0a9526f8231115320d9f57254e569c.js">
      </script>
    `
  },


  /*
  -----------------------------------------------
  SOCIAL BAR
  -----------------------------------------------
  */

  socialBar: {
    enabled: false,

    type: "script",

    html: `
      <script
        src="https://pl31660280.profitableratecpmnetwork.com/2d/97/7b/2d977b65609158dd672f42629929aa26.js">
      </script>
    `
  },


  /*
  -----------------------------------------------
  SMARTLINK
  -----------------------------------------------
  */

  smartlink: {
    enabled: false,

    type: "link",

    url:
      "https://www.profitableratecpmnetwork.com/x7hg3xkq1?key=80cb169381508f77d886e09d273b6e81"
  },


  /*
  -----------------------------------------------
  ADDITIONAL DIRECT LINKS
  -----------------------------------------------
  */

  directLinks: [
    {
      enabled: false,
      url:
        "https://www.profitableratecpmnetwork.com/kk5j9rbcf?key=597edd180e41ec4c2ca0fe10f2c605bf"
    },

    {
      enabled: false,
      url:
        "https://www.profitableratecpmnetwork.com/ijkbe4ur3?key=59829db4128d4c4e60e690aeb36b4b79"
    },

    {
      enabled: false,
      url:
        "https://www.profitableratecpmnetwork.com/epmj8qf4?key=846809f126c4319a9bbc1a81ed671a6e6"
    },

    {
      enabled: false,
      url:
        "https://www.profitableratecpmnetwork.com/qr4m7vpd5?key=108466916e25aa7b41092578304df7bc"
    },

    {
      enabled: false,
      url:
        "https://www.profitableratecpmnetwork.com/bec2hmk4j?key=1ab850e551ad147cf6aa4e0eb8d0fd5d"
    }
  ]

};


/*
==================================================
AD HELPER
==================================================
*/

function getAdConfig(name) {

  if (!TOOLNOVA_ADS[name]) {
    return null;
  }

  return TOOLNOVA_ADS[name];

}
