/*
 * Licensed under BSD http://en.wikipedia.org/wiki/BSD_License
 * Copyright (c) 2010, Duponchel David
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the GraouPack nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL DUPONCHEL DAVID BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*global confirm: true */
"use strict";

/**
 * @tag controllers, home
 * Displays a table of panels.	 Lets the user
 * ["Graoupack.Controllers.Panel.prototype.form submit" create],
 * ["Graoupack.Controllers.Panel.prototype.&#46;edit click" edit],
 * or ["Graoupack.Controllers.Panel.prototype.&#46;destroy click" destroy] panels.
*/
$.Controller.extend('Graoupack.Controllers.Panel', /* @Static */ {
  availablePanels : [],
  init : function() {
    this._super.apply(this, arguments);
    for (var i in Graoupack.Models.Panels) {
      this.availablePanels.push(Graoupack.Models.Panels[i].shortName);
    }
  }
},
/* @Prototype */
{
  infoDialog : null,
  infoDialogContentId : "tab-panel-info-dialog",

  init: function (el) {
    $(el).html(this.view('init', {available : this.Class.availablePanels}));
    Graoupack.Models.Panel.findAll({}, this.callback('displaySelected'));
    this.infoDialog = $("<div/>").append('<div id="' + this.infoDialogContentId + '"/>').dialog({
      autoOpen : false,
      width : 510
    });
  },
  /**
 * Displays a list of panels.
 * @param {Array} panels An array of Graoupack.Models.Panel objects.
*/
  displaySelected : function (panels) {
    $('#tab-panel-selected', this.element).html(this.view('selected', {panels: panels}));
  },
  /**
 * Show the help if the user click on a .info button.
 * @param {jQuery} el A jQuery wrapped element.
 * @param {Event} ev A jQuery event whose default action is prevented.
*/
  '.info click': function (el, ev) {
    ev.preventDefault();
    var panel = el.closest('.panel');
    this.infoDialog
    $('#' + this.infoDialogContentId).html(this.view('panel/help/' + panel.attr("data-class")));
    infoDialog : null,
    this.infoDialog.dialog('option', 'title', $(".summary h3", panel).text())
    .dialog("open");
  },
  /**
 * Listens for panels being created.	 When a panel is created, displays the new panel.
 * @param {String} called The open ajax event that was called.
 * @param {Event} panel The new panel.
*/
  'panel.created subscribe': function (called, panel) {
    $("#panel tbody").append(this.view("list", {panels: [panel]}));
    $("#panel form input[type!=submit]").val(""); //clear old vals
  },
  /**
 * Creates and places the edit interface.
 * @param {jQuery} el The panel's edit link element.
*/
  '.edit click': function (el) {
    var panel = el.closest('.panel').model();
    panel.elements().html(this.view('edit', panel));
  },
  /**
 * Removes the edit interface.
 * @param {jQuery} el The panel's cancel link element.
*/
  '.cancel click': function (el) {
    this.show(el.closest('.panel').model());
  },
  /**
 * Updates the panel from the edit values.
*/
  '.update click': function (el) {
    var $panel = el.closest('.panel');
    $panel.model().update($panel.formParams());
  },
  /**
 * Listens for updated panels.	 When a panel is updated,
 * update's its display.
*/
  'panel.updated subscribe': function (called, panel) {
    this.show(panel);
  },
  /**
 * Shows a panel's information.
*/
  show: function (panel) {
    panel.elements().html(this.view('show', panel));
  },
  /**
 *	 Handle's clicking on a panel's destroy link.
*/
  '.destroy click': function (el) {
    if (confirm("Are you sure you want to destroy?")) {
      el.closest('.panel').model().destroy();
    }
  },
  /**
 *	 Listens for panels being destroyed and removes them from being displayed.
*/
  "panel.destroyed subscribe": function (called, panel) {
    panel.elements().remove();	 //removes ALL elements
  }
});
