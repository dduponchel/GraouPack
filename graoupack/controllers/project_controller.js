/*global confirm: true */
"use strict";

/**
 * @tag controllers, home
 * Displays a table of projects.	 Lets the user
 * ["Graoupack.Controllers.Project.prototype.form submit" create],
 * ["Graoupack.Controllers.Project.prototype.&#46;edit click" edit],
 * or ["Graoupack.Controllers.Project.prototype.&#46;destroy click" destroy] projects.
*/
$.Controller.extend('Graoupack.Controllers.Project', {
},
{
  /**
   * When the page loads, gets all projects to be displayed.
*/
  init: function (el) {
    $(el).html(this.view('init'));
    Graoupack.Models.Project.findOrCreateOne({}, this.callback('displayProject'));
    Graoupack.Models.Author.findAll({}, this.callback('displayAuthors'));
  },
  displayProject: function (project) {
    $('.project-place-holder', this.element).html(this.view('show_project', {project: project}));
  },
  displayAuthors: function (authors) {
    $('.authors-place-holder', this.element).html(this.view('list_authors', {authors: authors}));
  },
  /**
 * Responds to the create form being submitted by creating a new Graoupack.Models.Project.
 * @param {jQuery} el A jQuery wrapped element.
 * @param {Event} ev A jQuery event whose default action is prevented
*/
  'form submit': function (el, ev) {
    ev.preventDefault();
    var author = new Graoupack.Models.Author(el.formParams()),
    errors, attr, i;
    if(!author.save()) {
      for (attr in author.errors()) {
        $("input[name=" + attr + "]", el).addClass('error');
      }
    }
  },
  'form change': function (el, ev) {
    $(ev.target).removeClass('error');
  },
  /**
 * Listens for projects being created.	 When a project is created, displays the new project.
 * @param {String} called The open ajax event that was called.
 * @param {Event} project The new project.
*/
  'author.created subscribe': function (called, author) {
    $("#Project tbody").append(this.view("list_authors", {authors: [author]}));
    $("#Project form input[type!=submit]").val(""); //clear old vals
  },
  /**
 * Creates and places the edit interface.
 * @param {jQuery} el The project's edit link element.
*/
  '.edit click': function (el) {
    var project = el.closest('.author').model();
    project.elements().html(this.view('edit_author', project));
  },
  /**
 * Removes the edit interface.
 * @param {jQuery} el The project's cancel link element.
*/
  '.cancel click': function (el) {
    this.show(el.closest('.author').model());
  },
  /**
 * Updates the project from the edit values.
*/
  '.update click': function (el) {
    var $author = el.closest('.author');
    $author.model().update($author.formParams());
  },
  /**
 * Listens for updated projects.	 When a project is updated,
 * update's its display.
*/
  'author.updated subscribe': function (called, author) {
    this.show(author);
  },
  /**
 * Shows a project's information.
*/
  show: function (author) {
    author.elements().html(this.view('show_author', author));
  },
  /**
 *	 Handle's clicking on a project's destroy link.
*/
  '.destroy click': function (el) {
    if (confirm("Are you sure you want to destroy?")) {
      el.closest('.author').model().destroy();
    }
  },
  /**
 *	 Listens for projects being destroyed and removes them from being displayed.
*/
  "author.destroyed subscribe": function (called, author) {
    author.elements().remove();	 //removes ALL elements
  },

  '.project-place-holder change' : function (el, ev) {
    var $project = $('.project', el);
    $project.model().update($project.formParams());
  }
});
