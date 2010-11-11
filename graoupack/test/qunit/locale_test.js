"use strict";

module("Model: Graoupack.Models.Locale", {
  setup    : function(){$.jStorage.flush();},
  teardown : function(){$.jStorage.flush();}
});

test("findRemainingAvailable - no locale selected", function () {
  stop(2000);
  Graoupack.Models.Locale.findRemainingAvailable(function (locales) {
    start();
    ok(locales);
    equals(locales.length, Graoupack.Models.Locale.available.length);
  });
});

test("findRemainingAvailable - some selected", function () {
  stop(2000);
  var allLocales = Graoupack.Models.Locale.available;
  var selected = [];
  selected.push(allLocales[3]);
  selected.push(allLocales[5]);
  selected.push(allLocales[9]);
  Graoupack.Models.Locale.updateSelected(selected, function (callbackSelected) {
    equals(callbackSelected.length, selected.length);
    Graoupack.Models.Locale.findRemainingAvailable(function (locales) {
      start();
      equals(locales.length, allLocales.length - selected.length);
    });
  });
});

test("getSelected and updateSelected", function () {
  stop(2000);
  Graoupack.Models.Locale.getSelected(function (locales) {
    equals(locales.length, 0);
    var allLocales = Graoupack.Models.Locale.available;
    var selected = [];
    selected.push(allLocales[3]);
    selected.push(allLocales[5]);
    selected.push(allLocales[9]);
    Graoupack.Models.Locale.updateSelected(selected, function (callbackSelected) {
      equals(callbackSelected.length, selected.length);
      Graoupack.Models.Locale.getSelected(function (locales) {
        start();
        equals(locales.length, selected.length);
      });
    });
  });
});
