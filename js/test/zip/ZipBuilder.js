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
 
module("ZipBuilder");

var zip = {
	zipBuilder : new izpack.zip.ZipBuilder([]),
	content : function (args) {// crc32, size, name, nameSize, content
		return [].concat([0x50, 0x4b, 0x03, 0x04], // magic number
		[0x0a, 0x0, 0x0, 0x0, 0x0, 0x0], // we keep it simple
		this.zipBuilder.msdosTime(new Date()),
		args.crc32, // crc32
		args.size, // size (compressed)
		args.size, // size
		args.nameSize, // name size
		[0x0, 0x0], // unused
		args.name,
		args.content);
	},
	centralDir : function (args) { // crc32, size, offset, name, nameSize
		return [].concat([0x50, 0x4b, 0x01, 0x02], // magic number
		[0x14, 0xFF, 0x0a, 0x0, 0x0, 0x0, 0x0, 0x0], // blabla
		this.zipBuilder.msdosTime(new Date()),
		args.crc32, // crc32
		args.size, // size (compressed)
		args.size, // size
		args.nameSize, // name size
		[0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0], // blabla....
		args.offset, // offset from the start
		args.name);
	},
	endCentralDir : function (args) { // fileNb, CDSize, CDOffset
		return [].concat([0x50, 0x4b, 0x05, 0x06], // magic number
		[0x0, 0x0, 0x0, 0x0],
		args.fileNb, args.fileNb, // total, on this volume
		args.CDSize, // central dir size
		args.CDOffset, // central dir offset
		[0x14, 0x0], // comment size
		[0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x20, 0x62, 0x79, 0x20, 0x47, 0x72, 0x61, 0x6F, 0x75, 0x50, 0x61, 0x63, 0x6B] // Created by GraouPack
		);
	}
};

test("one file", function() {
	var zipBuilder = new izpack.zip.ZipBuilder([{ name : "foooo", content : "bar" }]);
	
	var files = {
		"foooo" : {
			crc32 : [0xaa, 0x8c, 0xff, 0x76],
			size : [0x03, 0x0, 0x0, 0x0],
			nameSize : [0x05, 0x0],
			name : [0x66, 0x6f, 0x6f, 0x6f, 0x6f], // foooo
			content : [0x62, 0x61, 0x72], // bar
			offset : [0x0, 0x0, 0x0, 0x0]
		}
	};
	
	var res = [].concat(
		/*
		 * content
		 */
		zip.content(files["foooo"]),
		/*
		 * central directory
		 */
		zip.centralDir(files["foooo"]),
		/*
		 * end of central directory
		 */
		zip.endCentralDir({
			fileNb : [0x01, 0x0],
			CDSize : [0x33, 0x0, 0x0, 0x0],
			CDOffset : [0x26, 0x0, 0x0, 0x0]
		})
	);
	
	zipBuilder.dumpHex(res, "theoretical result");
	
	equal(zipBuilder.createZIP(), $.base64.encode(res));
});

test("two files + directories", function() {
	var zipBuilder = new izpack.zip.ZipBuilder([
		{ name : "foooo",     content : "bar" },
		{ name : "folder/fo", content : "baar" }
	], "rootFolder");
	
	var files = {
		"rootFolder/" : {
			crc32 : [0x0, 0x0, 0x0, 0x0],
			size : [0x00, 0x0, 0x0, 0x0],
			nameSize : [0x0b, 0x0],
			name : [0x72, 0x6f, 0x6f, 0x74, 0x46, 0x6f, 0x6c, 0x64, 0x65, 0x72, 0x2f], // rootFolder/
			content : [],
			offset : [0x0, 0x0, 0x0, 0x0]
		},
		"rootFolder/foooo" : {
			crc32 : [0xaa, 0x8c, 0xff, 0x76],
			size : [0x03, 0x0, 0x0, 0x0],
			nameSize : [0x10, 0x0],
			name : [0x72, 0x6f, 0x6f, 0x74, 0x46, 0x6f, 0x6c, 0x64, 0x65, 0x72, 0x2f, 0x66, 0x6f, 0x6f, 0x6f, 0x6f], // rootFolder/foooo
			content : [0x62, 0x61, 0x72], // bar 
			offset : [0x29, 0x0, 0x0, 0x0]
		},
		"rootFolder/folder/" : {
			crc32 : [0x0, 0x0, 0x0, 0x0],
			size : [0x00, 0x0, 0x0, 0x0],
			nameSize : [0x12, 0x0],
			name : [0x72, 0x6f, 0x6f, 0x74, 0x46, 0x6f, 0x6c, 0x64, 0x65, 0x72, 0x2f, 0x66, 0x6f, 0x6c, 0x64, 0x65, 0x72, 0x2f], // rootFolder/folder/
			content : [],
			offset : [0x5a, 0x0, 0x0, 0x0]
		},
		"rootFolder/folder/fo" : {
			crc32 : [0x75, 0xb, 0x93, 0x3b],
			size : [0x04, 0x0, 0x0, 0x0],
			nameSize : [0x14, 0x0],
			name : [0x72, 0x6f, 0x6f, 0x74, 0x46, 0x6f, 0x6c, 0x64, 0x65, 0x72, 0x2f, 0x66, 0x6f, 0x6c, 0x64, 0x65, 0x72, 0x2f, 0x66, 0x6f], // rootFolder/folder/fo
			content : [0x62, 0x61, 0x61, 0x72], // baar
			offset : [0x8a, 0x0, 0x0, 0x0]
		},
	};
	
	var res = [].concat(
		/*
		 * content
		 */
		zip.content(files["rootFolder/"]),
		zip.content(files["rootFolder/foooo"]),
		zip.content(files["rootFolder/folder/"]),
		zip.content(files["rootFolder/folder/fo"]),
		/*
		 * central directory
		 */
		zip.centralDir(files["rootFolder/"]),
		zip.centralDir(files["rootFolder/foooo"]),
		zip.centralDir(files["rootFolder/folder/"]),
		zip.centralDir(files["rootFolder/folder/fo"]),
		/*
		 * end of central directory
		 */
		zip.endCentralDir({
			fileNb : [0x04, 0x0],
			CDSize : [0xf9, 0x0, 0x0, 0x0],
			CDOffset : [0xc0, 0x0, 0x0, 0x0]
		})
	);
	
	zipBuilder.dumpHex(res, "theoretical result");
	
	equal(zipBuilder.createZIP(), $.base64.encode(res));
});
