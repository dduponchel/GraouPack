/*global module: true, ok: true, equals: true, S: true, test: true */
module("pack", {
	setup: function () {
		// open the page
		S.open("//graoupack/graoupack.html");

		//make sure there's at least one pack on the page before running a test
		S('.pack').exists();
	},
	//a helper function that creates a pack
	create: function () {
		S("[name=name]").type("Ice");
		S("[name=description]").type("Cold Water");
		S("[type=submit]").click();
		S('.pack:nth-child(2)').exists();
	}
});

test("packs present", function () {
	ok(S('.pack').size() >= 1, "There is at least one pack");
});

test("create packs", function () {

	this.create();

	S(function () {
		ok(S('.pack:nth-child(2) td:first').text().match(/Ice/), "Typed Ice");
	});
});

test("edit packs", function () {

	this.create();

	S('.pack:nth-child(2) a.edit').click();
	S(".pack input[name=name]").type(" Water");
	S(".pack input[name=description]").type("\b\b\b\b\bTap Water");
	S(".update").click();
	S('.pack:nth-child(2) .edit').exists(function () {

		ok(S('.pack:nth-child(2) td:first').text().match(/Ice Water/), "Typed Ice Water");

		ok(S('.pack:nth-child(2) td:nth-child(2)').text().match(/Cold Tap Water/), "Typed Cold Tap Water");
	});
});

test("destroy", function () {

	this.create();

	S(".pack:nth-child(2) .destroy").click();

	//makes the next confirmation return true
	S.confirm(true);

	S('.pack:nth-child(2)').missing(function () {
		ok("destroyed");
	});

});