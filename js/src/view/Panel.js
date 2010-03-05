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
 
$.namespace("izpack.view");

izpack.view.Panel = function () {
	izpack.view.GenericView.apply(this, [ "panel" ]);

	this.availablePanelsContainer =	"#" + this.id + " #tab-panel-available";
	this.availablePanels =	this.availablePanelsContainer + " div.available-panel";
	this.selectedPanelsContainer =	"#" + this.id + " #tab-panel-selected";
	this.selectedPanels =	this.selectedPanelsContainer + "  div.selected-panel";
	this.addButtons =	"#" + this.id + " #tab-panel-available .action .add";
	this.infoButtons =	"#" + this.id + " #tab-panel-available .action .info";
	this.infoButtonsSelected =	"#" + this.id + " #tab-panel-selected .action .info";
	this.removeButtonsSelected =	"#" + this.id + " #tab-panel-selected .action .remove";
	this.configButtonsSelected =	"#" + this.id + " #tab-panel-selected .action .config";
	this.infoDiv =		"#tab-panel-info-dialog"; // special case, outside the tab
	this.modelForSelected =	"#" + this.id + " #model-for-selected";
	
	this.infoDialog = $("<div/>").append('<div id="tab-panel-info-dialog"/>').dialog({
		autoOpen : false,
		width : 510
	});
};

izpack.view.Panel.prototype = $.extend({}, izpack.view.GenericView.prototype, {
	
	getAvailableByClass : function (clazz) {
		return $(this.availablePanelsContainer).find("div[data-class=" + clazz + "]");
	},
	
	showHelp : function (clazz) {
		var panel = this.getAvailableByClass(clazz);
		$(this.infoDiv).html($(".detail", panel).html());
		this.infoDialog.dialog('option', 'title', $(".summary h3", panel).text())
		.dialog("open");
	},
	
	createConfigPanel : function (availablePanel) {
		var view = this;
		return availablePanel.find(".config").dialog({
			autoOpen : false,
			modal : true,
			buttons : {
				"ok" : function (event) {
					var configHandler = availablePanel.data("config.controller");
					var isValid = configHandler.validate();
					if (isValid) {
						configHandler.setConfig(null);
						$(this).dialog('close');
						$(view.selectedPanelsContainer).trigger("izpack.change");
						// js uses references : the selected panel has the right config.
					}
					else {
						return false;
					}
				},
				"cancel" : function (event) {
					$(this).dialog('close');
					availablePanel.data("config.controller").setConfig(null);
				}
			},
			width : 510
		});	
	},
	
	getPanels : function () {
		var panels = [];
		$(this.selectedPanels).each(function (index, domElt) {
			var $domElt = $(domElt);
			panels.push({
				clazz : $domElt.attr("data-class"),
				config : $domElt.data("config")
			});
		});
		return panels;
	},
	
	setPanels : function (data) {
		
		$(this.selectedPanels).each(function () {
			$(this).data("config", null);
		}).remove();
		
		for (var i = 0; i < data.length; i++) {
			var panel = data[i];
			this.addPanel(panel.clazz, panel.config);
		}
	},
	
	addPanel : function (clazz, config) {
		var model = $(this.modelForSelected).clone();
		model
		.attr("data-class", clazz)
		.attr("id", "")
		.data("config", config)
		.find(".preview")
		.attr("alt", clazz)
		.attr("src", "img/panel/" + clazz + "-small.png");
		
		model.find("h3").text(clazz);
		
		if (! this.getAvailableByClass(clazz).data("config.dialog").length) {
			model.find(".action .config").remove();
		}
		
		model.appendTo(this.selectedPanelsContainer);
	},
	
	initView : function () {
		$(this.selectedPanelsContainer)
		.sortable({
			axis: 'y',
			handle: ".preview, .grip"
		})
		.bind("sortupdate", function () {
			$(this).trigger("izpack.change");
		});

		$(this.infoButtons).bind("click", {view: this}, function (event) {
			var clazz = $(this).parents(".available-panel").attr("data-class");
			event.data.view.showHelp.apply(event.data.view, [ clazz ]);
			return false;
		});
		
		$(this.addButtons).bind("click", {view: this}, function (event) {
			var clazz = $(this).parents(".available-panel").attr("data-class");
			var view = event.data.view;
			
			view.addPanel(clazz, view.getAvailableByClass(clazz).data("config.controller").getDefaultConfig());
			
			$(view.selectedPanelsContainer).trigger("izpack.change");
		});
		
		$(this.selectedPanelsContainer).bind("click", {view: this}, function (event) {
			var target = $(event.target);
			var currentPanel = target.parents(".selected-panel");
			var view = event.data.view;
			var clazz = currentPanel.attr("data-class");
			
			// click on "info"
			if (target.is(view.infoButtonsSelected)) {
				view.showHelp.apply(view, [ clazz ]);
			}
			// click on "remove"
			else if (target.is(view.removeButtonsSelected)) {
				currentPanel
				.data("config", null)
				.remove();
				$(event.data.view.selectedPanelsContainer).trigger("izpack.change");
			}
			// click on "config"
			else if (target.is(view.configButtonsSelected)) {
				var available = view.getAvailableByClass(clazz);
				var dialog = available.data("config.dialog");
				var configHandler = available.data("config.controller");
				configHandler.setConfig(currentPanel.data("config"));
				configHandler.showView();
				dialog
				.dialog('option', 'title', clazz + " configuration")
				.dialog("open");
			}
			return false;
		});
	}
});
