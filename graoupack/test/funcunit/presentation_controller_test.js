/*global module: true, ok: true, equals: true, S: true, test: true */
module("presentation", {
	setup: function () {
		// open the page
		S.open("//graoupack/graoupack.html");

		//make sure there's at least one presentation on the page before running a test
		S('.presentation').exists();
	},
	//a helper function that creates a presentation
	create: function () {
		S("[name=name]").type("Ice");
		S("[name=description]").type("Cold Water");
		S("[type=submit]").click();
		S('.presentation:nth-child(2)').exists();
	}
});

test("presentations present", function () {
	ok(S('.presentation').size() >= 1, "There is at least one presentation");
});

test("create presentations", function () {

	this.create();

	S(function () {
		ok(S('.presentation:nth-child(2) td:first').text().match(/Ice/), "Typed Ice");
	});
});

test("edit presentations", function () {

	this.create();

	S('.presentation:nth-child(2) a.edit').click();
	S(".presentation input[name=name]").type(" Water");
	S(".presentation input[name=description]").type("\b\b\b\b\bTap Water");
	S(".update").click();
	S('.presentation:nth-child(2) .edit').exists(function () {

		ok(S('.presentation:nth-child(2) td:first').text().match(/Ice Water/), "Typed Ice Water");

		ok(S('.presentation:nth-child(2) td:nth-child(2)').text().match(/Cold Tap Water/), "Typed Cold Tap Water");
	});
});

test("destroy", function () {

	this.create();

	S(".presentation:nth-child(2) .destroy").click();

	//makes the next confirmation return true
	S.confirm(true);

	S('.presentation:nth-child(2)').missing(function () {
		ok("destroyed");
	});

});