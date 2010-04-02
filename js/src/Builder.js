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

/**
 * The main class for starting the app.
 * @param {String} htmlID The id of the html element where we will put our app.
 */
$.Class("izpack", "Builder", {
	init : function (htmlID) {
		this.tabs = [];
		this.xmlHandlers = [];
		this.rootElt = $("#" + htmlID);
		this.blackBoard = new izpack.model.BlackBoard();
		this.dialog = $("#GraouXML .dialog").dialog({
			autoOpen : false,
			title : "generated XML",
			width : 700,
			height : 500
		}).tabs();

		$("#graoupack-generated-download .flash").downloadify({
			swf : "js/lib/downloadify/downloadify.swf",
			downloadImage : "js/lib/downloadify/download.png",
			width: 100,
			height: 30,
			filename : "GraouPack.zip",
			data : function () {
				return $(".dialog").data("zip");
			},
			dataType: "base64",
			onError : function () {
				console.log("downloadify::error callback");
			},
			onCancel : function () {
				console.log("downloadify::cancel callback");
			},
			onComplete : function () {
				console.log("downloadify::complete callback");
			}
		});
	
		$("#GraouXML .generateXML button")
		.button()
		.bind("click", {builder: this}, function (event) {
			event.data.builder.generateXML.apply(event.data.builder);
			return false;
		});
	
		$("button", this.dialog).click(function () {
			/*
			var b64 = $.base64.encode($(".generated-xml", dialog).text());
			var win = window.open("data:application/xml;base64," + b64);
			win.alert('Select "Save As..." in your browser to save this xml as an XML file.');
			*/
			window.open("data:application/zip;base64," + $(this).parents(".dialog").data("zip"));
			return false;
		});
	},

	methods : {

		addErrorTab : function (index) {
			// should be in css, but `switchClass("error-tab-highlight", "error-tab", "slow")` doesn't work in IE...
			var fromColor = "#f55",
				toColor   = "#ee8";
			
			this.tabs[index].htmlTab
				.css("background-color", fromColor)
				.animate({
					backgroundColor : toColor
				}, "slow");
		},
		
		removeErrorTab : function (index) {
			this.tabs[index].htmlTab.css("background-color", "transparent");
		},
		
		/**
		 * Add a panel for more functionalities !
		 * @param {Object} options The options to configure the new tab.
		 */
		addPanel : function (options) {
			var controller = null,
				view = null,
				htmlTab,
				settings = {
				label: undefined,
				name: undefined,
				optional : false
			};
			$.extend(settings, options);
			
			try {
				console.groupCollapsed(settings.name + "::constructors");
				console.time(settings.name + "::constructors");
				
				view = new izpack.view[settings.name]();
				controller = new izpack.controller[settings.name](view, this.blackBoard);
				controller.setBindings();
				
				console.timeEnd(settings.name + "::constructors");
				console.groupEnd();
			}
			catch (e) {
				throw "Creating '" + settings.name + "' tab : " + e;
			}
			
			
			htmlTab = $("<a></a>", {
				href  : view.href,
				title : settings.name
			})
			.append(
				$("<span/>").text(settings.label)
			);
	
			$(" > ul", this.rootElt).append(
				$("<li></li>").data("optional", settings.optional).append(htmlTab)
			);
			
			this.tabs.push({
				name:		settings.name,
				view:		view,
				controller:	controller,
				label:		settings.label,
				htmlTab:	htmlTab
			});
		},
		
		/**
		 * Start the application !
		 */
		start : function () {
			this.rootElt.tabs({
				cache : true
			})
			.bind("tabsload", {builder : this}, function (event, ui) {
				var builder = event.data.builder;
				
				console.groupCollapsed(builder.tabs[ui.index].name + "::tabsload");
				console.time(builder.tabs[ui.index].name + "::tabsload");
				
				event.data.builder.tabs[ui.index].controller.initView();
				
				console.timeEnd(builder.tabs[ui.index].name + "::tabsload");
				console.groupEnd();
			})
			.bind("tabsshow", {builder : this}, function (event, ui) {
				var builder = event.data.builder;
				
				console.groupCollapsed(builder.tabs[ui.index].name + "::tabsshow");
				console.time(builder.tabs[ui.index].name + "::tabsshow");
				
				// remove any error / error animation
				builder.removeErrorTab(ui.index);
				builder.tabs[ui.index].controller.showView();
				
				console.timeEnd(builder.tabs[ui.index].name + "::tabsshow");
				console.groupEnd();
			});
		},
	
	
		validateAll : function () {
			var fails = [],
				index = 0,
				tab = null;
			for (index  = 0; index < this.tabs.length; index++) {
				tab = this.tabs[index];
				if (!tab.controller.validate()) {
					this.addErrorTab(index);
					fails.push(tab.name);
				}
				else {
					this.removeErrorTab(index);
				}
			}
			if (fails.length) {
				//alert("tab(s) '" + fails + "' have errors");
				return false;
			}
			return true;
		},
		
		generateXML : function () {
			var xml = null,
				files = [],
				i = 0,
				xmlString = "",
				generator = null;
			
			console.groupCollapsed("generateXML");
			console.time("generateXML");
			
			try {
				if (this.validateAll()) {
					try {
						xml = izpack.xml.XMLBuilder.createInstance();
						files = [];
						for (i = 0; i < this.xmlHandlers.length; i++) {
							generator = new izpack.generator[this.xmlHandlers[i]](this.blackBoard);
							generator.addGeneratedInfo(xml, files);
						}
						xmlString = xml.toXMLString();
						files.push({
							name : "install.xml",
							content : xmlString
						});
						$(".generated-xml", this.dialog).text(xmlString);
						for (i = 0; i < files.length; i++) {
							
							$("#graoupack-generated-files ul", this.dialog)
							.append($("<li/>")
							.text(files[i].name));
						}
						this.dialog
						.data("zip", new izpack.zip.ZipBuilder(files).createZIP())
						.dialog("open");
					}
					catch (xmlException) {
						alert("Something went wrong with the xml generation !\n" + xmlException);
						console.error("Something went wrong with the xml generation !", xmlException);
					}
				}
			}
			catch (validationException) {
				alert("Something went wrong with the validation !\n" + validationException);
				console.error("Something went wrong with the validation !", validationException);
			}
			
			console.timeEnd("generateXML");
			console.groupEnd();
		}
	}	
});
