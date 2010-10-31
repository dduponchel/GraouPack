"use strict";
/**
 * @tag models, home
 * Wraps backend pack services.  Enables
 * [Graoupack.Models.Pack.static.findAll retrieving],
 * [Graoupack.Models.Pack.static.update updating],
 * [Graoupack.Models.Pack.static.destroy destroying], and
 * [Graoupack.Models.Pack.static.create creating] packs.
*/
$.Model.extend('Graoupack.Models.Pack', {
  /**
         * Retrieves packs data from your backend services.
         * @param {Object} params params that might refine your results.
         * @param {Function} success a callback function that returns wrapped pack objects.
         * @param {Function} error a callback function for an error in the ajax request.
*/
  findAll: function (params, success, error) {
    $.ajax({
      url: '/pack',
      type: 'get',
      dataType: 'json',
      data: params,
      success: this.callback(['wrapMany', success]),
      error: error,
      fixture: "//graoupack/fixtures/packs.json.get" //calculates the fixture path from the url and type.
    });
  },
  /**
         * Updates a pack's data.
         * @param {String} id A unique id representing your pack.
         * @param {Object} attrs Data to update your pack with.
         * @param {Function} success a callback function that indicates a successful update.
         * @param {Function} error a callback that should be called with an object of errors.
*/
  update: function (id, attrs, success, error) {
    $.ajax({
      url: '/packs/' + id,
      type: 'put',
      dataType: 'json',
      data: attrs,
      success: success,
      error: error,
      fixture: "-restUpdate" //uses $.fixture.restUpdate for response.
    });
  },
  /**
         * Destroys a pack's data.
         * @param {String} id A unique id representing your pack.
         * @param {Function} success a callback function that indicates a successful destroy.
         * @param {Function} error a callback that should be called with an object of errors.
*/
  destroy: function (id, success, error) {
    $.ajax({
      url: '/packs/' + id,
      type: 'delete',
      dataType: 'json',
      success: success,
      error: error,
      fixture: "-restDestroy" // uses $.fixture.restDestroy for response.
    });
  },
  /**
         * Creates a pack.
         * @param {Object} attrs A pack's attributes.
         * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
         * @param {Function} error a callback that should be called with an object of errors.
*/
  create: function (attrs, success, error) {
    $.ajax({
      url: '/packs',
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
