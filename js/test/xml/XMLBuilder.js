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
 
function checkXMLElt(xml, name, children) {
	equal(xml.getChildren().length, children, "number of children for " + name);
	equal(xml.getName(), name, "elt name for " + name);
}

module("XMLBuilder", {
	setup: function(){
		this.xmlBuilder = izpack.xml.XMLBuilder.createInstance();
	},
	teardown: function(){
		this.xmlBuilder = null;
	}
});

test("get: empty", function() {
	try {
		var res = this.xmlBuilder.get("");
	}
	catch(e) {
		ok(true, "exception thrown");
		return;
	}
	ok(false, "exception not thrown !");
});

test("get: root elt", function() {
	var res = this.xmlBuilder.get("/installation");
	equal(res.getName(), "installation");
});

test("get: sub sub elt", function() {
	var res = this.xmlBuilder.get("/installation/sub/sub2");
	checkXMLElt(res, "sub2", 0);

	var installation = this.xmlBuilder.getRootElement();
	checkXMLElt(installation, "installation", 1);

	var sub = installation.getChildren()[0];
	checkXMLElt(sub, "sub", 1);

	var sub2 = sub.getChildren()[0];
	checkXMLElt(sub2, "sub2", 0);
});

test("get: multiple runs", function() {
	var res1 = this.xmlBuilder.get("/installation/a/b");
	var res2 = this.xmlBuilder.get("/installation/a/c");
	
	checkXMLElt(res1, "b", 0);
	checkXMLElt(res2, "c", 0);
	
	var installation = this.xmlBuilder.getRootElement();
	checkXMLElt(installation, "installation", 1);
	
	var a = installation.getChildren()[0];
	checkXMLElt(a, "a", 2);
	
	var b = a.getChildren()[0];
	checkXMLElt(b, "b", 0);
	
	var c = a.getChildren()[1];
	checkXMLElt(c, "c", 0);
});

test("toXMLString: empty xml", function(){
	equal(this.xmlBuilder.toXMLString(), 
		'<?xml version="1.0" encoding="utf-8" standalone="yes" ?>\r\n' +
		'<installation version="1.0"/>');
});

test("toXMLString: linear tree, indented xml", function(){
	var appname = this.xmlBuilder.get("/installation/info/appname");
	appname.setAttribute("test", true);
	appname.setContent("IzPack Js Builder");
	equal(this.xmlBuilder.toXMLString(), 
		'<?xml version="1.0" encoding="utf-8" standalone="yes" ?>\r\n' +
		'<installation version="1.0">\r\n' +
		'  <info>\r\n' +
		'    <appname test="true">IzPack Js Builder</appname>\r\n' +
		'  </info>\r\n' +
		'</installation>');
});

test("toXMLString: non linear tree, indented xml", function(){
	var appname = this.xmlBuilder.get("/installation/info/appname");
	appname.setAttribute("test", true);
	appname.setContent("IzPack Js Builder");
	var appversion = this.xmlBuilder.get("/installation/info/appversion");
	appversion.setAttribute("foo", "baz");
	equal(this.xmlBuilder.toXMLString(), 
		'<?xml version="1.0" encoding="utf-8" standalone="yes" ?>\r\n' +
		'<installation version="1.0">\r\n' +
		'  <info>\r\n' +
		'    <appname test="true">IzPack Js Builder</appname>\r\n' +
		'    <appversion foo="baz"/>\r\n' + 
		'  </info>\r\n' +
		'</installation>');
});

test("createElement: create a new element", function(){
	var info = this.xmlBuilder.get("/installation/info");
	equal(0, info.getChildren().length, "no child");
	var appname = info.createChild("appname");
	equal(1, info.getChildren().length, "a new child");
	checkXMLElt(appname, "appname", 0);
});

test("count: simple xpath request", function(){
	var info = this.xmlBuilder.get("/installation/info");
	equal(0, this.xmlBuilder.count("/installation/info/sub"), "first, no element");
	info.createChild("sub");
	info.createChild("sub");
	info.createChild("sub");
	equal(3, this.xmlBuilder.count("/installation/info/sub"), "elements found");
});

test("count: complex xpath request", function(){
	var info = this.xmlBuilder.get("/installation/info");
	equal(0, this.xmlBuilder.count("/installation/info/sub[@id='foo']"), "first, no element");
	info.createChild("sub");
	var futureChange = info.createChild("sub");
	info.createChild("sub");
	equal(0, this.xmlBuilder.count("/installation/info/sub[@id='foo']"), "no element matching the condition");
	futureChange.setAttribute("id", "foo");
	equal(1, this.xmlBuilder.count("/installation/info/sub[@id='foo']"), "only one elt matches");
});
