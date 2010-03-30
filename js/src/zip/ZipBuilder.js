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
/*jslint bitwise : false */

/**
 * Allow the creation of a zip containing the specified files.
 * @param {Array} files The files to put in the zip
 * @param {String} rootFolder The root folder, which will contains all files.
 *
 * each file have a name and a content. Example : 
 * files = [
 *   { name : "readme.txt", content : "this is a readme" },
 *   { name : "img/logo.png", content : "" }
 * ];
 *
 * A way to use it : 
 * window.open("data:application/zip;base64," + zipBuilder.createZIP())
 * This solution has known issues : 
 * - It more-or-less works on firefox, unknown on other browsers (IE < 8 doesn't support the data: uri scheme,
 *   IE 8 supports it only for images).
 * - on firefox (last : 3.6), the browser asks to download <random name>.zip.part.
 * 
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=367231
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=532230
 * 
 * An other way to do that is to use flash (yerk)
 * @see http://www.downloadify.info/
 */
$.Class("izpack.zip", "ZipBuilder", {
	
	init : function (files, rootFolder) {
		
		this.files = [];
		
		if (typeof rootFolder === "string" && rootFolder) {
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				file.name = rootFolder + "/" + file.name;
			}
		}
		this.files = this.getFilesAndFolders(files);
	},

	methods : {
		msdosTime : function (now) {
			var DOSTime, DOSDate;
			// http://www.delorie.com/djgpp/doc/rbinter/it/52/13.html
			// http://www.delorie.com/djgpp/doc/rbinter/it/65/16.html
			// http://www.delorie.com/djgpp/doc/rbinter/it/66/16.html
			
			DOSTime = now.getHours();
			DOSTime = DOSTime << 6;
			DOSTime = DOSTime | now.getMinutes();
			DOSTime = DOSTime << 5;
			DOSTime = DOSTime | now.getSeconds() / 2;

			DOSDate = now.getFullYear() - 1980;
			DOSDate = DOSDate << 4;
			DOSDate = DOSDate | (now.getMonth() + 1);
			DOSDate = DOSDate << 5;
			DOSDate = DOSDate | now.getDate();

			return [ DOSTime & 0xFF, (DOSTime & 0xFF00) >>> 8, DOSDate & 0xFF, (DOSDate & 0xFF00) >>> 8 ];
		},
		
		getFilesAndFolders : function (files) {
			var filesAndFolders = [];
			var createdFolders  = [];
			var foldersRegex    = /[^\/]+\//g;
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				var subFolders = file.name.match(foldersRegex);
				if (subFolders) {
					// create folders, if not already done
					var path = "";
					for (var folderIndex = 0; folderIndex < subFolders.length; folderIndex++) {
						path += subFolders[folderIndex];
						if ($.inArray(path, createdFolders) === -1) { // doesn't exist
							filesAndFolders.push({
								name : path,
								content : ""
							});
							createdFolders.push(path);
						}
					}
				}
				filesAndFolders.push(file);
			}
			return filesAndFolders;
		},
		
		dumpHex : function (arrayBytes, message) {
			var res = "";
			for (var i = 0; i < arrayBytes.length; i++) {
				res += arrayBytes[i].toString(16) + " ";
			}
			console.debug("ZipBuilder::dumpHex : ", res, message);
			return res;
		},
		
		intToBytes : function (integer, bytesNb) {
			var mask = 0xFF;
			var offset = 0;
			var res = [];
			for (var i = 0; i < bytesNb; i++) {
				res.push((integer & mask) >>> offset);
				mask = mask << 8;
				offset += 8;
			}
			return res;
		},
		
		stringToBytes : function (myString) {
			var res = [];
			for (var i = 0; i < myString.length; i++) {
				res.push(myString.charCodeAt(i));
			}
			return res;
		},
		
		/*
		 * local file header signature     4 bytes  (0x04034b50)
		 * version needed to extract       2 bytes
		 * general purpose bit flag        2 bytes
		 * compression method              2 bytes
		 * last mod file time              2 bytes
		 * last mod file date              2 bytes
		 * crc-32                          4 bytes
		 * compressed size                 4 bytes
		 * uncompressed size               4 bytes
		 * file name length                2 bytes
		 * extra field length              2 bytes
		 * file name (variable size)
		 * extra field (variable size)
		 */
		getLocalFileHeader : function (file) {
			var now = new Date();
			return [0x50, 0x4b, 0x03, 0x04].concat( // magic number, 4 bytes. Here : a zip file :)
				[0x0a, 0x0], // version needed to extract, 2 bytes. Here "Default value" (zip 1.0)
				[0x0, 0x0], // general purpose bit flag, 2 bytes. Here : nothing special
				[0x0, 0x0], // compression method, 2 bytes. Here : STORE
				this.msdosTime(now), // last mod file time/date, 2+2 bytes
				this.intToBytes($.crc32(file.content), 4), // crc-32, 4 bytes
				this.intToBytes(file.content.length, 4), // compressed-size, 4 bytes (no compression, same as uncompressed)
				this.intToBytes(file.content.length, 4), // uncompressed-size, 4 bytes
				this.intToBytes(file.name.length, 2), // file name length, 2 bytes
				[0x0, 0x0], // extra field length, 2 bytes
				this.stringToBytes(file.name), // file name, variable size
				[]); // extra field, variable size
		},

		/*
		 * central file header signature   4 bytes  (0x02014b50)
		 * version made by                 2 bytes
		 * version needed to extract       2 bytes
		 * general purpose bit flag        2 bytes
		 * compression method              2 bytes
		 * last mod file time              2 bytes
		 * last mod file date              2 bytes
		 * crc-32                          4 bytes
		 * compressed size                 4 bytes
		 * uncompressed size               4 bytes
		 * file name length                2 bytes
		 * extra field length              2 bytes
		 * file comment length             2 bytes
		 * disk number start               2 bytes
		 * internal file attributes        2 bytes
		 * external file attributes        4 bytes
		 * relative offset of local header 4 bytes
		 * file name (variable size)
		 * extra field (variable size)
		 * file comment (variable size)
		 */
		getCentralDirectoryFileHeader : function (file, offsetFromStart) {
			var now = new Date();
			return [0x50, 0x4b, 0x01, 0x02].concat( // central file header signature, 4bytes
				[0x14, 0xFF], // version made by, 2 bytes. 'Javascript VM' doesn't exist, so 0xFF, zip version 2.0 or above.
				[0x0a, 0x0], // version needed to extract, 2 bytes. Here "Default value" (zip 1.0)
				[0x0, 0x0], // general purpose bit flag, 2 bytes. Here : nothing special
				[0x0, 0x0], // compression method, 2 bytes. Here : STORE
				this.msdosTime(now), // last mod file time/date, 2+2 bytes
				this.intToBytes($.crc32(file.content), 4), // crc-32, 4 bytes
				this.intToBytes(file.content.length, 4), // compressed-size, 4 bytes (no compression, same as uncompressed)
				this.intToBytes(file.content.length, 4), // uncompressed-size, 4 bytes
				this.intToBytes(file.name.length, 2), // file name length, 2 bytes
				[0x0, 0x0], // extra field length, 2 bytes
				[0x0, 0x0], // file comment length, 2 bytes
				[0x0, 0x0], // disk number start, 2 bytes
				[0x0, 0x0], // internal file attributes, 2 bytes
				[0x0, 0x0, 0x0, 0x0], // external file attributes, 4 bytes
				this.intToBytes(offsetFromStart, 4), // relative offset of the local header, 4 bytes
				this.stringToBytes(file.name), // file name, variable size
				[], // extra field, variable size
				[]); // file comment, variable size
		},

		/*
		 * end of central dir signature    4 bytes  (0x06054b50)
		 * number of this disk             2 bytes
		 * number of the disk with the
		 * start of the central directory  2 bytes
		 * total number of entries in the
		 * central directory on this disk  2 bytes
		 * total number of entries in
		 * the central directory           2 bytes
		 * size of the central directory   4 bytes
		 * offset of start of central
		 * directory with respect to
		 * the starting disk number        4 bytes
		 * .ZIP file comment length        2 bytes
		 * .ZIP file comment       (variable size)
		 */			
		getEndOfCentralDirectory : function (files, centralDirectoryStart, centralDirectoryEnd) {
			var zipComment = "Created by GraouPack";
			return [0x50, 0x4b, 0x05, 0x06].concat( // end of central dir signature, 4 bytes
				this.intToBytes(0, 2), // number of this disk, 2 bytes
				this.intToBytes(0, 2), // number of the disk with the start of the central directory, 2 bytes
				this.intToBytes(files.length, 2), // total number of entries in the central directory on this disk, 2 bytes
				this.intToBytes(files.length, 2), // total number of entries in the central directory, 2 bytes
				this.intToBytes(centralDirectoryEnd - centralDirectoryStart, 4), // size of the central directory, 4 bytes
				this.intToBytes(centralDirectoryStart, 4), // offset of start of central directory with respect to the starting disk number, 4 bytes
				this.intToBytes(zipComment.length, 2), // zip file comment length, 2 bytes
				this.stringToBytes(zipComment)); // zip file comment, variable size
		},

		createZIP : function () {
			var i, file;
			var zip = []; // array of bytes

			var centralDirectoryStart = 0;
			var centralDirectoryEnd = 0;
			
			for (i = 0; i < this.files.length; i++) {
				// write the header + content
				file = this.files[i];
				var header = this.getLocalFileHeader(file).concat(this.stringToBytes(file.content));
				//this.dumpHex(header, "header for " + file.name);
				zip = zip.concat(header);
				centralDirectoryStart += header.length;
				file.sizeLocalFile = header.length;
			}
			var currentOffsetFromStart = 0;
			centralDirectoryEnd = centralDirectoryStart;
			for (i = 0; i < this.files.length; i++) {
				// write the header for central directory
				file = this.files[i];
				var directoryHeader = this.getCentralDirectoryFileHeader(file, currentOffsetFromStart);
				//this.dumpHex(directoryHeader, "directory header for " + file.name);
				zip = zip.concat(directoryHeader);
				centralDirectoryEnd += directoryHeader.length;
				currentOffsetFromStart += file.sizeLocalFile;
			}
			// end of central directory record
			zip = zip.concat(this.getEndOfCentralDirectory(this.files, centralDirectoryStart, centralDirectoryEnd));
			//this.dumpHex(zip, "final zip");
			return $.base64.encode(zip);
		}
	}
});
