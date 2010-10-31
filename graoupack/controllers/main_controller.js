/*global confirm: true */
"use strict";

/**
 * @tag controllers, home
 */
$.Controller.extend('Graoupack.Controllers.Main',
/* @Static */
{
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
  init: function () {
    $("#loading p").append("(almost !)");
    if (!$("#GraouPack").length) {
      $(document.body).append($('<div/>').hide().attr('id', 'GraouPack'));
      $('#GraouPack').html(this.view('init', {tabs : this.Class.tabs}));
    }
  },
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
