/**
 * @tag models, home
 * Wraps backend locale services.  Enables 
 * [Graoupack.Models.Locale.static.findAll retrieving],
 * [Graoupack.Models.Locale.static.update updating],
 * [Graoupack.Models.Locale.static.destroy destroying], and
 * [Graoupack.Models.Locale.static.create creating] locales.
 */
$.Model.extend('Graoupack.Models.Locale',
/* @Static */
{
	/**
 	 * Retrieves locales data from your backend services.
 	 * @param {Object} params params that might refine your results.
 	 * @param {Function} success a callback function that returns wrapped locale objects.
 	 * @param {Function} error a callback function for an error in the ajax request.
 	 */
	findAll: function( params, success, error ){
		$.ajax({
			url: '/locale',
			type: 'get',
			dataType: 'json',
			data: params,
			success: this.callback(['wrapMany',success]),
			error: error,
			fixture: "//graoupack/fixtures/locales.json.get" //calculates the fixture path from the url and type.
		});
	},
	/**
	 * Updates a locale's data.
	 * @param {String} id A unique id representing your locale.
	 * @param {Object} attrs Data to update your locale with.
	 * @param {Function} success a callback function that indicates a successful update.
 	 * @param {Function} error a callback that should be called with an object of errors.
     */
	update: function( id, attrs, success, error ){
		$.ajax({
			url: '/locales/'+id,
			type: 'put',
			dataType: 'json',
			data: attrs,
			success: success,
			error: error,
			fixture: "-restUpdate" //uses $.fixture.restUpdate for response.
		});
	},
	/**
 	 * Destroys a locale's data.
 	 * @param {String} id A unique id representing your locale.
	 * @param {Function} success a callback function that indicates a successful destroy.
 	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	destroy: function( id, success, error ){
		$.ajax({
			url: '/locales/'+id,
			type: 'delete',
			dataType: 'json',
			success: success,
			error: error,
			fixture: "-restDestroy" // uses $.fixture.restDestroy for response.
		});
	},
	/**
	 * Creates a locale.
	 * @param {Object} attrs A locale's attributes.
	 * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	create: function( attrs, success, error ){
		$.ajax({
			url: '/locales',
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