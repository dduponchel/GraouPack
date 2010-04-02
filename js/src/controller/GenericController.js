/*
 * Licensed under BSD http://en.wikipedia.org/wiki/BSD_License
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

"use strict";

$.Class("izpack.controller", "GenericController", {
	
	init : function (view, blackBoard) {
		this.view = view;
		this.blackBoard = blackBoard;
		this.constraints = {
			required : function (data, view) {
				if ($(view).length === 0) { // required but not even here !
					return false;
				}
				if (typeof data === "string") {
					return (data) ? true : false;
				}
				else if (typeof data === "boolean") {
					return data;
				}
				else {
					return data.length !== 0;
				}
			}
		};

		this.bindings = [];

		this.modelConstraints = [];
	},

	methods : {

		setBindings : function () {
			throw "setBindings must be overriden !";
		},
		
		validateBinding : function (view, data, constraints) {
			var isValid = true,
				i,
				constraint;
			
			for (i = 0; i < constraints.length; i++) {
				constraint = constraints[i];
				isValid = this.constraints[constraint](data, view) && isValid;
			}
			if (isValid) {
				$(view).removeClass("error");
			}
			else {
				$(view).addClass("error");
			}
			return isValid;
		},
		
		validateModelConstraints : function (modelConstraint) {
			if (modelConstraint.constraint(this.blackBoard)) {
				return true;
			}
			$(modelConstraint.blame).addClass("error");
			return false;
		},
		
		bind : function (options) {
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
			
			if (!settings.view) {
				throw "GenericController::bind : the associated view must be defined !";
			}
			if (!settings.model) {
				throw "GenericController::bind : the associated model must be defined !";
			}
			
			/*DEBUG_START*/
			console.debug("GenericController::bind '", settings.view, "' to '", settings.model + "' on '", settings.event, "', ", settings.constraints.length, " constraints");
			/*DEBUG_END*/
			
			// default value
			if (this.blackBoard && !this.blackBoard.isDefined(settings.model)) {
				this.blackBoard.set(settings.model, settings.defaultValue);
			}
			
			this.bindings.push(settings);
		},
		
		addModelConstraint : function (options) {
			var settings = {
				blame : "",
				constraint : function (model) {}
			};
			
			$.extend(settings, options);
			/*DEBUG_START*/
			console.debug("GenericController::addModelConstraint, blaming'", settings.blame);
			/*DEBUG_END*/
			this.modelConstraints.push(settings);
		},
		
		validate : function () {
			var isValid = true,
				i, // iter
				binding,
				viewData,
				modelConstraint;
	
			for (i = 0; i < this.modelConstraints.length; i++) {
				// remove model constraint errors
				$(this.modelConstraints[i].blame).removeClass("error");
			}
	
			for (i = 0; i < this.bindings.length; i++) {
				binding = this.bindings[i];
				viewData = binding.fromView.apply(this.view, [binding.view]);
				isValid = this.validateBinding(binding.view, viewData, binding.constraints) && isValid;
			}
	
			for (i = 0; i < this.modelConstraints.length; i++) {
				modelConstraint = this.modelConstraints[i];
				isValid = this.validateModelConstraints(modelConstraint) && isValid;
			}
	
			return isValid;
		},
		
		beforeShowView : function () {},
		
		afterShowView : function () {},
		
		showView : function () {
			var i, // iter
				binding;
			
			this.beforeShowView();
			
			/*DEBUG_START*/
			console.debug("GenericController::showView ", this.view.name, ", setting " + this.bindings.length + " view items via binding");
			/*DEBUG_END*/
			for (i = 0; i < this.bindings.length; i++) {
				binding = this.bindings[i];
				binding.toView.apply(this.view, [this.blackBoard.get(binding.model)]);
			}
			
			this.afterShowView();
		},
		
		beforeInitView : function () {},
		
		afterInitView : function () {},
		
		initView : function () {
			
			this.beforeInitView();
			
			/*DEBUG_START*/
			console.debug("GenericController::initView ", this.view.name);
			/*DEBUG_END*/
			
			this.view.load();
			
			var handler = function (event) {
					var binding = event.data.binding,
						controller = event.data.controller,
						viewData;
					
					/*DEBUG_START*/
					console.debug("GenericController::bound event : view '", binding.view, "' has triggered '", binding.event, "'");
					/*DEBUG_END*/
					viewData = binding.fromView.apply(controller.view, [binding.view]);
					controller.validateBinding(binding.view, viewData, binding.constraints);
					controller.blackBoard.set(binding.model, viewData);
					
					return true; // don't block on changes !
				},
				i, // iter
				binding;
			
			// binding to the real elements
			for (i = 0; i < this.bindings.length; i++) {
				binding = this.bindings[i];
				$(binding.view).bind(binding.event, {binding: binding, controller: this}, handler);
			}
			
			this.afterInitView();
		}
	}
});
