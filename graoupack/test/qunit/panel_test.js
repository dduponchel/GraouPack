module("Model: Graoupack.Models.Panel")

test("findAll", function(){
	stop(2000);
	Graoupack.Models.Panel.findAll({}, function(panels){
		start()
		ok(panels)
        ok(panels.length)
        ok(panels[0].name)
        ok(panels[0].description)
	});
	
})

test("create", function(){
	stop(2000);
	new Graoupack.Models.Panel({name: "dry cleaning", description: "take to street corner"}).save(function(panel){
		start();
		ok(panel);
        ok(panel.id);
        equals(panel.name,"dry cleaning")
        panel.destroy()
	})
})
test("update" , function(){
	stop();
	new Graoupack.Models.Panel({name: "cook dinner", description: "chicken"}).
            save(function(panel){
            	equals(panel.description,"chicken");
        		panel.update({description: "steak"},function(panel){
        			start()
        			equals(panel.description,"steak");
        			panel.destroy();
        		})
            })

});
test("destroy", function(){
	stop(2000);
	new Graoupack.Models.Panel({name: "mow grass", description: "use riding mower"}).
            destroy(function(panel){
            	start();
            	ok( true ,"Destroy called" )
            })
})