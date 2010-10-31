/*global confirm: true */
"use strict";

/**
 * @tag controllers, home
 * Displays a table of locales.	 Lets the user
 * ["Graoupack.Controllers.Locale.prototype.form submit" create],
 * ["Graoupack.Controllers.Locale.prototype.&#46;edit click" edit],
 * or ["Graoupack.Controllers.Locale.prototype.&#46;destroy click" destroy] locales.
*/
$.Controller.extend('Graoupack.Controllers.Locale', {
},
/* @Prototype */
{
  /**
 * When the page loads, gets all locales to be displayed.
*/
  load: function () {
    if (!$("#locale").length) {
      $(document.body).append($('<div/>').attr('id', 'locale'));
      Graoupack.Models.Locale.findAll({}, this.callback('list'));
    }
  },
  /**
 * Displays a list of locales and the submit form.
 * @param {Array} locales An array of Graoupack.Models.Locale objects.
*/
  list: function (locales) {
    $('#locale').html(this.view('init', {locales: locales}));
  },
  /**
 * Responds to the create form being submitted by creating a new Graoupack.Models.Locale.
 * @param {jQuery} el A jQuery wrapped element.
 * @param {Event} ev A jQuery event whose default action is prevented.
*/
  'form submit': function (el, ev) {
    ev.preventDefault();
    new Graoupack.Models.Locale(el.formParams()).save();
  },
  /**
 * Listens for locales being created.	 When a locale is created, displays the new locale.
 * @param {String} called The open ajax event that was called.
 * @param {Event} locale The new locale.
*/
  'locale.created subscribe': function (called, locale) {
    $("#locale tbody").append(this.view("list", {locales: [locale]}));
    $("#locale form input[type!=submit]").val(""); //clear old vals
  },
  /**
 * Creates and places the edit interface.
 * @param {jQuery} el The locale's edit link element.
*/
  '.edit click': function (el) {
    var locale = el.closest('.locale').model();
    locale.elements().html(this.view('edit', locale));
  },
  /**
 * Removes the edit interface.
 * @param {jQuery} el The locale's cancel link element.
*/
  '.cancel click': function (el) {
    this.show(el.closest('.locale').model());
  },
  /**
 * Updates the locale from the edit values.
*/
  '.update click': function (el) {
    var $locale = el.closest('.locale');
    $locale.model().update($locale.formParams());
  },
  /**
 * Listens for updated locales.	 When a locale is updated,
 * update's its display.
*/
  'locale.updated subscribe': function (called, locale) {
    this.show(locale);
  },
  /**
 * Shows a locale's information.
*/
  show: function (locale) {
    locale.elements().html(this.view('show', locale));
  },
  /**
 *	 Handle's clicking on a locale's destroy link.
*/
  '.destroy click': function (el) {
    if (confirm("Are you sure you want to destroy?")) {
      el.closest('.locale').model().destroy();
    }
  },
  /**
 *	 Listens for locales being destroyed and removes them from being displayed.
*/
  "locale.destroyed subscribe": function (called, locale) {
    locale.elements().remove();	 //removes ALL elements
  }
});
