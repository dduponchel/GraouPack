/*global module: true, ok: true, equals: true, S: true, test: true */
module("project", {
	setup: function () {
		// open the page
		S.open("//graoupack/graoupack.html");

		//make sure there's at least one project on the page before running a test
		S('.project').exists();
	},
	//a helper function that creates a project
	create: function () {
		S("[name=name]").type("Ice");
		S("[name=description]").type("Cold Water");
		S("[type=submit]").click();
		S('.project:nth-child(2)').exists();
	}
});

test("projects present", function () {
	ok(S('.project').size() >= 1, "There is at least one project");
});

test("create projects", function () {

	this.create();

	S(function () {
		ok(S('.project:nth-child(2) td:first').text().match(/Ice/), "Typed Ice");
	});
});

test("edit projects", function () {

	this.create();

	S('.project:nth-child(2) a.edit').click();
	S(".project input[name=name]").type(" Water");
	S(".project input[name=description]").type("\b\b\b\b\bTap Water");
	S(".update").click();
	S('.project:nth-child(2) .edit').exists(function () {

		ok(S('.project:nth-child(2) td:first').text().match(/Ice Water/), "Typed Ice Water");

		ok(S('.project:nth-child(2) td:nth-child(2)').text().match(/Cold Tap Water/), "Typed Cold Tap Water");
	});
});

test("destroy", function () {

	this.create();

	S(".project:nth-child(2) .destroy").click();

	//makes the next confirmation return true
	S.confirm(true);

	S('.project:nth-child(2)').missing(function () {
		ok("destroyed");
	});

});