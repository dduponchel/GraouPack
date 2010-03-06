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
 
$.namespace("izpack.zip.ZipBuilder");

izpack.zip.ZipBuilder = function (files) {
	
	this.files = files;
	/* = [
		{
			name : "readme.txt",
			content : "this is a readme"
		},
		{
			name : "logo.png",
			content : ""
		}
	];
	*/
};

izpack.zip.ZipBuilder.prototype = {
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

		return 	String.fromCharCode(DOSTime & 0xFF, (DOSTime & 0xFF00) >> 8, DOSDate & 0xFF, (DOSDate & 0xFF00) >> 8);
	},
	
	intToBytes : function (integer, bytesNb) {
		var mask = 0xFF;
		var offset = 0;
		var res = [];
		for (var i = 0; i < bytesNb; i++) {
			res.push((integer & mask) >> offset);
			mask = mask << 8;
			offset += 8;
		}
		return  String.fromCharCode.apply(String, res);
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
		var zero = String.fromCharCode(0x0);
		return String.fromCharCode(0x50, 0x4b, 0x03, 0x04) + // magic number, 4 bytes. Here : a zip file :)
			String.fromCharCode(0x0a, 0x0) + // version needed to extract, 2 bytes. Here "Default value" (zip 1.0)
			zero + zero + // general purpose bit flag, 2 bytes. Here : nothing special
			zero + zero + // compression method, 2 bytes. Here : STORE
			this.msdosTime(now) + // last mod file time/date, 2+2 bytes
			this.intToBytes($.crc32(file.content), 4) + // crc-32, 4 bytes
			this.intToBytes(file.content.length, 4) + // compressed-size, 4 bytes (no compression, same as uncompressed)
			this.intToBytes(file.content.length, 4) + // uncompressed-size, 4 bytes
			this.intToBytes(file.name.length, 2) + // file name length, 2 bytes
			zero + zero + // extra field length, 2 bytes
			file.name + // file name, variable size
			""; // extra field, variable size
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
		var zero = String.fromCharCode(0x0);
		return String.fromCharCode(0x50, 0x4b, 0x01, 0x02) + // central file header signature, 4bytes
			String.fromCharCode(0x1E, 0x3) + // version made by, 2 bytes. Here : UNIX, zip version 1.0 or above.
			String.fromCharCode(0x0a, 0x0) + // version needed to extract, 2 bytes. Here "Default value" (zip 1.0)
			zero + zero + // general purpose bit flag, 2 bytes. Here : nothing special
			zero + zero + // compression method, 2 bytes. Here : STORE
			this.msdosTime(now) + // last mod file time/date, 2+2 bytes
			this.intToBytes($.crc32(file.content), 4) + // crc-32, 4 bytes
			this.intToBytes(file.content.length, 4) + // compressed-size, 4 bytes (no compression, same as uncompressed)
			this.intToBytes(file.content.length, 4) + // uncompressed-size, 4 bytes
			this.intToBytes(file.name.length, 2) + // file name length, 2 bytes
			zero + zero + // extra field length, 2 bytes
			zero + zero + // file comment length, 2 bytes
			zero + zero + // disk number start, 2 bytes
			zero + zero + // internal file attributes, 2 bytes
			zero + zero + zero + zero + // external file attributes, 4 bytes
			this.intToBytes(offsetFromStart, 4) + // relative offset of the local header, 4 bytes
			file.name + // file name, variable size
			"" + // extra field, variable size
			""; // file comment, variable size
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
		return String.fromCharCode(0x50, 0x4b, 0x05, 0x06) + // end of central dir signature, 4 bytes
			this.intToBytes(0, 2) + // number of this disk, 2 bytes
			this.intToBytes(0, 2) + // number of the disk with the start of the central directory, 2 bytes
			this.intToBytes(files.length, 2) + // total number of entries in the central directory on this disk, 2 bytes
			this.intToBytes(files.length, 2) + // total number of entries in the central directory, 2 bytes
			this.intToBytes(centralDirectoryEnd - centralDirectoryStart, 4) + // size of the central directory, 4 bytes
			this.intToBytes(centralDirectoryStart, 4) + // offset of start of central directory with respect to the starting disk number, 4 bytes
			this.intToBytes(zipComment.length, 2) + // zip file comment length, 2 bytes
			zipComment; // zip file comment, variable size
	},


	createZIP : function () {
		var i, file;
		var zip = ""; // yes, a bunch of bits in a string. It works and the base64 function needs a string...
		var centralDirectoryStart = 0;
		var centralDirectoryEnd = 0;
		for (i = 0; i < this.files.length; i++) {
			// write the header + content
			file = this.files[i];
			var header = this.getLocalFileHeader(file);
			zip += header;
			zip += file.content;
			file.sizeLocalFile = header.length + file.content.length;
			centralDirectoryStart += file.sizeLocalFile;
		}
		var currentOffsetFromStart = 0;
		centralDirectoryEnd = centralDirectoryStart;
		for (i = 0; i < this.files.length; i++) {
			// write the header for central directory
			file = this.files[i];
			var directoryHeader = this.getCentralDirectoryFileHeader(file, currentOffsetFromStart);
			zip += directoryHeader;
			centralDirectoryEnd += directoryHeader.length;
			currentOffsetFromStart += file.sizeLocalFile;
		}
		// end of central directory record
		zip += this.getEndOfCentralDirectory(files, centralDirectoryStart, centralDirectoryEnd);
		return $.base64.encode(zip);
	}
};
