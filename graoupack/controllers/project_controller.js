/*global confirm: true */

/**
 * @tag controllers, home
 * Displays a table of projects.	 Lets the user 
 * ["Graoupack.Controllers.Project.prototype.form submit" create], 
 * ["Graoupack.Controllers.Project.prototype.&#46;edit click" edit],
 * or ["Graoupack.Controllers.Project.prototype.&#46;destroy click" destroy] projects.
 */
$.Controller.extend('Graoupack.Controllers.Project',
/* @Static */
{
	onDocument: true
},
/* @Prototype */
{
 /**
 * When the page loads, gets all projects to be displayed.
 */
 load: function(){
	if(!$("#project").length){
	 $(document.body).append($('<div/>').attr('id','project'));
		 Graoupack.Models.Project.findAll({}, this.callback('list'));
 	}
 },
 /**
 * Displays a list of projects and the submit form.
 * @param {Array} projects An array of Graoupack.Models.Project objects.
 */
 list: function( projects ){
	$('#project').html(this.view('init', {projects:projects} ));
 },
 /**
 * Responds to the create form being submitted by creating a new Graoupack.Models.Project.
 * @param {jQuery} el A jQuery wrapped element.
 * @param {Event} ev A jQuery event whose default action is prevented.
 */
'form submit': function( el, ev ){
	ev.preventDefault();
	new Graoupack.Models.Project(el.formParams()).save();
},
/**
 * Listens for projects being created.	 When a project is created, displays the new project.
 * @param {String} called The open ajax event that was called.
 * @param {Event} project The new project.
 */
'project.created subscribe': function( called, project ){
	$("#project tbody").append( this.view("list", {projects:[project]}) );
	$("#project form input[type!=submit]").val(""); //clear old vals
},
 /**
 * Creates and places the edit interface.
 * @param {jQuery} el The project's edit link element.
 */
'.edit click': function( el ){
	var project = el.closest('.project').model();
	project.elements().html(this.view('edit', project));
},
 /**
 * Removes the edit interface.
 * @param {jQuery} el The project's cancel link element.
 */
'.cancel click': function( el ){
	this.show(el.closest('.project').model());
},
 /**
 * Updates the project from the edit values.
 */
'.update click': function( el ){
	var $project = el.closest('.project'); 
	$project.model().update($project.formParams());
},
 /**
 * Listens for updated projects.	 When a project is updated, 
 * update's its display.
 */
'project.updated subscribe': function( called, project ){
	this.show(project);
},
 /**
 * Shows a project's information.
 */
show: function( project ){
	project.elements().html(this.view('show',project));
},
 /**
 *	 Handle's clicking on a project's destroy link.
 */
'.destroy click': function( el ){
	if(confirm("Are you sure you want to destroy?")){
		el.closest('.project').model().destroy();
	}
 },
 /**
 *	 Listens for projects being destroyed and removes them from being displayed.
 */
"project.destroyed subscribe": function(called, project){
	project.elements().remove();	 //removes ALL elements
 }
});