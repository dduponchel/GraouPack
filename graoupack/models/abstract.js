"use strict";

/**
 * @tag models, home
 * An parent model, which contains the static methods to handle the storage.
*/
$.Model.extend('Graoupack.Models.Abstract', /* @Static */ {
  /**
 * the object which will hold all the data.
 */
  storage : window.localStorage,
  /**
 * get a value based on his key.
 * @param {String} key the identifier of the object value.
 * @return {Object} the object.
 */
  get : function (key) {
    return JSON.parse(this.storage.getItem(key));
  },
  /**
 * set a value.
 * @param {String} key the identifier.
 * @param {Object} the value to set.
 */
  set : function (key, obj) {
    this.storage.setItem(key, JSON.stringify(obj));
  },
  /**
 * get an array by its key.
 * @param {String} key
 * @return {Array} The array if it exists, else [].
 */
  getArray : function (key) {
    var array = this.get(key);
    if (array === null) {
      array = [];
    }
    if (!$.isArray(array)) {
      throw key + " is not an array";
    }
    return array;
  },
  /**
 * Update an object in an array.
 * @param {String} key the identifier of the array.
 * @param {String} id the id of the object to update.
 * @param {Object} obj the new object.
 * @return {Object} the updated object.
 */
  updateById : function (key, id, obj) {
    var array = this.getArray(key),
        matchingArrayIndex = -1,
        i;
    for (i in array) {
      if (array[i].id === id) {
        matchingArrayIndex = i;
        break;
      }
    }
    if (matchingArrayIndex < 0) {
      throw "id " + id + " not found for " + key;
    }
    array[matchingArrayIndex] = obj;
    this.set(key, array);
    return obj;
  },
  /**
 * Add an object to an array.
 * @param {String} key the identifier of the array.
 * @param {Object} obj the object to add.
 * @return {Object} The updated object (with an id).
 */
  add : function (key, obj) {
    var array = this.getArray(key);
    obj.id = this.nextIndex(key);
    array.push(obj);
    this.set(key, array);
    return obj;
  },
  /**
 * Destroy an object from this database.
 * @param {String} key the id of the object.
 */
  destroy : function (key) {
    this.storage.removeItem(key);
  },
  /**
 * Remove an object from an array.
 * @param {String} key the id of the array.
 * @param {String} objId the id of the object in the array to remove.
 * @return {Array} the updated array.
 */
  remove : function (key, objId) {
    var array = this.getArray(key);
    array = array.filter(function (value, index, array) {
      return value.id !== objId;
    });
    this.set(key, array);
    return array;
  },
  /**
 * Get the next index for the selected key.
 * @param {String} key the key.
 * @return {String} the new index.
 */
  nextIndex : function (key) {
    var lastindex = this.storage.getItem(key + '-lastindex');
    lastindex = lastindex ? lastindex : 0;
    lastindex++;
    lastindex = lastindex + ''; // to have a string
    this.storage.setItem(key + '-lastindex', lastindex);

    return lastindex;
  },
  /**
 * Empty the db.
 */
  nuke : function () {
    this.storage.clear();
  }
},
/* @Prototype */
{
});
