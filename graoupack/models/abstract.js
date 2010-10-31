"use strict";

$.Model.extend('Graoupack.Models.Abstract', {
  storage : window.localStorage,
  get : function (key) {
    return JSON.parse(this.storage.getItem(key));
  },
  set : function (key, obj) {
    this.storage.setItem(key, JSON.stringify(obj));
  },
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
  add : function (key, obj) {
    var array = this.getArray(key);
    obj.id = this.nextIndex(key);
    array.push(obj);
    this.set(key, array);
    return obj;
  },
  destroy : function (key) {
    this.storage.removeItem(key);
  },
  remove : function (key, index) {
    var array = this.getArray(key);
    array = array.filter(function (arrayValue, arrayIndex, array) {
      return arrayValue.id !== index;
    });
    this.set(key, array);
    return array;
  },
  nextIndex : function (key) {
    var lastindex = this.storage.getItem(key + '-lastindex');
    lastindex = lastindex ? lastindex : 0;
    lastindex++;
    this.storage.setItem(key + '-lastindex', lastindex);

    return lastindex;
  },
  nuke : function () {
    this.storage.clear();
  }
},
/* @Prototype */
{
});
