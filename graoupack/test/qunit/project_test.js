module("Model: Graoupack.Models.Project")

test("findAll", function(){
	stop(2000);
	Graoupack.Models.Project.findAll({}, function(projects){
		start()
		ok(projects)
        ok(projects.length)
        ok(projects[0].name)
        ok(projects[0].description)
	});
	
})

test("create", function(){
	stop(2000);
	new Graoupack.Models.Project({name: "dry cleaning", description: "take to street corner"}).save(function(project){
		start();
		ok(project);
        ok(project.id);
        equals(project.name,"dry cleaning")
        project.destroy()
	})
})
test("update" , function(){
	stop();
	new Graoupack.Models.Project({name: "cook dinner", description: "chicken"}).
            save(function(project){
            	equals(project.description,"chicken");
        		project.update({description: "steak"},function(project){
        			start()
        			equals(project.description,"steak");
        			project.destroy();
        		})
            })

});
test("destroy", function(){
	stop(2000);
	new Graoupack.Models.Project({name: "mow grass", description: "use riding mower"}).
            destroy(function(project){
            	start();
            	ok( true ,"Destroy called" )
            })
})