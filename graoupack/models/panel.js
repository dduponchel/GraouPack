"use strict";
/**
 * @tag models, home
 * Wraps backend panel services.  Enables
 * [Graoupack.Models.Panel.static.findAll retrieving],
 * [Graoupack.Models.Panel.static.update updating],
 * [Graoupack.Models.Panel.static.destroy destroying], and
 * [Graoupack.Models.Panel.static.create creating] panels.
*/
$.Model.extend('Graoupack.Models.Panel', {
  /**
         * Retrieves panels data from your backend services.
         * @param {Object} params params that might refine your results.
         * @param {Function} success a callback function that returns wrapped panel objects.
         * @param {Function} error a callback function for an error in the ajax request.
*/
  findAll: function (params, success, error) {
    $.ajax({
      url: '/panel',
      type: 'get',
      dataType: 'json',
      data: params,
      success: this.callback(['wrapMany', success]),
      error: error,
      fixture: "//graoupack/fixtures/panels.json.get" //calculates the fixture path from the url and type.
    });
  },
  /**
         * Updates a panel's data.
         * @param {String} id A unique id representing your panel.
         * @param {Object} attrs Data to update your panel with.
         * @param {Function} success a callback function that indicates a successful update.
         * @param {Function} error a callback that should be called with an object of errors.
*/
  update: function (id, attrs, success, error) {
    $.ajax({
      url: '/panels/' + id,
      type: 'put',
      dataType: 'json',
      data: attrs,
      success: success,
      error: error,
      fixture: "-restUpdate" //uses $.fixture.restUpdate for response.
    });
  },
  /**
         * Destroys a panel's data.
         * @param {String} id A unique id representing your panel.
         * @param {Function} success a callback function that indicates a successful destroy.
         * @param {Function} error a callback that should be called with an object of errors.
*/
  destroy: function (id, success, error) {
    $.ajax({
      url: '/panels/' + id,
      type: 'delete',
      dataType: 'json',
      success: success,
      error: error,
      fixture: "-restDestroy" // uses $.fixture.restDestroy for response.
    });
  },
  /**
         * Creates a panel.
         * @param {Object} attrs A panel's attributes.
         * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
         * @param {Function} error a callback that should be called with an object of errors.
*/
  create: function (attrs, success, error) {
    $.ajax({
      url: '/panels',
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
