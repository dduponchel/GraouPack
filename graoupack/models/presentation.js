/**
 * @tag models, home
 * Wraps backend presentation services.  Enables 
 * [Graoupack.Models.Presentation.static.findAll retrieving],
 * [Graoupack.Models.Presentation.static.update updating],
 * [Graoupack.Models.Presentation.static.destroy destroying], and
 * [Graoupack.Models.Presentation.static.create creating] presentations.
 */
$.Model.extend('Graoupack.Models.Presentation',
/* @Static */
{
	/**
 	 * Retrieves presentations data from your backend services.
 	 * @param {Object} params params that might refine your results.
 	 * @param {Function} success a callback function that returns wrapped presentation objects.
 	 * @param {Function} error a callback function for an error in the ajax request.
 	 */
	findAll: function( params, success, error ){
		$.ajax({
			url: '/presentation',
			type: 'get',
			dataType: 'json',
			data: params,
			success: this.callback(['wrapMany',success]),
			error: error,
			fixture: "//graoupack/fixtures/presentations.json.get" //calculates the fixture path from the url and type.
		});
	},
	/**
	 * Updates a presentation's data.
	 * @param {String} id A unique id representing your presentation.
	 * @param {Object} attrs Data to update your presentation with.
	 * @param {Function} success a callback function that indicates a successful update.
 	 * @param {Function} error a callback that should be called with an object of errors.
     */
	update: function( id, attrs, success, error ){
		$.ajax({
			url: '/presentations/'+id,
			type: 'put',
			dataType: 'json',
			data: attrs,
			success: success,
			error: error,
			fixture: "-restUpdate" //uses $.fixture.restUpdate for response.
		});
	},
	/**
 	 * Destroys a presentation's data.
 	 * @param {String} id A unique id representing your presentation.
	 * @param {Function} success a callback function that indicates a successful destroy.
 	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	destroy: function( id, success, error ){
		$.ajax({
			url: '/presentations/'+id,
			type: 'delete',
			dataType: 'json',
			success: success,
			error: error,
			fixture: "-restDestroy" // uses $.fixture.restDestroy for response.
		});
	},
	/**
	 * Creates a presentation.
	 * @param {Object} attrs A presentation's attributes.
	 * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	create: function( attrs, success, error ){
		$.ajax({
			url: '/presentations',
			type: 'post',
			dataType: 'json',
			success: success,
			error: error,
			data: attrs,
			fixture: "-restCreate" //uses $.fixture.restCreate for response.
		});
	}
},
/* @Prototype */
{});