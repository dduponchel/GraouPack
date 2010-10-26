/*global module: true, ok: true, equals: true, S: true, test: true */
module("panel", {
	setup: function () {
		// open the page
		S.open("//graoupack/graoupack.html");

		//make sure there's at least one panel on the page before running a test
		S('.panel').exists();
	},
	//a helper function that creates a panel
	create: function () {
		S("[name=name]").type("Ice");
		S("[name=description]").type("Cold Water");
		S("[type=submit]").click();
		S('.panel:nth-child(2)').exists();
	}
});

test("panels present", function () {
	ok(S('.panel').size() >= 1, "There is at least one panel");
});

test("create panels", function () {

	this.create();

	S(function () {
		ok(S('.panel:nth-child(2) td:first').text().match(/Ice/), "Typed Ice");
	});
});

test("edit panels", function () {

	this.create();

	S('.panel:nth-child(2) a.edit').click();
	S(".panel input[name=name]").type(" Water");
	S(".panel input[name=description]").type("\b\b\b\b\bTap Water");
	S(".update").click();
	S('.panel:nth-child(2) .edit').exists(function () {

		ok(S('.panel:nth-child(2) td:first').text().match(/Ice Water/), "Typed Ice Water");

		ok(S('.panel:nth-child(2) td:nth-child(2)').text().match(/Cold Tap Water/), "Typed Cold Tap Water");
	});
});

test("destroy", function () {

	this.create();

	S(".panel:nth-child(2) .destroy").click();

	//makes the next confirmation return true
	S.confirm(true);

	S('.panel:nth-child(2)').missing(function () {
		ok("destroyed");
	});

});