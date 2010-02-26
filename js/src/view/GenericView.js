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
 
$.namespace("izpack.view");

/**
 * A generic tab.
 * @param {String} name The internal name of the tab.
 */
izpack.view.GenericView = function (name) {
	
	/**
	 * The name of the tab.
	 */
	this.name = name;

	/**
	 * The html id used for this tab.
	 */
	this.id = "tab-" + name;
	
	/**
	 * the url of the associated view
	 */
	this.href = "html/" + this.id + ".html";

	/**
	 * Is the html view loaded ?
	 */
	this.viewLoaded = false;
};

izpack.view.GenericView.prototype = {
        /**
         * Verify if all required infos for this generator are here.
         * @return {boolean} true if everything is ok, false otherwise.
         */
	validate : function () {
		throw "validate must be overriden !";
	},
	
	/**
	 * This method is called when the view (html) is loaded.
	 * It calls then the method initView.
	 */
	load : function () {
		this.viewLoaded = true;
		this.initView();
	},
	
	/**
	 * Adds the UI logic (drag/drop, etc) as soon as the html tab is loaded.
	 */
	initView : function () {
		throw "initView must be overriden !";
	}
};
