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
 
$.namespace("izpack");

/**
 * The main class for starting the app.
 * @param {String} htmlID The id of the html element where we will put our app.
 */
izpack.Builder = function (htmlID) {
	
	// 'this' belongs to its context. With 'that', we have a ref to the current Builder object.
	var that = this;
	
	var rootElt = $("#" + htmlID);

	var dialog = $("#GraouXML .dialog").dialog({
		autoOpen : false,
		title : "generated XML",
		width : 700,
		height : 500
	});
	
	var tabs = [];

	var addErrorTab = function (index) {
		tabs[index].htmlTab
			.stop()
			.css("background-color", "")
			.removeClass("error-tab")
			.addClass("error-tab-highlight")
			.switchClass("error-tab-highlight", "error-tab", "slow");
	};
	
	var removeErrorTab = function (index) {
		tabs[index].htmlTab
			.stop()
			.removeClass("error-tab")
			.removeClass("error-tab-highlight")
			.css("background-color", "transparent");
	};
	
	/**
	 * Add a panel for more functionalities !
	 * @param {Object} options The options to configure the new tab.
	 */
	this.addPanel = function (options) {
		var settings = {
			label: undefined,
			name: undefined,
			optional : false
		};
		$.extend(settings, options);
		
		var generator = new izpack.generator[settings.name]();
		generator.label = settings.label;
		var view = new izpack.view[settings.name]();
		
		generator.view = view;
		
		var htmlTab = $("<a></a>")
		.attr("href", view.href)
		.attr("title", settings.name)
		.append(
			$("<span/>").text(settings.label)
		);

		$(" > ul", rootElt).append(
			$("<li></li>").data("optional", settings.optional).append(htmlTab)
		);
		
		tabs.push({
			name:		settings.name,
			view:		view,
			generator:	generator,
			label:		settings.label,
			htmlTab:	htmlTab
		});
	};
	
	/**
	 * Start the application !
	 */
	this.start = function () {
		rootElt.tabs({
			cache : true,
			load : function (event, ui) {
				tabs[ui.index].view.load();
			},
			show : function (event, ui) {
				// remove any error / error animation
				removeErrorTab(ui.index);
			}
		});
	};


	var validateAll = function () {
		var fails = [];
		for (var index  = 0; index < tabs.length; index++) {
			var tab = tabs[index];
			if (!tab.generator.validate()) {
				addErrorTab(index);
				fails.push(tab.name);
			}
			else {
				removeErrorTab(index);
			}
		}
		if (fails.length) {
			//alert("tab(s) '" + fails + "' have errors");
			return false;
		}
		return true;
	};
	
	var generateXML = function () {
		if (validateAll()) {
			try {
				var xml = new izpack.xml.XMLBuilder();
				for (var i = 0; i < tabs.length; i++) {
					var generator = tabs[i].generator;
					generator.addXMLInfo(xml);
				}
				$(".generated-xml", dialog).text(xml.toString());
				dialog.dialog("open");
			}
			catch (e) {
				alert("Something went wrong with the xml generation !\n" + e);
			}
		}
		return false;
	};
	
	$("#GraouXML .generateXML button")
	.addClass("ui-state-default ui-corner-all")
	.click(generateXML);
	

	$("button", dialog).click(function () {
		var b64 = $.base64.encode($(".generated-xml", dialog).text());
		var win = window.open("data:application/xml;base64," + b64);
		win.alert('Select "Save As..." in your browser to save this xml as an XML file.');
		return false;
	});
};
