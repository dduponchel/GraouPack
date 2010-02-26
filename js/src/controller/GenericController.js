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
 
$.namespace("izpack.controller");

izpack.controller.GenericController = function () {
	this.blackBoard = null;
	this.view = null;
	
	this.setBindings = function () {
		throw "setBindings must be overriden !";
	};
	
	this.constraints = {
		required : function (data, view) {
			if ($(view).length === 0) { // required but not even here !
				return false;
			}
			if (typeof data === "string") {
				return (data) ? true : false;
			}
			else {
				return data.length !== 0;
			}
		}
	};

	var bindings = [];
	
	this.validateBinding = function (view, data, constraints) {
		var isValid = true;
		for (var i = 0; i < constraints.length; i++) {
			var constraint = constraints[i];
			isValid = this.constraints[constraint](data, view) && isValid;
		}
		if (isValid) {
			$(view).removeClass("error");
		}
		else {
			$(view).addClass("error");
		}
		return isValid;
	};
	
	this.bind = function (options) {
		var settings = {
			view: "",
			model: "",
			fromView: function (view) {},
			toView: function (data) {},
			constraints : [],
			defaultValue : {},
			event : "izpack.change"
		};
		
		$.extend(settings, options);
		
		console.debug("GenericController::bind '", settings.view, "' to '", settings.model + "' on '", settings.event, "'");
		
		// default value
		if (!this.blackBoard.isDefined(settings.model)) {
			this.blackBoard.set(settings.model, settings.defaultValue);
		}
		
		bindings.push(settings);
	};
	
	this.validate = function () {
		var isValid = true;
		for (var i = 0; i < bindings.length; i++) {
			var binding = bindings[i];
			var viewData = binding.fromView.apply(this.view, [binding.view]);
			isValid = this.validateBinding(binding.view, viewData, binding.constraints) && isValid;
		}
		return isValid;
	};
	
	this.showView = function () {
		console.debug("GenericController::showView ", this.view.name, ", setting " + bindings.length + " view items via binding");
		for (var i = 0; i < bindings.length; i++) {
			var binding = bindings[i];
			binding.toView.apply(this.view, [this.blackBoard.get(binding.model)]);
		}
	};
	
	this.initView = function () {
		console.debug("GenericController::initView ", this.view.name);
		
		this.view.load();
		
		var handler = function (event) {
			var binding = event.data.binding;
			var controller = event.data.controller;
			console.debug("GenericController::bind : view '", binding.view, "' has triggered '", binding.event, "'");
			var viewData = binding.fromView.apply(controller.view, [binding.view]);
			controller.validateBinding(binding.view, viewData, binding.constraints);
			controller.blackBoard.set(binding.model, viewData);
			
			return false;
		};
		
		// binding to the real elements
		for (var i = 0; i < bindings.length; i++) {
			var binding = bindings[i];
			$(binding.view).bind(binding.event, {binding: binding, controller: this}, handler);
		}
	};
};
