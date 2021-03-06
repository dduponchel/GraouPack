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
/*global ActiveXObject */

/**
 * Create an xml DOM document, and make its manipulation easier.
 */
$.Class("izpack.xml.ie", "XMLBuilder", {
	isa : izpack.xml.XMLBuilder,

	init : function () {
		this._super();
		this._elementImplementationClass = izpack.xml.ie.Element;
	},

	methods : {
		_createEmptyDocument : function (rootName) {
			var doc = new ActiveXObject("MSXML2.DOMDocument");
			doc.loadXML("<" + rootName + "/>");
			return doc;
		},
		_getChildren : function (currentNode) {
			return currentNode.childNodes;
		},
		_getNodeName : function (node) {
			return node.nodeName;
		},
		_createChild : function (nodeName, currentNode) {
			var newElement = this._xmlDocument.createElement(nodeName);
			currentNode.appendChild(newElement);
			return newElement;
		},
		_getXmlString : function () {
			return this._xmlDocument.xml;
		},
		getRootElement : function () {
			return new this._elementImplementationClass(
				this._xmlDocument.childNodes[0],
				this
			);
		},
		count : function (xpath) {
			return this._xmlDocument.selectNodes(xpath).length;
		}
	}
});
