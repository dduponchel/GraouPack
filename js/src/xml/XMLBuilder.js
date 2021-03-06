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
 * Create an xml DOM document, and make its manipulation easier.
 * Use the factory method to create an XmlBuilder !
 */
$.Class("izpack.xml", "XMLBuilder", {
	init : function () {
		/**
		 * The xml document.
		 */
		this._xmlDocument = this._createEmptyDocument("installation");
		this._xmlDocument.getElementsByTagName("installation")[0].setAttribute("version", "1.0");

		this._elementImplementationClass = null;
	},
	methods : {

		/**
		 * Returns (and create if it doesn't exist) the element targeted by 'path'.
		 * @param {String} path The path to the xml element. It has the following pattern : 
		 * (/\w+)+ for example /installation/subElement/subSubElement...
		 * @return {XMLElement} the xml element.
		 */
		get : function (path) {
			
			if (!path.match(/(\/\w+)+/)) {
				throw "The path must follow the pattern (/\\w+)+ !";
			}
			
			var nodeNames = path.split("/"),
				depth, // depth in the xml
				currentNode, // xml node
				nodeName,
				xmlChildren, // children of the current xml node
				childNb, // number of the current xml child
				found, // has the next xml element has been found ?
				xmlChild; // current xml child

			// get rid of the first / (creates a "")
			nodeNames.shift();

			currentNode = this._xmlDocument;
			// for each level
			for (depth = 0; depth < nodeNames.length; depth++) {
				nodeName = nodeNames[depth];
				xmlChildren = this._getChildren(currentNode);
				childNb = 0;
				found = false;
				// looking for an existing node
				while (!found && childNb < xmlChildren.length) {
					xmlChild = xmlChildren[childNb++];
					if (this._getNodeName(xmlChild).toLowerCase() === nodeName.toLowerCase()) {
						found = true;
						currentNode = xmlChild;
					}
				}
				if (!found) {
					currentNode = this._createChild(nodeName, currentNode);
				}
			}
			return new this._elementImplementationClass(currentNode, this);
		},

		/**
		 * Generate the xml string.
		 * @return {String} the string representing the xml.
		 */
		toXMLString : function () {
			/*
			 * It can't pass by an xslt transformation : 
			 * the effet of indent = "yes" depends of the browser (and firefox doesn't indent).
			 * @see http://www.w3.org/TR/xslt#output : 
			 * "indent specifies whether the XSLT processor <strong>may</strong> add additional whitespace 
			 * when outputting the result tree; the value must be yes or no"
			 */
			
			// from http://svg-edit.googlecode.com/svn/trunk/editor/svgcanvas.js
			var convertToXMLReferences = function (input) {
				var output = '',
					n, // iteration
					c; // char
				for (n = 0; n < input.length; n++) {
					c = input.charCodeAt(n);
					if (c < 128) {
						output += input.charAt(n);
					}
					else if (c > 127) {
						output += ("&#" + c + ";");
					}
				}
				return output;
			},
				input = this._getXmlString(),
				output = "",
				depth = 0,
				sameLine = false, // used when </foo> goes after <foo>bar
				fragments,
				append = function (fragment) {
					output += fragment;
				},
				indent = function (depth) {
					for (var i = 0; i < depth; i++) {
						output += "  ";
					}
				},
				newLine = function () {
					output += "\r\n"; // damn windows
				},
				i, // iteration
				fragment; // xml fragment
				
			
			// we don't always have an xml declaration : we remove it and add our own
			input = input.replace(/<\?xml[^>]+>\s*/, "");
			
			// we sometimes (IE) have extra new lines...
			input = $.trim(input);
			
			// other way : we can use E4X. /!\ don't use CDATA !
			// see https://developer.mozilla.org/en/Parsing_and_serializing_XML#.22Pretty.22_serialization_of_DOM_trees_to_strings
			// output = XML(input).toXMLString();
			
			
			sameLine = false; // used when </foo> goes after <foo>bar
			fragments = input.match(/<[^>]+>[^<]*/gi);
			
			output += '<?xml version="1.0" encoding="utf-8" standalone="yes" ?>';
			newLine();
			
			for (i = 0; i < fragments.length - 1; i++) {
				fragment = fragments[i];
				if (fragment.match(/>.+/)) { // <---->blabla
					indent(depth);
					sameLine = true;
					append(fragment);
				}
				else if (fragment.match(/\/>$/)) { // <----/>
					indent(depth);
					append(fragment);
					newLine();
				}
				else if (fragment.match(/<[^\/]+>/)) { // <---->
					indent(depth++);
					append(fragment);
					newLine();
				}
				else if (fragment.match(/<\//)) { // </---->
					if (sameLine) {
						append(fragment);
						sameLine = false;
						newLine();
					}
					else {
						indent(--depth);
						append(fragment);
						newLine();
					}
				}
				else { // should not happen
					append(fragment);
				}
			}
			append(fragments[fragments.length - 1]); // no \n for the last one
			
			output = convertToXMLReferences(output);
			
			return output;
		}
	},
	
	abstracts : {	
		_createEmtyDocument : function (rootName) {},
		_getChildren : function (currentNode) {},
		_getNodeName : function (node) {},
		_createChild : function (nodeName, currentNode) {},
		_getXmlString : function () {},
		getRootElement : function () {},
		count : function (xpath) {}
	}
});

(function () {
	var namespace = $.namespace("izpack.xml");
	
	/**
	 * static factory
	 */
	namespace.XMLBuilder.createInstance = function () {
		var implementation = izpack.compatibility.xml.w3c ? namespace.w3c : namespace.ie;
		return new implementation.XMLBuilder();
	};
}());
