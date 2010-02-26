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

izpack.view.Project = function () {
	
	this.appname = "#" + this.id + " fieldset.application input[name=tab-project-appname]";
	this.appversion = "#" + this.id + " fieldset.application input[name=tab-project-appversion]";
	
	this.addAuthorFields =	"#" + this.id + " fieldset.authors input";
	this.addAuthorName =		"#" + this.id + " fieldset.authors input[name=tab-project-name]";
	this.addAuthorMail =		"#" + this.id + " fieldset.authors input[name=tab-project-mail]";
	this.authors =	"#" + this.id + " fieldset.authors ul";
	var addButton =	"#" + this.id + " fieldset.authors .add";
	var trash =		"#" + this.id + " fieldset.authors .trash";

	this.addAuthor = function (name, mail) {
		$(this.authors).append(
			$("<li/>").addClass("ui-state-default")
				.append($("<span/>").addClass("name").text(name))
				.append($("<span/>").text(" - "))
				.append($("<span/>").addClass("mail").text(mail))
		);
	};
	
	this.initView = function () {
		$(this.authors)
		.sortable({
			update : function (event, ui) {
				$(this).trigger("izpack.change");
			}
		});
		
		$(addButton).bind("click", {view: this}, function (event) {
			var view = event.data.view;
			$.validity.setup({
				outputMode : "summary"
			});

			$.validity.start();
			$(view.addAuthorName).require();
			$(view.addAuthorMail).require().match("email");

			if (!$.validity.end().valid) {
				return false;
			}

			var nameText = $(view.addAuthorName).val();
			var mailText = $(view.addAuthorMail).val();
			view.addAuthor(nameText, mailText);
			$(view.authors).trigger("izpack.change");
			$(view.addAuthorFields).val("");
			
			return false;
		});
		
		$(trash)
		.droppable({
			accept : this.authors + " li",
			tolerance : 'touch',
			hoverClass : 'trash-active'
		})
		.bind("drop", {view: this}, function (event, ui) {
			$(ui.draggable).remove(); // triggers sortupdate on the list, which triggers the right event
		})
		.click(function () {
			$("<div/>").text("To delete an author, drag/drop it on this trash can !").dialog({title : "Help"});
		});
	};
	
	this.getAuthors = function () {
		var authorsRes = [];
		$(this.authors + " li").each(function () {
			authorsRes.push({
				name : $(".name", $(this)).text(),
				mail : $(".mail", $(this)).text()
			});
		});
		return authorsRes;
	};
	this.setAuthors = function (authors) {
		$("li", this.authors).remove();
		for (var i = 0; i < authors.length; i++) {
			this.addAuthor(authors[i].name, authors[i].mail);
		}
	};

	this.getAppName = function () {
		return $.trim($(this.appname).val());
	};
	this.setAppName = function (name) {
		$(this.appname).val(name);
	};
	
	this.getAppVersion = function () {
		return $.trim($(this.appversion).val());
	};
	this.setAppVersion = function (version) {
		$(this.appversion).val(version);
	};

};

izpack.view.Project.prototype = new izpack.view.GenericView("project");
