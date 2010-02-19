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
 
module("Generator Locale", {
        setup: function(){
                this.generator = new izpack.generator.Locale();

		this.getNewMockXmlBuilder = function () {
			return {
        		        testHolder: [],
        		        get: function (path) {
					this.testHolder[path] = {
						attributes: {},
						setAttribute: function(key, value) {
							this.attributes[key] = value;
						}
					};
					return this.testHolder[path];
				},
				createElement: function (name, xmlParent) {
					if(!xmlParent.children) xmlParent.children = [];
					var res = {
						attributes: {},
						setAttribute: function(key, value) {
							this.attributes[key] = value;
						}
					};
					xmlParent.children.push(res);
					return res;
				}
			};

		};
        },
        teardown: function(){
                this.generator = null;
        }
});



test("addXMLInfo: one locale", function () {
	var mockXmlBuilder = this.getNewMockXmlBuilder();
	
	var mockView = {
		getLocales : function(){return ["locale1"];}
	};
	
	this.generator.view = mockView;
	this.generator.addXMLInfo(mockXmlBuilder);
	
	equals(mockXmlBuilder.testHolder["/installation/locale"].children.length, 1, "one child created");
	var child = mockXmlBuilder.testHolder["/installation/locale"].children[0];
	equals(child.attributes["iso3"], "locale1", "iso3 code setted");
});

test("addXMLInfo: several locales", function () {
	var mockXmlBuilder = this.getNewMockXmlBuilder();
	
	var mockView = {
		getLocales : function(){return ["locale1", "locale2", "locale3"];}
	};
	
	this.generator.view = mockView;
	this.generator.addXMLInfo(mockXmlBuilder);
	
	equals(mockXmlBuilder.testHolder["/installation/locale"].children.length, 3, "three children created");
	var child1 = mockXmlBuilder.testHolder["/installation/locale"].children[0];
	var child2 = mockXmlBuilder.testHolder["/installation/locale"].children[1];
	var child3 = mockXmlBuilder.testHolder["/installation/locale"].children[2];
	equals(child1.attributes["iso3"], "locale1", "iso3 code setted for locale 1");
	equals(child2.attributes["iso3"], "locale2", "iso3 code setted for locale 2");
	equals(child3.attributes["iso3"], "locale3", "iso3 code setted for locale 3");
});
