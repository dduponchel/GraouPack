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
 
$.namespace("izpack.xml.ie");

izpack.xml.ie.Element = function (xmlNode, xmlBuilder) {
	izpack.xml.Element.apply(this, [ xmlNode, xmlBuilder ]);
};

izpack.xml.ie.Element.prototype = $.extend({}, izpack.xml.Element.prototype, {

	getChildren : function () {
		var children = [];
		for (var i = 0; i < this.xmlNode.childNodes.length; i++) {
			children.push(new this.xmlBuilder._elementImplementationClass(
				this.xmlNode.childNodes[i],
				this.xmlBuilder)
			);
		}
		return children;
	},
	getName : function () {
		return this.xmlNode.nodeName;
	},
	setAttribute : function (key, value) {
		this.xmlNode.setAttribute(key, value + "");
	},
	getAttribute : function (key) {
		return this.xmlNode.getAttribute(key);
	},
	setContent : function (content) {
		this.xmlNode.text = content;
	},
	getContent : function () {
		return this.xmlNode.nodeValue;
	}
});
