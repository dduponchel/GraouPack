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

$.Class("izpack.controller", "Panel", {

	isa : "GenericController",

	init : function (view, blackBoard) {
		this._super(view, blackBoard);
	},
	methods : {
		setBindings : function () {
			this.bind({
				view: this.view.selectedPanelsContainer,
				model: "panels",
				defaultValue: [],
				fromView: this.view.getPanels,
				toView: this.view.setPanels,
				constraints : [ "required" ]
			});
		},
		afterInitView : function () {
			var view = this.view;
			// we need other views/controllers, one for each available panel.
			$(this.view.availablePanels).each(function (index, domElt) {
				var availablePanel = $(this),
					clazz = availablePanel.attr("data-class"),
					panelDialog = view.createConfigPanel(availablePanel),
					panelView,
					panelController;
				
				/*DEBUG_START*/
				console.debug("Panel controller::afterInitView : creating view/controller for " + clazz);
				/*DEBUG_END*/
				
				panelView = new izpack.view.panelConfig[clazz](panelDialog);
				panelController = new izpack.controller.panelConfig[clazz](panelView, availablePanel);
				
				availablePanel
				.data("config.controller", panelController)
				.data("config.dialog", panelDialog)
				.data("config.view", panelView);
				panelController.setBindings();
				panelController.initView();
			});
		}
	}
});
