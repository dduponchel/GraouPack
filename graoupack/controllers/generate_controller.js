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
$.Controller.extend('Graoupack.Controllers.Generate', /* @Static */ {
},
/* @Prototype */
{
  /**
 * The dialog with tabs displaying the generated xml
 */
  dialog : null,
  /**
   * @param {jQuery} el A jQuery wrapped element.
*/
  init : function (el) {
    $(el).html(this.view('init'));
    $(".generateXML button", el).button();
    this.dialog = $(".dialog", el).dialog({
      autoOpen : false,
      modal    : true,
      title    : "generated XML",
      width    : 700,
      height   : 500
    }).tabs();
    $(el).show();
  },
  /**
    * When the list of selected locales is updated, tell the model.
    * @param {jQuery} el A jQuery wrapped element.
    * @param {Event} ev A jQuery event.
    */
  '.generateXML button click' : function (el, ev) {
    this.dialog.dialog("open");
  }
});
