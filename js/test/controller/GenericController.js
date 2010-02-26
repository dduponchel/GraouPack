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
 
module("Controller GenericController", {
        setup: function(){
		this.model = {};
		this.controller = new izpack.controller.GenericController();
		this.controller.view = {thisIsAView: true};
		this.controller.blackBoard = Helper.getMockBlackBoardFrom(this.model);
        },
        teardown: function(){
                this.controller = null;
        }
});



test("bind: initView + trigger", function () {
	
	expect(4);
	
	var div = $("<div id='GenericControllerTest'/>").appendTo("body");
	
	this.controller.view.load = function () {
		ok(true, "view loaded");
	};
	
	this.controller.bind({
		view : "#GenericControllerTest",
		model : "associatedEntry",
		fromView : function (view) {
			equal(view, "#GenericControllerTest", "fromView called");
			ok(this.thisIsAView, "fromView context : view");
			return "fromView result";
		},
		toView : function (data) {
			ok(false, "toView called");
		}
	});
	
	this.controller.initView();
	// can't know if the event is bound
	
	div.trigger("izpack.change");
	equal(this.model["associatedEntry"], "fromView result", "model updated");
	div.remove();
	
});

test("bind: showView", function () {
	expect(3);
	
	var div = $("<div id='GenericControllerTest'/>").appendTo("body");
	
	this.controller.view.load = function () {
		ok(true, "view loaded");
	};
	
	this.model["associatedEntry"] = "model data";
	
	this.controller.bind({
		view : "#GenericControllerTest",
		model : "associatedEntry",
		fromView : function (view) {
			ok(false, "fromView called");
		},
		toView : function (data) {
			equal(data, "model data", "toView called");
			ok(this.thisIsAView, "toView context : view");
		}
	});
	
	this.controller.initView();
	this.controller.showView();
	div.remove();
});

test("bind: constraints", function () {
	expect(4);
	
	var div = $("<div id='GenericControllerTest'/>").appendTo("body");
	
	this.controller.view.load = function () {
		ok(true, "view loaded");
	};
	
	this.controller.bind({
		view : "#GenericControllerTest",
		model : "associatedEntry",
		fromView : function (view) {
			equal(view, "#GenericControllerTest", "fromView called");
			ok(this.thisIsAView, "fromView context : view");
			return "";
		},
		toView : function (data) {
			ok(false, "toView called");
		},
		constraints : [ "required" ]
	});
	
	this.controller.initView();
	// can't know if the event is bound
	
	div.trigger("izpack.change");
	ok(div.hasClass("error"), "the bound view elt is in error");
	div.remove();
	
});
