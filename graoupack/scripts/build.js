//steal/js graoupack/scripts/compress.js
"use strict";

load("steal/rhino/steal.js");
steal.plugins(
  'steal/build',
  'steal/build/scripts',
  'steal/build/styles',
  function () {
    steal.build('graoupack/scripts/build.html', {to: 'graoupack'});
  }
);
