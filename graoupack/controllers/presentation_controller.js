/*global confirm: true */
"use strict";

/**
 * @tag controllers, home
 * Displays a table of presentations.	 Lets the user
 * ["Graoupack.Controllers.Presentation.prototype.form submit" create],
 * ["Graoupack.Controllers.Presentation.prototype.&#46;edit click" edit],
 * or ["Graoupack.Controllers.Presentation.prototype.&#46;destroy click" destroy] presentations.
 */
$.Controller.extend('Graoupack.Controllers.Presentation',
/* @Static */
{
},
/* @Prototype */
{
  /**
   * When the page loads, gets all presentations to be displayed.
   */
  init: function (el) {
    $(el).html(this.view('init'));
  },

  '.nuke click' : function () {
    Graoupack.Models.Abstract.nuke();
    alert("localStorage cleared ! please reload the page");
  }
});
