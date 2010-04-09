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

/**
 * Simple wrapper to create classes.
 * Usage : 
 * $.Class("namespace", "ClassName", {
 *   isa : namespace.MotherClass, // shortcut : same namespace, can also written isa : "MotherClass"
 *   init : {
 *     this._super(arg1);
 *     this.attr1 = null;
 *     this.attr2 = "graou !";
 *   },
 *   methods : {
 *     myMethod : function (a, b) {
 *     }
 *   }
 * });
 */
$.Class = function () {
	var args = arguments,
		namespace = args[0], // String
		className = args[1], // String
		classContent = args[2], // object
		objNameSpace = $.namespace(namespace),
		motherClassNotFound = "mother class for " + namespace + "." + className + " not found";
	
	// isa specified but resolved to undefined
	if	("isa" in classContent && typeof classContent.isa === "undefined") {
		throw motherClassNotFound;
	}
	
	classContent = $.extend({
		isa : Class, // Class from John Resig impl
		init : {},
		methods : {},
		abstracts : {}
	}, classContent);
	
	// for each abstract method, we put a method in the methods object
	$.each(classContent.abstracts, function (key, value) {
		classContent.methods[key] = function () {
			var err = namespace + "." + className + ":" + key + " must be overriden !";
			/*DEBUG_START*/
			console.error(err);
			/*DEBUG_STOP*/
			throw err;
		};
	});
	
	// we put the init method with the others
	classContent.methods.init = classContent.init;
	
	if (typeof classContent.isa === "string") {
		classContent.isa = objNameSpace[classContent.isa];
		if (! classContent.isa) {
			throw motherClassNotFound;
		}
	}

	objNameSpace[className] = classContent.isa.extend(classContent.methods);
};
