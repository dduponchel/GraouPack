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
 
module("Generator Project", {
        setup: function(){
		this.mockDatas = {};
		this.mockBlackBoard = Helper.getMockBlackBoardFrom(this.mockDatas);
		this.mockXmlBuilder = GeneratorHelper.getNewMockXmlBuilder();
                this.generator = new izpack.generator.Project(this.mockBlackBoard);
        },
        teardown: function(){
                this.generator = null;
        }
});

test("addXMLInfo: no authors", function () {
	this.mockDatas["app.name"] = "appname";
	this.mockDatas["app.version"] = "appversion";
	this.mockDatas["authors"] = [];
	
	this.generator.addXMLInfo(this.mockXmlBuilder);
	
	equal(this.mockXmlBuilder.testHolder["/installation/info/appname"].content, "appname", "appname setted");
	equal(this.mockXmlBuilder.testHolder["/installation/info/appversion"].content, "appversion", "appversion setted");
	ok(!this.mockXmlBuilder.testHolder["/installation/info/authors"], "no author");
});

test("addXmlInfo: with authors", function () {
	this.mockDatas["app.name"] = "appname";
	this.mockDatas["app.version"] = "appversion";
	this.mockDatas["authors"] = [
		{name: "name0", mail: "mail0"},
		{name: "name1", mail: "mail1"},
		{name: "name2", mail: "mail2"},
	];
	
	this.generator.addXMLInfo(this.mockXmlBuilder);
	
	var authors = this.mockXmlBuilder.testHolder["/installation/info/authors"];
	for(var i = 0; i < 3; i++) {
		equal(authors.children[i].attributes["name"], "name" + i, "name for author " + i);
		equal(authors.children[i].attributes["email"], "mail" + i, "mail for author " + i);
	}
});
