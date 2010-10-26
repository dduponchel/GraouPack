/*global confirm: true */

/**
 * @tag controllers, home
 * Displays a table of panels.	 Lets the user 
 * ["Graoupack.Controllers.Panel.prototype.form submit" create], 
 * ["Graoupack.Controllers.Panel.prototype.&#46;edit click" edit],
 * or ["Graoupack.Controllers.Panel.prototype.&#46;destroy click" destroy] panels.
 */
$.Controller.extend('Graoupack.Controllers.Panel',
/* @Static */
{
},
/* @Prototype */
{
 /**
 * When the page loads, gets all panels to be displayed.
 */
 load: function(){
	if(!$("#panel").length){
	 $(document.body).append($('<div/>').attr('id','panel'));
		 Graoupack.Models.Panel.findAll({}, this.callback('list'));
 	}
 },
 /**
 * Displays a list of panels and the submit form.
 * @param {Array} panels An array of Graoupack.Models.Panel objects.
 */
 list: function( panels ){
	$('#panel').html(this.view('init', {panels:panels} ));
 },
 /**
 * Responds to the create form being submitted by creating a new Graoupack.Models.Panel.
 * @param {jQuery} el A jQuery wrapped element.
 * @param {Event} ev A jQuery event whose default action is prevented.
 */
'form submit': function( el, ev ){
	ev.preventDefault();
	new Graoupack.Models.Panel(el.formParams()).save();
},
/**
 * Listens for panels being created.	 When a panel is created, displays the new panel.
 * @param {String} called The open ajax event that was called.
 * @param {Event} panel The new panel.
 */
'panel.created subscribe': function( called, panel ){
	$("#panel tbody").append( this.view("list", {panels:[panel]}) );
	$("#panel form input[type!=submit]").val(""); //clear old vals
},
 /**
 * Creates and places the edit interface.
 * @param {jQuery} el The panel's edit link element.
 */
'.edit click': function( el ){
	var panel = el.closest('.panel').model();
	panel.elements().html(this.view('edit', panel));
},
 /**
 * Removes the edit interface.
 * @param {jQuery} el The panel's cancel link element.
 */
'.cancel click': function( el ){
	this.show(el.closest('.panel').model());
},
 /**
 * Updates the panel from the edit values.
 */
'.update click': function( el ){
	var $panel = el.closest('.panel'); 
	$panel.model().update($panel.formParams());
},
 /**
 * Listens for updated panels.	 When a panel is updated, 
 * update's its display.
 */
'panel.updated subscribe': function( called, panel ){
	this.show(panel);
},
 /**
 * Shows a panel's information.
 */
show: function( panel ){
	panel.elements().html(this.view('show',panel));
},
 /**
 *	 Handle's clicking on a panel's destroy link.
 */
'.destroy click': function( el ){
	if(confirm("Are you sure you want to destroy?")){
		el.closest('.panel').model().destroy();
	}
 },
 /**
 *	 Listens for panels being destroyed and removes them from being displayed.
 */
"panel.destroyed subscribe": function(called, panel){
	panel.elements().remove();	 //removes ALL elements
 }
});
