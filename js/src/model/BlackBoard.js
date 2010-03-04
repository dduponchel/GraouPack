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
 
$.namespace("izpack.model");

izpack.model.BlackBoard = function () {
	this.data = {};
	this.name = "BlackBoard";
};

izpack.model.BlackBoard.prototype = {

	get : function (key) {
		console.debug(this.name + "::get '" + key + "'");
		return this.data[key];
	},
	
	set : function (key, value) {
		console.debug(this.name + "::set '" + key + "' : ", value);
		this.data[key] = value;
	},
	
	add : function (key, value) {
		console.debug(this.name + "::add '" + key + "' : ", value);
		if (!this.data[key]) {
			this.data[key] = [];
		}
		this.data[key].push(value);
	},
	
	isDefined : function (key) {
		console.debug(this.name + "::isDefined '" + key + "' = ", typeof this.data[key] !== "undefined");
		return (typeof this.data[key] !== "undefined");
	},
	
	remove : function (key) {
		delete this.data[key];
	}
};
