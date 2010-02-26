/*
 * Copyright (c) 2010, Duponchel David
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the GraouPack nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL DUPONCHEL DAVID BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 
module("Model BlackBoard", {
        setup: function(){
		this.model = new izpack.model.BlackBoard();
        },
        teardown: function(){
                this.model = null;
        }
});



test("isDefined", function () {
	ok(!this.model.isDefined("doesn't exist !"), "not defined");
	this.model.set("exists", "");
	ok(this.model.isDefined("exists"), "defined");
});

test("remove", function () {
	this.model.set("key", "");
	ok(this.model.isDefined("key"), "defined");
	this.model.remove("key");
	ok(!this.model.isDefined("key"), "now undefined");
});

test("set & get: primitive value", function () {
	this.model.set("graou", "value");
	equal(this.model.get("graou"), "value", "get and set are symetrics");
});

test("set & get: complex value", function () {
	var value = {
		toto : "foo",
		bar : function(){}
	};
	this.model.set("graou", value);
	equal(this.model.get("graou"), value, "get and set are symetrics");
});

test("add: not defined key", function () {
	ok(!this.model.isDefined("key"), "not defined");
	this.model.add("key", "value");
	deepEqual(this.model.get("key"), ["value"], "value added");
});

test("add: defined key", function () {
	this.model.set("key", ["val1", "val2"]);
	this.model.add("key", "val3");
	deepEqual(this.model.get("key"), ["val1", "val2", "val3"], "value added");
});
