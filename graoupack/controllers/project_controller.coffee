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
 * Handles the Project tab.
*###
$.Controller.extend('Graoupack.Controllers.Project', {
  ###*
   * When the page loads, gets the project and the authors to be displayed.
   * @param {jQuery} el A jQuery wrapped element.
  *###
  init: (el) ->
    $(el).html(@view 'init')
    Graoupack.Models.Project.findOrCreateOne({}, @callback 'displayProject')
    Graoupack.Models.Author.findAll({}, @callback 'displayAuthors')

  displayProject: (project) ->
    $('.project-place-holder', @element).html(@view 'show_project', {project: project})

  displayAuthors: (authors) ->
    $('.authors-place-holder', @element).html(@view 'list_authors', {authors: authors})

  ###*
   * Responds to the create form being submitted by creating a new Graoupack.Models.Project.
   * @param {jQuery} el A jQuery wrapped element.
   * @param {Event} ev A jQuery event whose default action is prevented
  *###
  'form submit': (el, ev) ->
    ev.preventDefault()
    author = new Graoupack.Models.Author(el.formParams())
    if not author.save()
      for attr, text of author.errors()
        $("input[name=" + attr + "]", el).addClass 'error'

  ###*
   * Remove the error css class when editing.
   * @param {jQuery} el A jQuery wrapped element.
   * @param {Event} ev A jQuery event.
  *###
  'form change': (el, ev) ->
    $(ev.target).removeClass('error')

  ###*
   * Listens for projects being created. When a project is created, displays the new project.
   * @param {String} called The open ajax event that was called.
   * @param {Event} project The new project.
  *###
  'author.created subscribe': (called, author) ->
    $("#Project tbody").append(@view "list_authors", {authors: [author]})
    $("#Project form input[type!=submit]").val("") # clear old vals

  ###*
   * Creates and places the edit interface.
   * @param {jQuery} el The project's edit link element.
  *###
  '.edit click': (el) ->
    project = el.closest('.author').model()
    project.elements().html(@view 'edit_author', project)

  ###*
   * Removes the edit interface.
   * @param {jQuery} el The project's cancel link element.
  *###
  '.cancel click': (el) ->
    @show el.closest('.author').model()

  ###*
   * Updates the project from the edit values.
  *###
  '.update click': (el) ->
    $author = el.closest('.author')
    $author.model().update($author.formParams())

  ###*
   * Listens for updated projects.	 When a project is updated,
   * update's its display.
  *###
  'author.updated subscribe': (called, author) ->
    @show author

  ###*
   * Shows a project's information.
  *###
  show: (author) ->
    author.elements().html(@view 'show_author', author)

  ###*
   * Handle's clicking on a project's destroy link.
  *###
  '.destroy click': (el) ->
    if confirm("Are you sure you want to destroy?")
      el.closest('.author').model().destroy()

  ###*
   * Listens for projects being destroyed and removes them from being displayed.
  *###
  "author.destroyed subscribe": (called, author) ->
    author.elements().remove()	# removes ALL elements

  ###*
   * When the project data changes, update the model.
   * @param {jQuery} el A jQuery wrapped element.
   * @param {Event} ev A jQuery event.
  *###
  '.project-place-holder change' : (el, ev) ->
    $project = $('.project', el)
    $project.model().update($project.formParams())
})
