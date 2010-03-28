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

$.Class("izpack.generator.panel", "LicencePanel", {
	isa : "GenericPanel",

	init : function (blackBoard) {
		this._super(blackBoard);
	},
	
	methods : {
		/**
		 * @Override
		 */
		addGeneratedInfo : function (xmlBuilder, files) {
			var resourceOptions = {
				//forcedSrc  : this.blackBoard.get("fileSrc"),
				xmlBuilder : xmlBuilder
			};
			var fileContent = "";
			if (this.blackBoard.get("useHTML")) {
				$.extend(resourceOptions, {
					clazz      : "HTMLLicencePanel",
					defaultID  : "HTMLLicencePanel.info",
					defaultSrc : "license.html",
					prefixSrc  : "license-",
					suffixSrc  : ".html",
					prefixID   : "HTMLLicencePanel.info"
				});
				fileContent = "html";
			}
			else {
				$.extend(resourceOptions, {
					clazz      : "LicencePanel",
					defaultID  : "LicencePanel.info",
					defaultSrc : "license.txt",
					prefixSrc  : "license-",
					suffixSrc  : ".txt",
					prefixID   : "LicencePanel.info"
				});
				fileContent = "text";
			}
			var addedData = this.createPanelWithResource(resourceOptions);
			files.push({
				name : addedData.name,
				content : fileContent + " for LicencePanel n°" + (addedData.index + 1)
			});
		}
	}
});
