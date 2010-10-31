module("Model: Graoupack.Models.Author", {
  populate : function () {
    localStorage.setItem("authors", '[{"id":1,"name":"test1","mail":"user1@isp.tld"},{"id":2,"name":"test2","mail":"user2@isp.tld"}]');
    localStorage.setItem("authors-lastindex", 2);
  },
  setup    : function(){localStorage.clear();},
  teardown : function(){localStorage.clear();}
});

test("findAll", function(){
  this.populate();
  stop(2000);
  Graoupack.Models.Author.findAll({}, function(authors){
    start();
    ok(authors);
    equals(authors[0].id, 1);
    equals(authors[0].name, "test1");
    equals(authors[0].mail, "user1@isp.tld");
    equals(authors[1].id, 2);
    equals(authors[1].name, "test2");
    equals(authors[1].mail, "user2@isp.tld");
  });
});

test("findAll, empty list", function(){
  stop(2000);
  Graoupack.Models.Author.findAll({}, function(authors){
    start();
    ok(authors);
    same(authors, [], "empty list is returned");
  });
});

test("create", function(){
  this.populate();
  stop(2000);
  new Graoupack.Models.Author({name: "toto", mail: "toto@isp.tld"}).save(function(author){
    start();
    ok(author);
    equals(author.id, 3);
    equals(author.name,"toto");
    author.destroy();
  })
})
test("update" , function(){
  stop();
  new Graoupack.Models.Author({name: "grou", mail: "email@isp.com"}).
    save(function(author){
    equals(author.name,"grou");
    author.update({name: "grAou"},function(author){
      start()
      equals(author.name,"grAou");
      author.destroy();
    })
  })

});
test("destroy", function(){
  stop(2000);
  new Graoupack.Models.Author({name: "graou", mail: "email@isp.com"})
  .destroy(function(author){
    start();
    ok( true ,"Destroy called" );
  });
});
