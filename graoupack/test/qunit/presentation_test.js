module("Model: Graoupack.Models.Presentation")

test("findAll", function(){
	stop(2000);
	Graoupack.Models.Presentation.findAll({}, function(presentations){
		start()
		ok(presentations)
        ok(presentations.length)
        ok(presentations[0].name)
        ok(presentations[0].description)
	});
	
})

test("create", function(){
	stop(2000);
	new Graoupack.Models.Presentation({name: "dry cleaning", description: "take to street corner"}).save(function(presentation){
		start();
		ok(presentation);
        ok(presentation.id);
        equals(presentation.name,"dry cleaning")
        presentation.destroy()
	})
})
test("update" , function(){
	stop();
	new Graoupack.Models.Presentation({name: "cook dinner", description: "chicken"}).
            save(function(presentation){
            	equals(presentation.description,"chicken");
        		presentation.update({description: "steak"},function(presentation){
        			start()
        			equals(presentation.description,"steak");
        			presentation.destroy();
        		})
            })

});
test("destroy", function(){
	stop(2000);
	new Graoupack.Models.Presentation({name: "mow grass", description: "use riding mower"}).
            destroy(function(presentation){
            	start();
            	ok( true ,"Destroy called" )
            })
})