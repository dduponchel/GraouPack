/*
 * Licensed under BSD http://en.wikipedia.org/wiki/BSD_License
 * Copyright (c) 2010, Duponchel David
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the GraouPack nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL DUPONCHEL DAVID BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

"use strict";

// steal.resources('jStorage/jstorage').then(function ( $ ) {
steal('//graoupack/resources/jStorage/jstorage').then(function ( $ ) {
  /**
   * @tag models, home
   * An parent model, which contains the static methods to handle the storage.
   */
  $.Model.extend('Graoupack.Models.Abstract', /* @Static */ {
    /**
     * get a value based on his key.
     * @param {String} key the identifier of the object value.
     * @return {Object} the object.
     */
    get : function (key) {
      return $.jStorage.get(key);
    },
    /**
     * set a value.
     * @param {String} key the identifier.
     * @param {Object} the value to set.
     */
    set : function (key, obj) {
      $.jStorage.set(key, obj);
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
      $.jStorage.deleteKey(key);
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
     * @return {Integer} the new index.
     */
    nextIndex : function (key) {
      var lastindex = this.get(key + '-lastindex');
      lastindex = lastindex ? lastindex : 0;
      lastindex++;
      this.set(key + '-lastindex', lastindex);

      return lastindex;
    },
    /**
     * Empty the db.
     */
    nuke : function () {
      $.jStorage.flush();
    }
  },
  /* @Prototype */
  {
  });
});
