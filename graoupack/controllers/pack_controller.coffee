###
Licensed under BSD http://en.wikipedia.org/wiki/BSD_License
Copyright (c) 2010, Duponchel David
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the GraouPack nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DUPONCHEL DAVID BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
###

"use strict"

###*
 * @tag controllers, home
 * Displays a table of packs.	 Lets the user
 * ["Graoupack.Controllers.Pack.prototype.form submit" create],
 * ["Graoupack.Controllers.Pack.prototype.&#46;edit click" edit],
 * or ["Graoupack.Controllers.Pack.prototype.&#46;destroy click" destroy] packs.
*###
$.Controller.extend('Graoupack.Controllers.Pack', {
  init: ->
    @load()

  ###*
   * When the page loads, gets all packs to be displayed.
  *###
  load: ->
    Graoupack.Models.Pack.findAll({}, @callback('list'))

  ###*
   * Displays a list of packs and the submit form.
   * @param {Array} packs An array of Graoupack.Models.Pack objects.
  *###
  list: (packs) ->
    $('#Pack').html(@view 'init', {packs: packs})

  ###*
   * Responds to the create form being submitted by creating a new Graoupack.Models.Pack.
   * @param {jQuery} el A jQuery wrapped element.
   * @param {Event} ev A jQuery event whose default action is prevented.
  *###
  'form submit': (el, ev) ->
    ev.preventDefault()
    new Graoupack.Models.Pack(el.formParams()).save()

  ###*
   * Listens for packs being created.	 When a pack is created, displays the new pack.
   * @param {String} called The open ajax event that was called.
   * @param {Event} pack The new pack.
  *###
  'pack.created subscribe': (called, pack) ->
    $("#Pack tbody").append(@view "list", {packs: [pack]})
    $("#Pack form input[type!=submit]").val("") # clear old vals

  ###*
   * Creates and places the edit interface.
   * @param {jQuery} el The pack's edit link element.
  *###
  '.edit click': (el) ->
    pack = el.closest('.pack').model()
    pack.elements().html(this.view 'edit', pack)

  ###*
   * Removes the edit interface.
   * @param {jQuery} el The pack's cancel link element.
  *###
  '.cancel click': (el) ->
    @show(el.closest('.pack').model())

  ###*
   * Updates the pack from the edit values.
  *###
  '.update click': (el) ->
    $pack = el.closest('.pack')
    $pack.model().update($pack.formParams())

  ###*
   * Listens for updated packs.	 When a pack is updated,
   * update's its display.
  *###
  'pack.updated subscribe': (called, pack) ->
    this.show(pack)

  ###*
   * Shows a pack's information.
  *###
  show: (pack) ->
    pack.elements().html(@view 'show', pack)

  ###*
   * Handle's clicking on a pack's destroy link.
  *###
  '.destroy click': (el) ->
    if confirm("Are you sure you want to destroy?")
      el.closest('.pack').model().destroy()

  ###*
   *	 Listens for packs being destroyed and removes them from being displayed.
  *###
  "pack.destroyed subscribe": (called, pack) ->
    pack.elements().remove(); # removes ALL elements

})
