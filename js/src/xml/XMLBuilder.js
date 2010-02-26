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
 
$.namespace("izpack.xml");

/**
 * Create an xml DOM document, and make its manipulation easier.
 */
izpack.xml.XMLBuilder = function () {
	
	/**
	 * The xml document.
	 */
	this.xmlDocument = document.implementation.createDocument("", "installation", null);
	this.xmlDocument.getElementsByTagName("installation")[0].setAttribute("version", "1.0");
};

izpack.xml.XMLBuilder.prototype = {

	/**
	 * Returns (and create if it doesn't exist) the element targeted by 'path'.
	 * @param {String} path The path to the xml element. It has the following pattern : 
	 * (/\w+)+ for example /installation/subElement/subSubElement...
	 * @return {XMLElement} the xml element.
	 */
	get : function (path) {
		
		if (!path.match(/(\/\w+)+/)) {
			throw "The path must follwo the pattern (/\\w+)+ !";
		}
		
		var nodeNames = path.split("/");

		// get rid of the first / (creates a "")
		nodeNames.shift();

		var currentNode = this.xmlDocument;
		// for each level
		for (var depth = 0; depth < nodeNames.length; depth++) {
			var nodeName = nodeNames[depth];
			var xmlChildren = currentNode.childNodes;
			var childNb = 0;
			var found = false;
			// looking for an existing node
			while (!found && childNb < xmlChildren.length) {
				var xmlChild = xmlChildren[childNb++];
				if (xmlChild.localName.toLowerCase() === nodeName.toLowerCase()) {
					found = true;
					currentNode = xmlChild;
				}
			}
			if (!found) {
				var newNode = this.createElement(nodeName, currentNode);
				currentNode.appendChild(newNode);
				currentNode = newNode;
			}
		}
		return currentNode;
	},

	/**
	 * Generate the xml string.
	 * @return {String} the string representing the xml.
	 */
	toString : function () {
		/*
		 * It can't pass by an xslt transformation : the effet of indent = "yes" depends of the browser (and firefox doesn't indent).
		 * @see http://www.w3.org/TR/xslt#output : "indent specifies whether the XSLT processor <strong>may</strong> add additional whitespace when outputting the result tree; the value must be yes or no"
		 */
		
		// from http://svg-edit.googlecode.com/svn/trunk/editor/svgcanvas.js
		var convertToXMLReferences = function (input) {
			var output = '';
			for (var n = 0; n < input.length; n++) {
				var c = input.charCodeAt(n);
				if (c < 128) {
					output += input[n];
				}
				else if (c > 127) {
					output += ("&#" + c + ";");
				}
			}
			return output;
		};

		var input = new XMLSerializer().serializeToString(this.xmlDocument);
		
		// we don't always have an xml declaration : we remove it and add our own
		input = input.replace(/<\?xml[^>]+>\s*/, "");
		
		var output = "";


		// we can use E4X. /!\ don't use CDATA !
		// see https://developer.mozilla.org/en/Parsing_and_serializing_XML#.22Pretty.22_serialization_of_DOM_trees_to_strings
		if (typeof XML === "function") {
			output = XML(input).toXMLString();
		}
		else { // without E4X, we must indent manually
			var depth = 0;
			var sameLine = false; // used when </foo> goes after <foo>bar
			var fragments = input.match(/<[^>]+>[^<]*/gi);
			var append = function (fragment) {
				output += fragment;
			};
			var indent = function (depth) {
				for (var i = 0; i < depth; i++) {
					output += "  ";
				}
			};
			var newLine = function () {
				output += "\n";
			};
			for (var i = 0; i < fragments.length - 1; i++) {
				var fragment = fragments[i];
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
		}

		output = convertToXMLReferences(output);
		
		return '<?xml version="1.0" encoding="utf-8" standalone="yes" ?>\n' + output;
	},
	
	/**
	 * Create a new element on the current xml document.
	 * @Param {String} name The name of the new element.
	 * @Param {XMLElement} xmlParent The parent for the new element.
	 * @Return {XMLElement} the created xml element.
	 */
	createElement : function (name, xmlParent) {
		var newElement = this.xmlDocument.createElement(name);
		xmlParent.appendChild(newElement);
		return newElement;
	}
};
