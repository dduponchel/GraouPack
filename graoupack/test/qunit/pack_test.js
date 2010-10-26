module("Model: Graoupack.Models.Pack")

test("findAll", function(){
	stop(2000);
	Graoupack.Models.Pack.findAll({}, function(packs){
		start()
		ok(packs)
        ok(packs.length)
        ok(packs[0].name)
        ok(packs[0].description)
	});
	
})

test("create", function(){
	stop(2000);
	new Graoupack.Models.Pack({name: "dry cleaning", description: "take to street corner"}).save(function(pack){
		start();
		ok(pack);
        ok(pack.id);
        equals(pack.name,"dry cleaning")
        pack.destroy()
	})
})
test("update" , function(){
	stop();
	new Graoupack.Models.Pack({name: "cook dinner", description: "chicken"}).
            save(function(pack){
            	equals(pack.description,"chicken");
        		pack.update({description: "steak"},function(pack){
        			start()
        			equals(pack.description,"steak");
        			pack.destroy();
        		})
            })

});
test("destroy", function(){
	stop(2000);
	new Graoupack.Models.Pack({name: "mow grass", description: "use riding mower"}).
            destroy(function(pack){
            	start();
            	ok( true ,"Destroy called" )
            })
})