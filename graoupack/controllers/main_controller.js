/*global confirm: true */
"use strict";

/**
 * @tag controllers, home
 * Controls the page and creates the tab controllers.
*/
$.Controller.extend('Graoupack.Controllers.Main', /* @Static */ {
  onDocument: true,
  tabs : {
    'Presentation'  : 'presentation',
    'Project'       : 'my application',
    'Locale'        : 'locales',
    'Panel'         : 'panels',
    'Pack'          : 'packs'
  }
},
/* @Prototype */
{
  /**
 * init the page.
 */
  init: function () {
    $("#loading p").append(" (almost !)");
    if (!$("#GraouPack").length) {
      $(document.body).append($('<div/>').hide().attr('id', 'GraouPack'));
      $('#GraouPack').html(this.view('init', {tabs : this.Class.tabs}));
    }
  },
  /**
 * When the page loads, create the tabs and the controllers.
 */
  load: function () {
    $("#GraouPack")
    .bind("tabsshow", function (event, ui) {
      var panel = $(ui.panel);
      if (!panel.data("controller")) {
        panel.data("controller", new Graoupack.Controllers[panel.attr('id')](panel));
      }
    })
    .tabs()
    .show();
    $("#loading").remove();
  }
});
