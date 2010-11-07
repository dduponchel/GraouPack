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
 * @tag models, home
 * A locale used by the installer.
*/
Graoupack.Models.Abstract.extend('Graoupack.Models.Locale', /* @Static */ {
  attributes : {
    iso3: 'string',
    name: 'string'
  },
  /**
 * A static table of all available locales.
 */
  available : [
    {iso3 : "cat", name : "Catalunyan"},
    {iso3 : "chn", name : "Chinese"},
    {iso3 : "cze", name : "Czech"},
    {iso3 : "dan", name : "Danish"},
    {iso3 : "glg", name : "Galician"},
    {iso3 : "deu", name : "German"},
    {iso3 : "eng", name : "English"},
    {iso3 : "eus", name : "Basque"},
    {iso3 : "fin", name : "Finnish"},
    {iso3 : "fra", name : "French"},
    {iso3 : "hun", name : "Hungarian"},
    {iso3 : "ita", name : "Italian"},
    {iso3 : "jpn", name : "Japanese"},
    {iso3 : "mys", name : "Malaysian"},
    {iso3 : "ned", name : "Nederlands"},
    {iso3 : "nor", name : "Norwegian"},
    {iso3 : "pol", name : "Polnish"},
    {iso3 : "por", name : "Portuguese (Brazilian)"},
    {iso3 : "prt", name : "Portuguese (European)"},
    {iso3 : "rom", name : "Romanian"},
    {iso3 : "rus", name : "Russian"},
    {iso3 : "scg", name : "Serbian"},
    {iso3 : "spa", name : "Spanish"},
    {iso3 : "svk", name : "Slovakian"},
    {iso3 : "swe", name : "Swedish"},
    {iso3 : "ukr", name : "Ukrainian"}
  ],

  /**
 * When the class loads, add an id on the available locales.
 */
  init : function () {
    // give them an id
    for(var i in this.available) {
      this.available[i].id = i;
    }
  },

  /**
    * Retrieves locales not selected.
    * @param {Function} success a callback function that returns wrapped locale objects.
    * @param {Function} error a callback function for an error in the ajax request.
*/
  findRemainingAvailable : function (success, error) {
    var selected = this.get("locales");
    var remaining = this.available.filter(function (value, index, array) {
      for(var i in selected) {
        if (selected[i].iso3 === value.iso3) {
          return false;
        }
      }
      return true;
    });
    success(this.wrapMany(remaining));
  },
  /**
    * Retrieves the selected locales.
    * @param {Function} success a callback function that returns wrapped locale objects.
    * @param {Function} error a callback function for an error in the ajax request.
*/
  getSelected : function (success, error) {
    success(this.wrapMany(this.getArray("locales")));
  },
  /**
    * Change the locales that are selected.
    * @param {Function} success a callback function that returns wrapped locale objects.
    * @param {Function} error a callback function for an error in the ajax request.
*/
  updateSelected : function (array, success, error) {
    this.set("locales", array);
    success(this.wrapMany(array));
  }
},
/* @Prototype */
{});
