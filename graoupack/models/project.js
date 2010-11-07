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
 * The project the user is working on.
*/
Graoupack.Models.Abstract.extend('Graoupack.Models.Project', /* @Static */ {
  attributes : {
    appname : 'string',
    appversion : 'string'
  },
  /**
    * Retrieves the project, or create one if none.
    * @param {Object} params params that might refine your results.
    * @param {Function} success a callback function that returns wrapped project objects.
    * @param {Function} error a callback function for an error in the ajax request.
    */
  findOrCreateOne: function (params, success, error) {
    var obj = this.get('project');
    if (obj === null) {
      obj = new Graoupack.Models.Project().save(this.callback(['wrap', success]));
    }
    else {
      success(this.wrap(obj));
    }
  },
  /**
    * Updates a project's data.
    * @param {String} id A unique id representing your project.
    * @param {Object} attrs Data to update your project with.
    * @param {Function} success a callback function that indicates a successful update.
    * @param {Function} error a callback that should be called with an object of errors.
    */
  update: function (id, attrs, success, error) {
    this.set('project', attrs);
    success(attrs);
  },
  /**
    * Creates a project.
    * @param {Object} attrs A project's attributes.
    * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
    * @param {Function} error a callback that should be called with an object of errors.
    */
  create: function (attrs, success, error) {
    attrs.id = 'onlyOne';
    this.set('project', attrs);
    success(attrs);
  }
},
/* @Prototype */
{});
