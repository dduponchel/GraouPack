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

$.Class("izpack.view", "Locale", {
	isa : "GenericView",
	init : function () {
		this._super("locale");
		this.available =	"#tab-locale-available";
		this.selected  =	"#tab-locale-selected";
		this.lists     =	"#tab-locale ul";
	},
	methods : {
		initView : function () {
			$(this.lists).sortable({
				connectWith : this.lists,
				placeholder : 'ui-state-highlight'
			})
			.bind('sortupdate', {view: this}, function (event, ui) {
				var view = event.data.view;
				if ($(this).is(view.selected)) {
					$(view.selected).trigger("izpack.change");
				}
			})
			.disableSelection();

		},

		getLocales : function () {
			var locales = [];
			$("li", this.selected).each(function () {
				locales.push($(this).attr("data-iso3"));
			});
			return locales;
		},

		setLocales : function (locales) {
			var currentLocales = {};
			$("li", this.selected).each(function () {
				currentLocales[$(this).attr("data-iso3")] = $(this);
			});
			for (var i = 0; i < locales.length; i++) {
				var locale = locales[i];
				if (locale in currentLocales) {
					// this locale is already selected, we do nothing
					delete currentLocales[locale];
				}
				else {
					// the locale isn't selected, we add it
					$("li[data-iso3=" + locale + "]", this.available).appendTo(this.selected);
				}
			}
			// the remaining locales in currentLocales are no longer relevant
			for (var currentLocale in currentLocales) {
				if (currentLocales.hasOwnProperty(currentLocale)) {
					$("li[data-iso3=" + currentLocale + "]", this.selected).appendTo(this.available);
				}
			}
		}
	}
});
