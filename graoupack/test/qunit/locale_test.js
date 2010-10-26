module("Model: Graoupack.Models.Locale")

test("findAll", function(){
	stop(2000);
	Graoupack.Models.Locale.findAll({}, function(locales){
		start()
		ok(locales)
        ok(locales.length)
        ok(locales[0].name)
        ok(locales[0].description)
	});
	
})

test("create", function(){
	stop(2000);
	new Graoupack.Models.Locale({name: "dry cleaning", description: "take to street corner"}).save(function(locale){
		start();
		ok(locale);
        ok(locale.id);
        equals(locale.name,"dry cleaning")
        locale.destroy()
	})
})
test("update" , function(){
	stop();
	new Graoupack.Models.Locale({name: "cook dinner", description: "chicken"}).
            save(function(locale){
            	equals(locale.description,"chicken");
        		locale.update({description: "steak"},function(locale){
        			start()
        			equals(locale.description,"steak");
        			locale.destroy();
        		})
            })

});
test("destroy", function(){
	stop(2000);
	new Graoupack.Models.Locale({name: "mow grass", description: "use riding mower"}).
            destroy(function(locale){
            	start();
            	ok( true ,"Destroy called" )
            })
})