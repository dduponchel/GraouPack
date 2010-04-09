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
 
module("Generator Pack", {
        setup: function(){
		this.mockDatas = {};
		this.mockBlackBoard = Helper.getMockBlackBoardFrom(this.mockDatas);
		this.mockXmlBuilder = GeneratorHelper.getNewMockXmlBuilder();
                this.generator = new izpack.generator.Pack(this.mockBlackBoard);
        },
        teardown: function(){
                this.generator = null;
        },
		
		testPack : function (pack, name, required) {
			equal(pack.attributes["name"], name, "pack name setted");
			equal(pack.attributes["required"], required, "pack (not) required");
		},
		testDescription : function (description, text) {
			equal(description.name, "description", "description node");
			equal(description.content, text, "pack description");
		},
		testFile : function (file, src) {
			equal(file.name, "file", "file node");
			equal(file.content, "", "no content for file node");
			equal(file.attributes["src"], src, "file src");
			equal(file.attributes["targetdir"], "$INSTALL_PATH", "default targetdir");
		}
});

test("addGeneratedInfo: one simple pack", function () {
	this.mockDatas["packs"] = [
		Helper.getMockBlackBoardFrom({
			"name"		: "packName",
			required	: false,
			description	: "pack description",
			files		: [ "test.txt" ]
		})
	];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder);
	
	var packs = this.mockXmlBuilder.testHolder["/installation/packs"];
	equal(packs.children.length, 1, "one pack created");
	
	var pack = packs.children[0];
	this.testPack(pack, "packName", "no");
	
	equal(pack.children.length, 2, "2 children : description + 1 file");
	
	this.testDescription(pack.children[0], "pack description");
	this.testFile(pack.children[1], "test.txt");
});

test("addGeneratedInfo: one several packs", function () {
	this.mockDatas["packs"] = [
		
		Helper.getMockBlackBoardFrom({
			"name"		: "pack number 1",
			required	: true,
			description	: "pack n°1",
			files		: [ "test1.txt", "readme1.html" ]
		}),

		Helper.getMockBlackBoardFrom({
			"name"		: "pack number 2",
			required	: false,
			description	: "pack n°2",
			files		: [ "test2.txt", "readme2.html", "license.txt" ]
		})
	];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder);
	
	var packs = this.mockXmlBuilder.testHolder["/installation/packs"];
	equal(packs.children.length, 2, "2 packs created");
	
	var pack1 = packs.children[0],
		pack2 = packs.children[1];
	
	this.testPack(pack1, "pack number 1", "yes");
	this.testPack(pack2, "pack number 2", "no");
	
	equal(pack1.children.length, 3, "3 children : description + 2 files");
	equal(pack2.children.length, 4, "4 children : description + 3 files");
	
	this.testDescription(pack1.children[0], "pack n°1");
	this.testDescription(pack2.children[0], "pack n°2");
	
	this.testFile(pack1.children[1], "test1.txt");
	this.testFile(pack1.children[2], "readme1.html");
	
	this.testFile(pack2.children[1], "test2.txt");
	this.testFile(pack2.children[2], "readme2.html");
	this.testFile(pack2.children[3], "license.txt");
});
