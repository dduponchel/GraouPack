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
 
$.namespace("izpack.generator.panel");

izpack.generator.panel.GenericPanel = function (blackBoard) {
	izpack.generator.GenericGenerator.apply(this, [ blackBoard ]);
};

izpack.generator.panel.GenericPanel.prototype = $.extend({}, izpack.generator.GenericGenerator.prototype, {
	
	/**
	 * Add a resource and bind it to the specified panel.
	 * @param {Object} options The options to use.
	 * @return {Object} an object containing informations on the creation.
	 * 
	 * This will correctly work in IzPack 5, see http://jira.codehaus.org/browse/IZPACK-543
	 * 
	 * The returned object has the following form :
	 * {
	 * 	name : the name used for the file's src
	 * 	index : the index of this resource, for this class (0 based)
	 * }
	 */
	createPanelWithResource : function (options) {
		var settings = {
			clazz      : "",	// the name of the IzPack class handling the panel
			xmlBuider  : null,	// the xml builder
			forcedSrc  : "",	// will use this src if setted. If not, using default rules
			defaultID  : "",	// the id to use when there is no other file
			defaultSrc : "",	// the src to use when there is no other file
			prefixSrc  : "",	// the src prefix to use if many files
			suffixSrc  : "",	// the src suffix to use if many files
			prefixID   : "",	// the id prefix to use if many files
			suffixID   : ""		// the id suffix to use if many files
		};
		$.extend(settings, options);
		settings.forcedSrc = $.trim(settings.forcedSrc);
		
		var otherPanels = settings.xmlBuilder.count("/installation/panels/panel[@classname='" + settings.clazz + "']");
		var resource = settings.xmlBuilder.get("/installation/resources").createChild("res");
		var fileName = "";
		
		var panel = settings.xmlBuilder.get("/installation/panels").createChild("panel");
		panel.setAttribute("classname", settings.clazz);
		
		// no other panel, we use the defaults
		if (otherPanels === 0) {
			if (!settings.forcedSrc) {
				fileName = settings.defaultSrc;
			}
			resource.setAttribute("id", settings.defaultID);
			resource.setAttribute("src", fileName);
		}
		else { // else, we must use id
			var id = settings.prefixID + otherPanels + settings.suffixID;
			if (!settings.forcedSrc) {
				fileName = settings.prefixSrc + otherPanels + settings.suffixSrc;
			}
			resource.setAttribute("id", id);
			resource.setAttribute("src", fileName);
			panel.setAttribute("id", id);
		}
		
		return {
			panel : panel,
			name : fileName,
			index : otherPanels
		};
	}
});
