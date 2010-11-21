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

steal('abstract')
.then(function( $ ) {

  Graoupack.Generators.Abstract.extend("Graoupack.Generators.Project", {
    addGeneratedInfo : function (wholeProject, files) {
      var xml = this.getFile(files, 'install.xml'),
          project = wholeProject.projects[0],
          authors = wholeProject.authors, // authors, js side
          author, // an author, js side
          authorsXml, // authors, xml side
          authorXml, // an author, xml side
          i; // iter
      if (authors.length) {
        authorsXml = xml.get("/installation/info/authors");
        for (i = 0; i < authors.length; i++) {
          author = authors[i];
          authorXml = authorsXml.createChild("author");
          authorXml.setAttribute("name", author.name);
          authorXml.setAttribute("email", author.mail);
        }
      }

      xml.get("/installation/info/appname").setContent(project.appname);
      xml.get("/installation/info/appversion").setContent(project.appversion);
    }
  });
});
