module("Model: Graoupack.Models.Project", {
  setup    : function(){$.jStorage.flush();},
  teardown : function(){$.jStorage.flush();}
});

test("create", function(){
  stop(2000);
  new Graoupack.Models.Project({appname:"name", appversion:"1.0"}).save(function(project){
    start();
    ok(project.id);
    equals(project.appname, "name");
    equals(project.appversion, "1.0");
  });
});

test("findOrCreateOne - create", function(){
  stop(2000);
  Graoupack.Models.Project.findOrCreateOne({}, function(project){
    start();
    ok(project);
  });
});

test("findOrCreateOne - find", function(){
  stop(2000);
  new Graoupack.Models.Project({appname:"name", appversion:"1.0"}).save(function(project){
    Graoupack.Models.Project.findOrCreateOne({}, function(project){
      start();
      ok(project.id);
      equals(project.appname, "name");
      equals(project.appversion, "1.0");
    });
  });
});

test("update" , function(){
  stop();
  new Graoupack.Models.Project({appname:"name", appversion:"1.0"}).
    save(function(author){
    equals(author.appversion,"1.0");
    author.update({appversion: "1.1"},function(author){
      start()
      equals(author.appversion,"1.1");
      author.destroy();
    })
  })
});
