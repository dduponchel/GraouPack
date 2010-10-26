/*global module: true, ok: true, equals: true, S: true, test: true */
module("locale", {
	setup: function () {
		// open the page
		S.open("//graoupack/graoupack.html");

		//make sure there's at least one locale on the page before running a test
		S('.locale').exists();
	},
	//a helper function that creates a locale
	create: function () {
		S("[name=name]").type("Ice");
		S("[name=description]").type("Cold Water");
		S("[type=submit]").click();
		S('.locale:nth-child(2)').exists();
	}
});

test("locales present", function () {
	ok(S('.locale').size() >= 1, "There is at least one locale");
});

test("create locales", function () {

	this.create();

	S(function () {
		ok(S('.locale:nth-child(2) td:first').text().match(/Ice/), "Typed Ice");
	});
});

test("edit locales", function () {

	this.create();

	S('.locale:nth-child(2) a.edit').click();
	S(".locale input[name=name]").type(" Water");
	S(".locale input[name=description]").type("\b\b\b\b\bTap Water");
	S(".update").click();
	S('.locale:nth-child(2) .edit').exists(function () {

		ok(S('.locale:nth-child(2) td:first').text().match(/Ice Water/), "Typed Ice Water");

		ok(S('.locale:nth-child(2) td:nth-child(2)').text().match(/Cold Tap Water/), "Typed Cold Tap Water");
	});
});

test("destroy", function () {

	this.create();

	S(".locale:nth-child(2) .destroy").click();

	//makes the next confirmation return true
	S.confirm(true);

	S('.locale:nth-child(2)').missing(function () {
		ok("destroyed");
	});

});