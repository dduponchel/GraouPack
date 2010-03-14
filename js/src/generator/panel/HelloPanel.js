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
 
$.namespace("izpack.generator.panel");

izpack.generator.panel.HelloPanel = function (blackBoard) {
	izpack.generator.panel.GenericPanel.apply(this, [ blackBoard ]);
};

izpack.generator.panel.HelloPanel.prototype = $.extend({}, izpack.generator.panel.GenericPanel.prototype, {
	
	/**
	 * @Override
	 */
	addGeneratedInfo : function (xmlBuilder, files) {
		if (this.blackBoard.get("useHTML")) {
			var addedData = this.createPanelWithResource({
				clazz      : "HTMLHelloPanel",
				xmlBuilder : xmlBuilder,
				defaultID  : "HTMLHelloPanel.info",
				defaultSrc : "hello.html",
				prefixSrc  : "hello-",
				suffixSrc  : ".html",
				prefixID   : "HTMLHelloPanel.hello"
			});
			files.push({
				name : addedData.name,
				content : "HTML for HelloPanel n°" + (addedData.index + 1)
			});
		}
		else {
			var panel = xmlBuilder.get("/installation/panels").createChild("panel");
			panel.setAttribute("classname", "HelloPanel");
		}
	}
});