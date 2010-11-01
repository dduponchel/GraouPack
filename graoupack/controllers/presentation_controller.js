/*global confirm: true */
"use strict";

/**
 * @tag controllers, home
 * Display the default tab, presenting GraouPack.
*/
$.Controller.extend('Graoupack.Controllers.Presentation', /* @Static */ {
},
/* @Prototype */
{
  /**
   * When the page loads, display the text.
    * @param {jQuery} el A jQuery wrapped element.
*/
  init: function (el) {
    $(el).html(this.view('init'));
  },

  /**
 * the tab has a "nuke" button, to destroy the database.
*/
  '.nuke click' : function () {
    Graoupack.Models.Abstract.nuke();
    alert("localStorage cleared ! please reload the page");
  }
});
