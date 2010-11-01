"use strict";
/**
 * @tag models, home
 * An author of the application.
 */
Graoupack.Models.Abstract.extend('Graoupack.Models.Author', /** @Static */ {
  attributes : {
    name: 'string',
    mail: 'string'
  },
  // taken from http://validity.thatscaptaintoyou.com/
  emailRegex : /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
  init : function () {
    this.validate('mail', function () {
      if (!this.Class.emailRegex.test(this.mail)) {
        return "not an email";
      }
    });
    this.validatePresenceOf('name');
  },
  /**
    * Retrieves all authors.
    * @param {Object} params params that might refine your results.
    * @param {Function} success a callback function that returns wrapped author objects.
    * @param {Function} error a callback function for an error in the ajax request.
    */
  findAll: function (params, success, error) {
    var obj = this.getArray('authors');
    success(this.wrapMany(obj));
  },
  /**
    * Updates a author's data.
    * @param {String} id A unique id representing your author.
    * @param {Object} attrs Data to update your author with.
    * @param {Function} success a callback function that indicates a successful update.
    * @param {Function} error a callback that should be called with an object of errors.
    */
  update: function (id, attrs, success, error) {
    var updated = this.updateById("authors", id, attrs);
    success(updated);
  },
  /**
    * Destroys an author's data.
    * @param {String} id A unique id representing your author.
    * @param {Function} success a callback function that indicates a successful destroy.
    * @param {Function} error a callback that should be called with an object of errors.
    */
  destroy: function (id, success, error) {
    this.remove("authors", id);
    success();
  },
  /**
    * Creates an author.
    * @param {Object} attrs A author's attributes.
    * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
    * @param {Function} error a callback that should be called with an object of errors.
    */
  create: function (attrs, success, error) {
    this.add('authors', attrs);
    success(attrs);
  }
},
/** @Prototype */
{});
