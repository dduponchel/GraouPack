/*global confirm: true */

/**
 * @tag controllers, home
 * Displays a table of presentations.	 Lets the user 
 * ["Graoupack.Controllers.Presentation.prototype.form submit" create], 
 * ["Graoupack.Controllers.Presentation.prototype.&#46;edit click" edit],
 * or ["Graoupack.Controllers.Presentation.prototype.&#46;destroy click" destroy] presentations.
 */
$.Controller.extend('Graoupack.Controllers.Presentation',
/* @Static */
{
},
/* @Prototype */
{
 /**
 * When the page loads, gets all presentations to be displayed.
 */
 load: function(){
	if(!$("#presentation").length){
	 $(document.body).append($('<div/>').attr('id','presentation'));
		 Graoupack.Models.Presentation.findAll({}, this.callback('list'));
 	}
 },
 /**
 * Displays a list of presentations and the submit form.
 * @param {Array} presentations An array of Graoupack.Models.Presentation objects.
 */
 list: function( presentations ){
	$('#presentation').html(this.view('init', {presentations:presentations} ));
 },
 /**
 * Responds to the create form being submitted by creating a new Graoupack.Models.Presentation.
 * @param {jQuery} el A jQuery wrapped element.
 * @param {Event} ev A jQuery event whose default action is prevented.
 */
'form submit': function( el, ev ){
	ev.preventDefault();
	new Graoupack.Models.Presentation(el.formParams()).save();
},
/**
 * Listens for presentations being created.	 When a presentation is created, displays the new presentation.
 * @param {String} called The open ajax event that was called.
 * @param {Event} presentation The new presentation.
 */
'presentation.created subscribe': function( called, presentation ){
	$("#presentation tbody").append( this.view("list", {presentations:[presentation]}) );
	$("#presentation form input[type!=submit]").val(""); //clear old vals
},
 /**
 * Creates and places the edit interface.
 * @param {jQuery} el The presentation's edit link element.
 */
'.edit click': function( el ){
	var presentation = el.closest('.presentation').model();
	presentation.elements().html(this.view('edit', presentation));
},
 /**
 * Removes the edit interface.
 * @param {jQuery} el The presentation's cancel link element.
 */
'.cancel click': function( el ){
	this.show(el.closest('.presentation').model());
},
 /**
 * Updates the presentation from the edit values.
 */
'.update click': function( el ){
	var $presentation = el.closest('.presentation'); 
	$presentation.model().update($presentation.formParams());
},
 /**
 * Listens for updated presentations.	 When a presentation is updated, 
 * update's its display.
 */
'presentation.updated subscribe': function( called, presentation ){
	this.show(presentation);
},
 /**
 * Shows a presentation's information.
 */
show: function( presentation ){
	presentation.elements().html(this.view('show',presentation));
},
 /**
 *	 Handle's clicking on a presentation's destroy link.
 */
'.destroy click': function( el ){
	if(confirm("Are you sure you want to destroy?")){
		el.closest('.presentation').model().destroy();
	}
 },
 /**
 *	 Listens for presentations being destroyed and removes them from being displayed.
 */
"presentation.destroyed subscribe": function(called, presentation){
	presentation.elements().remove();	 //removes ALL elements
 }
});
