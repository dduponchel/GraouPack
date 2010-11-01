/*global confirm: true */
"use strict";

/**
 * @tag controllers, home
 * Display the list of available locales and let the user select which
 * locale he wants.
*/
$.Controller.extend('Graoupack.Controllers.Locale', /* @Static */ {
},
/* @Prototype */
{
  /**
   * When the page loads, construct the place holders and fetch locales.
   * @param {jQuery} el A jQuery wrapped element.
*/
  init : function (el) {
    $(el).html(this.view('init'));
    var lists = $("ul", el);
    lists.sortable({
      connectWith : lists,
      placeholder : 'ui-state-highlight'
    })
    .disableSelection();

    // fetch
    Graoupack.Models.Locale.findRemainingAvailable(this.callback('displayRemaining'));
    Graoupack.Models.Locale.getSelected(this.callback('displaySelected'));
  },
  /**
    * When the list of selected locales is updated, tell the model.
    * @param {jQuery} el A jQuery wrapped element.
    * @param {Event} ev A jQuery event.
    */
  '.selected sortupdate' : function (el, ev) {
    // yes I know, $("li", el).models() exists. But here, the order is important.
    // models() does $.unique(collection) and I do not want the associated sort...
    // I know that the locales are unique !
    var selected = [];
    $("li", el).each(function () {
      selected.push($(this).model());
    });

    // no callback function : when the user triggers a sortupdate, the UI i already
    // up to date. No need to redraw exactly what thw user see.
    Graoupack.Models.Locale.updateSelected(selected, this.callback());
  },
  /**
 * Init the selected locales.
 * @param {Array} the locales to display.
 */
  displaySelected : function (locales) {
    $('.selected', this.element).html(this.view('list', {locales : locales}));
  },
  /**
 * Init the list of available locales (all minus selected).
 * @param {Array} the locales to display.
 */
  displayRemaining : function (locales) {
    $('.available', this.element).html(this.view('list', {locales : locales}));
  }
});
