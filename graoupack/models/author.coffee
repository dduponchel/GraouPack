###
Licensed under BSD http://en.wikipedia.org/wiki/BSD_License
Copyright (c) 2010, Duponchel David
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the GraouPack nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DUPONCHEL DAVID BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
###

"use strict"

###*
 * @tag models, home
 * An author of the application.
*###
Graoupack.Models.Abstract.extend('Graoupack.Models.Author', {
  attributes : {
    name: 'string'
    mail: 'string'
  }
  # taken from http://validity.thatscaptaintoyou.com/
  emailRegex : /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i

  init : ->
    @validate('mail', ->
      if not @Class.emailRegex.test @mail
        return "not an email"
    )
    @validatePresenceOf 'name'

  ###*
   * Retrieves all authors.
   * @param {Object} params params that might refine your results.
   * @param {Function} success a callback function that returns wrapped author objects.
   * @param {Function} error a callback function for an error in the ajax request.
  *###
  findAll : (params, success, error) ->
    obj = @getArray('authors')
    success(@wrapMany(obj))

  ###*
   * Updates a author's data.
   * @param {String} id A unique id representing your author.
   * @param {Object} attrs Data to update your author with.
   * @param {Function} success a callback function that indicates a successful update.
   * @param {Function} error a callback that should be called with an object of errors.
  *###
  update: (id, attrs, success, error) ->
    updated = @updateById("authors", id, attrs)
    success updated

  ###*
   * Destroys an author's data.
   * @param {String} id A unique id representing your author.
   * @param {Function} success a callback function that indicates a successful destroy.
   * @param {Function} error a callback that should be called with an object of errors.
  *###
  destroy: (id, success, error) ->
    @remove("authors", id)
    success()

  ###*
   * Creates an author.
   * @param {Object} attrs A author's attributes.
   * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
   * @param {Function} error a callback that should be called with an object of errors.
  *###
  create: (attrs, success, error) ->
    @add('authors', attrs)
    success attrs
},
{})
