/**
 * @tag models, home
 * Wraps backend author services.  Enables
 * [Graoupack.Models.Author.static.findAll retrieving],
 * [Graoupack.Models.Author.static.update updating],
 * [Graoupack.Models.Author.static.destroy destroying], and
 * [Graoupack.Models.Author.static.create creating] authors.
 */
Graoupack.Models.Abstract.extend('Graoupack.Models.Author', {
  attributes : {
    name: 'string',
    mail: 'string'
  },
  /**
    * Retrieves authors data from your backend services.
    * @param {Object} params params that might refine your results.
    * @param {Function} success a callback function that returns wrapped author objects.
    * @param {Function} error a callback function for an error in the ajax request.
    */
  findAll: function( params, success, error ){
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
  update: function( id, attrs, success, error ){
    var updated = this.updateById("authors", id, attrs);
    success(updated);
  },
  /**
    * Destroys a author's data.
    * @param {String} id A unique id representing your author.
    * @param {Function} success a callback function that indicates a successful destroy.
    * @param {Function} error a callback that should be called with an object of errors.
    */
  destroy: function( id, success, error ){
    this.remove("authors", id);
    success();
  },
  /**
    * Creates a author.
    * @param {Object} attrs A author's attributes.
    * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
    * @param {Function} error a callback that should be called with an object of errors.
    */
  create: function( attrs, success, error ){
    this.add('authors', attrs);
    success(attrs);
  }
},
/* @Prototype */
{});
