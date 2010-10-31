/*global confirm: true */
"use strict";

/**
 * @tag controllers, home
 * Displays a table of packs.	 Lets the user
 * ["Graoupack.Controllers.Pack.prototype.form submit" create],
 * ["Graoupack.Controllers.Pack.prototype.&#46;edit click" edit],
 * or ["Graoupack.Controllers.Pack.prototype.&#46;destroy click" destroy] packs.
*/
$.Controller.extend('Graoupack.Controllers.Pack', {
},
/* @Prototype */
{
  init: function () {
    this.load();
  },
  /**
 * When the page loads, gets all packs to be displayed.
*/
  load: function () {
    Graoupack.Models.Pack.findAll({}, this.callback('list'));
  },
  /**
 * Displays a list of packs and the submit form.
 * @param {Array} packs An array of Graoupack.Models.Pack objects.
*/
  list: function (packs) {
    $('#Pack').html(this.view('init', {packs: packs}));
  },
  /**
 * Responds to the create form being submitted by creating a new Graoupack.Models.Pack.
 * @param {jQuery} el A jQuery wrapped element.
 * @param {Event} ev A jQuery event whose default action is prevented.
*/
  'form submit': function (el, ev) {
    ev.preventDefault();
    console.log(el.formParams());
    new Graoupack.Models.Pack(el.formParams()).save();
  },
  /**
 * Listens for packs being created.	 When a pack is created, displays the new pack.
 * @param {String} called The open ajax event that was called.
 * @param {Event} pack The new pack.
*/
  'pack.created subscribe': function (called, pack) {
    $("#Pack tbody").append(this.view("list", {packs: [pack]}));
    $("#Pack form input[type!=submit]").val(""); //clear old vals
  },
  /**
 * Creates and places the edit interface.
 * @param {jQuery} el The pack's edit link element.
*/
  '.edit click': function (el) {
    var pack = el.closest('.pack').model();
    pack.elements().html(this.view('edit', pack));
  },
  /**
 * Removes the edit interface.
 * @param {jQuery} el The pack's cancel link element.
*/
  '.cancel click': function (el) {
    this.show(el.closest('.pack').model());
  },
  /**
 * Updates the pack from the edit values.
*/
  '.update click': function (el) {
    var $pack = el.closest('.pack');
    $pack.model().update($pack.formParams());
  },
  /**
 * Listens for updated packs.	 When a pack is updated,
 * update's its display.
*/
  'pack.updated subscribe': function (called, pack) {
    this.show(pack);
  },
  /**
 * Shows a pack's information.
*/
  show: function (pack) {
    pack.elements().html(this.view('show', pack));
  },
  /**
 *	 Handle's clicking on a pack's destroy link.
*/
  '.destroy click': function (el) {
    if (confirm("Are you sure you want to destroy?")) {
      el.closest('.pack').model().destroy();
    }
  },
  /**
 *	 Listens for packs being destroyed and removes them from being displayed.
*/
  "pack.destroyed subscribe": function (called, pack) {
    pack.elements().remove();	 //removes ALL elements
  }
});
