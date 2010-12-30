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
 * Controls the page and creates the tab controllers.
*###
$.Controller.extend('Graoupack.Controllers.Main', {
  onDocument: true
  tabs : {
    'Presentation'  : 'presentation'
    'Project'       : 'my application'
    'Locale'        : 'locales'
    'Panel'         : 'panels'
    'Pack'          : 'packs'
  }
  hiddenControllers : [
    'Generate'
  ]
},
{
  ###*
   * init the page.
  *###
  init: ->
    $("#loading p").append(" (almost !)")
    if not $("#GraouPack").length
      $(document.body).append($('<div/>').hide().attr('id', 'GraouPack'))
      $('#GraouPack').html(this.view 'init',
        tabs : @Class.tabs
        hidden : @Class.hiddenControllers
      )

  ###*
   * When the page loads, create the tabs and the controllers.
  *###
  load: ->
    $("#GraouPack")
    .bind("tabsshow", (event, ui) ->
      panel = $(ui.panel)
      if not panel.data("controller")
        panel.data("controller", new Graoupack.Controllers[panel.attr('id')](panel))
    )
    .tabs()
    .show()
    $("#loading").remove()

    for controller in @Class.hiddenControllers
      panel = $("#" + controller)
      new Graoupack.Controllers[controller](panel)
})
