module("Model: Graoupack.Models.Abstract", {
  setup    : function(){$.jStorage.flush();},
  teardown : function(){$.jStorage.flush();}
});

test("get", function(){
  $.jStorage.set("testKey", {"name":"test","version":1});
  var testObj = Graoupack.Models.Abstract.get("testKey");
  ok(testObj, 'deserialized object');
  same(testObj, {"name":"test","version":1}, 'deserialization ok');
});

test("get - undefined value", function(){
  var testObj = Graoupack.Models.Abstract.get("unknownTestKey");
  equals(testObj, null, 'object is null');
});

test("set", function(){
  Graoupack.Models.Abstract.set("testKey", {"name":"test2","version":2});
  var stored = $.jStorage.get("testKey");
  same(stored, {"name":"test2","version":2}, 'serialized object');
});

test("getArray", function(){
   $.jStorage.set("testArray", [{"name":"t3st","version":3}, {"name":"test4","version":4}]);
  var testObj = Graoupack.Models.Abstract.getArray("testArray");
  ok(testObj, 'deserialized object');
  ok($.isArray(testObj), 'object is an array');
  same(testObj, [{"name":"t3st","version":3}, {"name":"test4","version":4}], 'deserialization ok');
});

test("getArray - create one if none", function(){
  var testObj = Graoupack.Models.Abstract.getArray("unknownKey");
  ok(testObj, 'deserialized object');
  ok($.isArray(testObj), 'object is an array');
  same(testObj, [], 'deserialization ok');
});

test("getArray - throw exception if not an array", function(){
  $.jStorage.set("not an array", {"name":"test","version":1});
  try {
    Graoupack.Models.Abstract.getArray("not an array");
    ok(false, "no exception thrown");
  }
  catch(e) {
    ok(true, "exception thrown");
  }
});

test("updateById", function () {
  $.jStorage.set("array", [{"id":1,"name":"graou1"},{"id":2,"name":"graou2"},{"id":3,"name":"graou3"}]);
  var newObj = {id:42, name:'graougraou'};
  var response = Graoupack.Models.Abstract.updateById("array", 2, newObj);
  same($.jStorage.get("array"), [{"id":1,"name":"graou1"},{"id":42,"name":"graougraou"},{"id":3,"name":"graou3"}]);
  same(response, newObj, "the new value is returned");
});

test("updateById - exception with an inexistant id", function () {
  $.jStorage.set("array", [{"id":1,"name":"graou1"}]);
  var newObj = {id:42, name:'graougraou'};
  try {
    Graoupack.Models.Abstract.updateById("array", 66, newObj);
    ok(false, "exception thrown");
  }
  catch (e) {
    ok(true, "exception thrown");
  }
});

test("add", function () {
  var newObj = {name:'graougraou'};
  Graoupack.Models.Abstract.add("array", newObj);
  equals(newObj.id, 1, "id updated");
  var newObj2 = {name:'graougraou2'};
  Graoupack.Models.Abstract.add("array", newObj2);
  equals(newObj2.id, 2, "id updated, last index updated");
});

test("destroy", function () {
  $.jStorage.set("key", {"id":1,"name":"graou1"});
  ok(Graoupack.Models.Abstract.get('key'), "the object is here");
  Graoupack.Models.Abstract.destroy('key');
  ok(!Graoupack.Models.Abstract.get('key'), "no longer here");
});

test("remove", function () {
  $.jStorage.set("array", [{"id":1,"name":"graou1"},{"id":2,"name":"graou2"},{"id":3,"name":"graou3"}]);
  var response = Graoupack.Models.Abstract.remove("array", 2);
  same($.jStorage.get("array"), [{"id":1,"name":"graou1"},{"id":3,"name":"graou3"}]);
  same(response, [{"id":1,"name":"graou1"},{"id":3,"name":"graou3"}], "the new array is returned");
});

test("nextIndex", function(){
  equals(Graoupack.Models.Abstract.nextIndex("key1"), 1, "first index = 1");
  equals(Graoupack.Models.Abstract.nextIndex("key1"), 2, "second index = 2");
  equals(Graoupack.Models.Abstract.nextIndex("key1"), 3, "third index = 3");
  equals(Graoupack.Models.Abstract.nextIndex("key2"), 1, "another index = 1");
});

test("nuke", function () {
   $.jStorage.set("key", {"id":1,"name":"graou1"});
   equals($.jStorage.index().length, 1, "storage not emtpy");
   Graoupack.Models.Abstract.nuke();
   equals($.jStorage.index().length, 0, "storage emtpy");
});
