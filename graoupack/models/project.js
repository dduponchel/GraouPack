/**
 * @tag models, home
 * Wraps backend project services.  Enables 
 * [Graoupack.Models.Project.static.findAll retrieving],
 * [Graoupack.Models.Project.static.update updating],
 * [Graoupack.Models.Project.static.destroy destroying], and
 * [Graoupack.Models.Project.static.create creating] projects.
 */
$.Model.extend('Graoupack.Models.Project',
/* @Static */
{
	/**
 	 * Retrieves projects data from your backend services.
 	 * @param {Object} params params that might refine your results.
 	 * @param {Function} success a callback function that returns wrapped project objects.
 	 * @param {Function} error a callback function for an error in the ajax request.
 	 */
	findAll: function( params, success, error ){
		$.ajax({
			url: '/project',
			type: 'get',
			dataType: 'json',
			data: params,
			success: this.callback(['wrapMany',success]),
			error: error,
			fixture: "//graoupack/fixtures/projects.json.get" //calculates the fixture path from the url and type.
		});
	},
	/**
	 * Updates a project's data.
	 * @param {String} id A unique id representing your project.
	 * @param {Object} attrs Data to update your project with.
	 * @param {Function} success a callback function that indicates a successful update.
 	 * @param {Function} error a callback that should be called with an object of errors.
     */
	update: function( id, attrs, success, error ){
		$.ajax({
			url: '/projects/'+id,
			type: 'put',
			dataType: 'json',
			data: attrs,
			success: success,
			error: error,
			fixture: "-restUpdate" //uses $.fixture.restUpdate for response.
		});
	},
	/**
 	 * Destroys a project's data.
 	 * @param {String} id A unique id representing your project.
	 * @param {Function} success a callback function that indicates a successful destroy.
 	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	destroy: function( id, success, error ){
		$.ajax({
			url: '/projects/'+id,
			type: 'delete',
			dataType: 'json',
			success: success,
			error: error,
			fixture: "-restDestroy" // uses $.fixture.restDestroy for response.
		});
	},
	/**
	 * Creates a project.
	 * @param {Object} attrs A project's attributes.
	 * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	create: function( attrs, success, error ){
		$.ajax({
			url: '/projects',
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