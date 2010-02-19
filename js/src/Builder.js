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
	
	var generators = [];
	
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
		var tab = new izpack.tab[settings.name]();
		
		generator.view = tab;
		
		generators.push({
			name:		settings.name,
			tab:		tab,
			generator:	generator,
			label:		settings.label
		});
		
		$(" > ul", rootElt).append(
			$("<li></li>").data("optional", settings.optional).append(
				$("<a></a>").attr("href", tab.href).text(settings.label)
			)
		);
	};
	
	/**
	 * Start the application !
	 */
	this.start = function () {
		rootElt.tabs({
			cache : true,
			load : function (event, ui) {
				generators[ui.index].tab.load();
			}
		});
	};


	this.validateAll = function () {
		var fails = [];
		for (var index  = 0; index < generators.length; index++) {
			var generator = generators[index].generator;
			if (!generator.validate()) {
				fails.push(generator.name);
			}
		}
		if (fails.length) {
			alert("tab(s) '" + fails + "' have errors");
			return false;
		}
		return true;
	};
	
	this.generateXML = function () {
		if (that.validateAll()) {
			var xml = new izpack.xml.XMLBuilder();
			for (var i = 0; i < generators.length; i++) {
				var generator = generators[i].generator;
				generator.addXMLInfo(xml);
			}
			$("<div/>").text(xml.toString()).dialog({ title: 'generated XML' });
		}
		return false;
	};
	
	rootElt.append(
		$("<input/>")
		.attr("type", "submit")
		.val("generate xml")
		.addClass("ui-state-default ui-corner-all")
		.click(that.generateXML)
	);
};
