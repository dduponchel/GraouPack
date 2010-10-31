/*global confirm: true */

$.Model.extend('Graoupack.Models.Abstract', {
  get : function (key) {
    return JSON.parse(localStorage.getItem(key));
  },
  set : function (key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
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
  updateById : function(key, id, obj) {
    var array = this.getArray(key);
    var matchingArrayIndex = -1;
    for (i in array) {
      if (array[i].id == id) {
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
    localStorage.removeItem(key);
  },
  remove : function (key, index) {
    var array = this.getArray(key);
    array = array.filter(function (arrayValue, arrayIndex, array){return arrayValue.id != index});
    this.set(key, array);
    return array;
  },
  nextIndex : function (key) {
    var lastindex = localStorage.getItem(key + '-lastindex');
    lastindex = lastindex ? lastindex : 0;
    lastindex++;
    localStorage.setItem(key + '-lastindex', lastindex);

    return lastindex;
  },
  nuke : function () {
    localStorage.clear();
  }
},
/* @Prototype */
{
});
