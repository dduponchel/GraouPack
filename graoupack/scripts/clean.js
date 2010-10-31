//steal/js graoupack/scripts/compress.js
"use strict";

load("steal/rhino/steal.js");
steal.plugins('steal/clean', function () {
  steal.clean('graoupack/graoupack.html', {
    indent_size: 1,
    indent_char: '\t',
    jslint : false,
    ignore: /jquery\/jquery.js/,
    predefined: {
      steal: true,
      jQuery: true,
      $ : true,
      window : true
    }
  });
});
