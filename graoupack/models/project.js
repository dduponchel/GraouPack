"use strict";
/**
 * @tag models, home
 * The project the user is working on.
*/
Graoupack.Models.Abstract.extend('Graoupack.Models.Project', /* @Static */ {
  attributes : {
    appname : 'string',
    appversion : 'string'
  },
  /**
    * Retrieves the project, or create one if none.
    * @param {Object} params params that might refine your results.
    * @param {Function} success a callback function that returns wrapped project objects.
    * @param {Function} error a callback function for an error in the ajax request.
    */
  findOrCreateOne: function (params, success, error) {
    var obj = this.get('project');
    if (obj === null) {
      obj = new Graoupack.Models.Project().save(this.callback(['wrap', success]));
    }
    else {
      success(this.wrap(obj));
    }
  },
  /**
    * Updates a project's data.
    * @param {String} id A unique id representing your project.
    * @param {Object} attrs Data to update your project with.
    * @param {Function} success a callback function that indicates a successful update.
    * @param {Function} error a callback that should be called with an object of errors.
    */
  update: function (id, attrs, success, error) {
    this.set('project', attrs);
    success(attrs);
  },
  /**
    * Creates a project.
    * @param {Object} attrs A project's attributes.
    * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
    * @param {Function} error a callback that should be called with an object of errors.
    */
  create: function (attrs, success, error) {
    attrs.id = 'onlyOne';
    this.set('project', attrs);
    success(attrs);
  }
},
/* @Prototype */
{});
