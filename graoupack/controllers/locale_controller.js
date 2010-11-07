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
