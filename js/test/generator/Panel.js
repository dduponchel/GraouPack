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
 
module("Generator Panel", {
        setup: function(){
		this.mockDatas = {};
		this.mockFiles = [];
		this.mockBlackBoard = Helper.getMockBlackBoardFrom(this.mockDatas);
		this.mockXmlBuilder = GeneratorHelper.getNewMockXmlBuilder();
                this.generator = new izpack.generator.Panel(this.mockBlackBoard);
        },
        teardown: function(){
                this.generator = null;
        }
});

/*---------------------------------------------------------------------------*/
/*-------------------------------- HelloPanel -------------------------------*/
/*---------------------------------------------------------------------------*/

test("HelloPanel: simple hello panel", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "HelloPanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : false
			})
		}
	];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 1, "1 panel created");
	var child = this.mockXmlBuilder.testHolder["/installation/panels"].children[0];
	equal(child.content, "", "no content");
	equal(child.attributes["classname"], "HelloPanel", "HelloPanel");
	
	equal(this.mockFiles.length, 0, "no file");
});

test("HelloPanel: html hello panel", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "HelloPanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : true
			})
		}
	];
	this.mockXmlBuilder.countCases["/installation/panels/panel[@classname='HTMLHelloPanel']"] = [0];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 1, "1 panel created");
	var child = this.mockXmlBuilder.testHolder["/installation/panels"].children[0];
	equal(child.content, "", "no content");
	equal(child.attributes["classname"], "HTMLHelloPanel", "HTMLHelloPanel");
	
	equal(this.mockXmlBuilder.testHolder["/installation/resources"].children.length, 1, "1 resource created");
	var resource = this.mockXmlBuilder.testHolder["/installation/resources"].children[0];
	equal(resource.content, "", "no content for resource");
	equal(resource.attributes["id"], "HTMLHelloPanel.info", "default id for HTMLHelloPanel");
	equal(resource.attributes["src"], "hello.html", "default src for HTMLHelloPanel");
	
	equal(this.mockFiles.length, 1, "one file");
	equal(this.mockFiles[0].name, "hello.html", "named hello.html");
});

test("HelloPanel: multiple panels", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "HelloPanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : true
			})
		},
		{
			clazz : "HelloPanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : false
			})
		},
		{
			clazz : "HelloPanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : true
			})
		}
	];
	this.mockXmlBuilder.countCases["/installation/panels/panel[@classname='HTMLHelloPanel']"] = [0, 1];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 3, "3 panels created");
	var panels = this.mockXmlBuilder.testHolder["/installation/panels"].children;
	
	equal(panels[0].content, "", "no content, <panel> 0");
	equal(panels[1].content, "", "no content, <panel> 1");
	equal(panels[2].content, "", "no content, <panel> 2");
	
	equal(panels[0].attributes["classname"], "HTMLHelloPanel", "HTMLHelloPanel, <panel> 0");
	equal(panels[1].attributes["classname"], "HelloPanel", "HelloPanel, <panel> 1");
	equal(panels[2].attributes["classname"], "HTMLHelloPanel", "HTMLHelloPanel, <panel> 2");
	
	equal(this.mockXmlBuilder.testHolder["/installation/resources"].children.length, 2, "2 resources created");
	var resources = this.mockXmlBuilder.testHolder["/installation/resources"].children;
	
	equal(resources[0].content, "", "no content for resource 0");
	equal(resources[1].content, "", "no content for resource 1");
	
	equal(resources[0].attributes["id"], "HTMLHelloPanel.info", "default id for HTMLHelloPanel 0");
	equal(resources[1].attributes["id"], "HTMLHelloPanel.hello1", "custom id for HTMLHelloPanel 1 (HelloPanel 2)");
	equal(panels[2].attributes["id"], "HTMLHelloPanel.hello1", "id for resource, <panel> 2");
	
	equal(resources[0].attributes["src"], "hello.html", "default src for HTMLHelloPanel");
	equal(resources[1].attributes["src"], "hello-1.html", "custom src for HTMLHelloPanel 1 (HelloPanel 2)");
	
	equal(this.mockFiles.length, 2, "two files");
	equal(this.mockFiles[0].name, "hello.html", "named hello.html");
	equal(this.mockFiles[1].name, "hello-1.html", "named hello-1.html");
});


/*---------------------------------------------------------------------------*/
/*-------------------------------- InfoPanel --------------------------------*/
/*---------------------------------------------------------------------------*/

test("InfoPanel: text info panel", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "InfoPanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : false
			})
		}
	];
	this.mockXmlBuilder.countCases["/installation/panels/panel[@classname='InfoPanel']"] = [0];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 1, "1 panel created");
	var child = this.mockXmlBuilder.testHolder["/installation/panels"].children[0];
	equal(child.content, "", "no content");
	equal(child.attributes["classname"], "InfoPanel", "InfoPanel");
	
	equal(this.mockXmlBuilder.testHolder["/installation/resources"].children.length, 1, "1 resource created");
	var resource = this.mockXmlBuilder.testHolder["/installation/resources"].children[0];
	equal(resource.content, "", "no content for resource");
	equal(resource.attributes["id"], "InfoPanel.info", "default id for InfoPanel");
	equal(resource.attributes["src"], "info.txt", "default src for InfoPanel");
	
	equal(this.mockFiles.length, 1, "one file");
	equal(this.mockFiles[0].name, "info.txt", "named info.txt");
});


test("InfoPanel: html info panel", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "InfoPanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : true
			})
		}
	];
	this.mockXmlBuilder.countCases["/installation/panels/panel[@classname='HTMLInfoPanel']"] = [0];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 1, "1 panel created");
	var child = this.mockXmlBuilder.testHolder["/installation/panels"].children[0];
	equal(child.content, "", "no content");
	equal(child.attributes["classname"], "HTMLInfoPanel", "HTMLInfoPanel");
	
	equal(this.mockXmlBuilder.testHolder["/installation/resources"].children.length, 1, "1 resource created");
	var resource = this.mockXmlBuilder.testHolder["/installation/resources"].children[0];
	equal(resource.content, "", "no content for resource");
	equal(resource.attributes["id"], "HTMLInfoPanel.info", "default id for HTMLInfoPanel");
	equal(resource.attributes["src"], "info.html", "default src for HTMLInfoPanel");
	
	equal(this.mockFiles.length, 1, "one file");
	equal(this.mockFiles[0].name, "info.html", "named info.html");
});

test("InfoPanel: multiple panels", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "InfoPanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : true // HTML
			})
		},
		{
			clazz : "InfoPanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : false // TXT
			})
		},
		{
			clazz : "InfoPanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : true // HTML
			})
		},
		{
			clazz : "InfoPanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : false // TXT
			})
		}
	];
	this.mockXmlBuilder.countCases["/installation/panels/panel[@classname='HTMLInfoPanel']"] = [0, 1];
	this.mockXmlBuilder.countCases["/installation/panels/panel[@classname='InfoPanel']"] = [0, 1];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 4, "4 panels created");
	var panels = this.mockXmlBuilder.testHolder["/installation/panels"].children;
	
	equal(panels[0].content, "", "no content, <panel> 0");
	equal(panels[1].content, "", "no content, <panel> 1");
	equal(panels[2].content, "", "no content, <panel> 2");
	equal(panels[3].content, "", "no content, <panel> 3");
	
	equal(panels[0].attributes["classname"], "HTMLInfoPanel", "HTMLInfoPanel, <panel> 0");
	equal(panels[1].attributes["classname"], "InfoPanel", "InfoPanel, <panel> 1");
	equal(panels[2].attributes["classname"], "HTMLInfoPanel", "HTMLInfoPanel, <panel> 2");
	equal(panels[3].attributes["classname"], "InfoPanel", "InfoPanel, <panel> 3");
	
	equal(this.mockXmlBuilder.testHolder["/installation/resources"].children.length, 4, "4 resources created");
	var resources = this.mockXmlBuilder.testHolder["/installation/resources"].children;
	
	equal(resources[0].content, "", "no content for resource 0");
	equal(resources[1].content, "", "no content for resource 1");
	equal(resources[2].content, "", "no content for resource 2");
	equal(resources[3].content, "", "no content for resource 3");
	
	equal(resources[0].attributes["id"], "HTMLInfoPanel.info", "res@id : default id for HTMLInfoPanel 0");
	equal(resources[1].attributes["id"], "InfoPanel.info", "res@id : default id for InfoPanel 1");
	equal(resources[2].attributes["id"], "HTMLInfoPanel.info1", "res@id : custom id for HTMLInfoPanel 2");
	equal(resources[3].attributes["id"], "InfoPanel.info1", "res@id : custom id for HTMLInfoPanel 3");
	
	equal(resources[0].attributes["src"], "info.html", "res@src : default src for HTMLInfoPanel");
	equal(resources[1].attributes["src"], "info.txt", "res@src : default src for InfoPanel 1");
	equal(resources[2].attributes["src"], "info-1.html", "res@src : custom src for HTMLInfoPanel 2");
	equal(resources[3].attributes["src"], "info-1.txt", "res@src : custom src for InfoPanel 3");
	
	// no id when using the default resource id
	equal(panels[2].attributes["id"], "HTMLInfoPanel.info1", "panel@id : id for resource, <panel> 2");
	equal(panels[3].attributes["id"], "InfoPanel.info1", "panel@id : id for resource, <panel> 3");
	
	equal(this.mockFiles.length, 4, "four files");
	equal(this.mockFiles[0].name, "info.html", "named info.html");
	equal(this.mockFiles[1].name, "info.txt", "named info.txt");
	equal(this.mockFiles[2].name, "info-1.html", "named info-1.html");
	equal(this.mockFiles[3].name, "info-1.txt", "named info-1.txt");
});


/*---------------------------------------------------------------------------*/
/*------------------------------- LicencePanel ------------------------------*/
/*---------------------------------------------------------------------------*/

test("LicencePanel: text info panel", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "LicencePanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : false
			})
		}
	];
	this.mockXmlBuilder.countCases["/installation/panels/panel[@classname='LicencePanel']"] = [0];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 1, "1 panel created");
	var child = this.mockXmlBuilder.testHolder["/installation/panels"].children[0];
	equal(child.content, "", "no content");
	equal(child.attributes["classname"], "LicencePanel", "LicencePanel");
	
	equal(this.mockXmlBuilder.testHolder["/installation/resources"].children.length, 1, "1 resource created");
	var resource = this.mockXmlBuilder.testHolder["/installation/resources"].children[0];
	equal(resource.content, "", "no content for resource");
	equal(resource.attributes["id"], "LicencePanel.info", "default id for LicencePanel");
	equal(resource.attributes["src"], "license.txt", "default src for LicencePanel");
	
	equal(this.mockFiles.length, 1, "one file");
	equal(this.mockFiles[0].name, "license.txt", "named license.txt");
});


test("LicencePanel: html info panel", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "LicencePanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : true
			})
		}
	];
	this.mockXmlBuilder.countCases["/installation/panels/panel[@classname='HTMLLicencePanel']"] = [0];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 1, "1 panel created");
	var child = this.mockXmlBuilder.testHolder["/installation/panels"].children[0];
	equal(child.content, "", "no content");
	equal(child.attributes["classname"], "HTMLLicencePanel", "HTMLLicencePanel");
	
	equal(this.mockXmlBuilder.testHolder["/installation/resources"].children.length, 1, "1 resource created");
	var resource = this.mockXmlBuilder.testHolder["/installation/resources"].children[0];
	equal(resource.content, "", "no content for resource");
	equal(resource.attributes["id"], "HTMLLicencePanel.info", "default id for HTMLLicencePanel");
	equal(resource.attributes["src"], "license.html", "default src for HTMLLicencePanel");
	
	equal(this.mockFiles.length, 1, "one file");
	equal(this.mockFiles[0].name, "license.html", "named license.html");
});

test("LicencePanel: multiple panels", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "LicencePanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : true // HTML
			})
		},
		{
			clazz : "LicencePanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : false // TXT
			})
		},
		{
			clazz : "LicencePanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : true // HTML
			})
		},
		{
			clazz : "LicencePanel",
			config : new izpack.model.PanelConfig({
				"useHTML" : false // TXT
			})
		}
	];
	this.mockXmlBuilder.countCases["/installation/panels/panel[@classname='HTMLLicencePanel']"] = [0, 1];
	this.mockXmlBuilder.countCases["/installation/panels/panel[@classname='LicencePanel']"] = [0, 1];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 4, "4 panels created");
	var panels = this.mockXmlBuilder.testHolder["/installation/panels"].children;
	
	equal(panels[0].content, "", "no content, <panel> 0");
	equal(panels[1].content, "", "no content, <panel> 1");
	equal(panels[2].content, "", "no content, <panel> 2");
	equal(panels[3].content, "", "no content, <panel> 3");
	
	equal(panels[0].attributes["classname"], "HTMLLicencePanel", "HTMLLicencePanel, <panel> 0");
	equal(panels[1].attributes["classname"], "LicencePanel", "LicencePanel, <panel> 1");
	equal(panels[2].attributes["classname"], "HTMLLicencePanel", "HTMLLicencePanel, <panel> 2");
	equal(panels[3].attributes["classname"], "LicencePanel", "LicencePanel, <panel> 3");
	
	equal(this.mockXmlBuilder.testHolder["/installation/resources"].children.length, 4, "4 resources created");
	var resources = this.mockXmlBuilder.testHolder["/installation/resources"].children;
	
	equal(resources[0].content, "", "no content for resource 0");
	equal(resources[1].content, "", "no content for resource 1");
	equal(resources[2].content, "", "no content for resource 2");
	equal(resources[3].content, "", "no content for resource 3");
	
	equal(resources[0].attributes["id"], "HTMLLicencePanel.info", "res@id : default id for HTMLLicencePanel 0");
	equal(resources[1].attributes["id"], "LicencePanel.info", "res@id : default id for LicencePanel 1");
	equal(resources[2].attributes["id"], "HTMLLicencePanel.info1", "res@id : custom id for HTMLLicencePanel 2");
	equal(resources[3].attributes["id"], "LicencePanel.info1", "res@id : custom id for HTMLLicencePanel 3");
	
	equal(resources[0].attributes["src"], "license.html", "res@src : default src for HTMLLicencePanel");
	equal(resources[1].attributes["src"], "license.txt", "res@src : default src for LicencePanel 1");
	equal(resources[2].attributes["src"], "license-1.html", "res@src : custom src for HTMLLicencePanel 2");
	equal(resources[3].attributes["src"], "license-1.txt", "res@src : custom src for LicencePanel 3");
	
	// no id when using the default resource id
	equal(panels[2].attributes["id"], "HTMLLicencePanel.info1", "panel@id : id for resource, <panel> 2");
	equal(panels[3].attributes["id"], "LicencePanel.info1", "panel@id : id for resource, <panel> 3");
	
	equal(this.mockFiles.length, 4, "four files");
	equal(this.mockFiles[0].name, "license.html", "named license.html");
	equal(this.mockFiles[1].name, "license.txt", "named license.txt");
	equal(this.mockFiles[2].name, "license-1.html", "named license-1.html");
	equal(this.mockFiles[3].name, "license-1.txt", "named license-1.txt");
});


/*---------------------------------------------------------------------------*/
/*------------------------------- TargetPanel -------------------------------*/
/*---------------------------------------------------------------------------*/

test("TargetPanel: add the panel", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "TargetPanel"
		}
	];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 1, "1 panel created");
	var child = this.mockXmlBuilder.testHolder["/installation/panels"].children[0];
	equal(child.content, "", "no content");
	equal(child.attributes["classname"], "TargetPanel", "TargetPanel");
	
	equals(this.mockFiles.length, 0, "no file");
});


/*---------------------------------------------------------------------------*/
/*-------------------------------- PacksPanel -------------------------------*/
/*---------------------------------------------------------------------------*/

test("PacksPanel: PacksPanel", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "PacksPanel",
			config : new izpack.model.PanelConfig({
				"useTree" : false
			})
		}
	];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 1, "1 panel created");
	var child = this.mockXmlBuilder.testHolder["/installation/panels"].children[0];
	equal(child.content, "", "no content");
	equal(child.attributes["classname"], "PacksPanel", "PacksPanel");
	
	equals(this.mockFiles.length, 0, "no file");
});

test("PacksPanel: TreePacksPanel", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "PacksPanel",
			config : new izpack.model.PanelConfig({
				"useTree" : true
			})
		}
	];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 1, "1 panel created");
	var child = this.mockXmlBuilder.testHolder["/installation/panels"].children[0];
	equal(child.content, "", "no content");
	equal(child.attributes["classname"], "TreePacksPanel", "TreePacksPanel");
	
	equals(this.mockFiles.length, 0, "no file");
});

/*---------------------------------------------------------------------------*/
/*------------------------------- InstallPanel ------------------------------*/
/*---------------------------------------------------------------------------*/

test("InstallPanel: add the panel", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "InstallPanel"
		}
	];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 1, "1 panel created");
	var child = this.mockXmlBuilder.testHolder["/installation/panels"].children[0];
	equal(child.content, "", "no content");
	equal(child.attributes["classname"], "InstallPanel", "InstallPanel");
	
	equals(this.mockFiles.length, 0, "no file");
});


/*---------------------------------------------------------------------------*/
/*------------------------------- FinishPanel -------------------------------*/
/*---------------------------------------------------------------------------*/

test("FinishPanel: SimpleFinishPanel", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "FinishPanel",
			config : new izpack.model.PanelConfig({
				"addAutomated" : false
			})
		}
	];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 1, "1 panel created");
	var child = this.mockXmlBuilder.testHolder["/installation/panels"].children[0];
	equal(child.content, "", "no content");
	equal(child.attributes["classname"], "SimpleFinishPanel", "SimpleFinishPanel");
	
	equals(this.mockFiles.length, 0, "no file");
});

test("FinishPanel: FinishPanel", function () {
	this.mockDatas["panels"] = [
		{
			clazz : "FinishPanel",
			config : new izpack.model.PanelConfig({
				"addAutomated" : true
			})
		}
	];
	
	this.generator.addGeneratedInfo(this.mockXmlBuilder, this.mockFiles);
	
	equal(this.mockXmlBuilder.testHolder["/installation/panels"].children.length, 1, "1 panel created");
	var child = this.mockXmlBuilder.testHolder["/installation/panels"].children[0];
	equal(child.content, "", "no content");
	equal(child.attributes["classname"], "FinishPanel", "FinishPanel");
	
	equals(this.mockFiles.length, 0, "no file");
});

