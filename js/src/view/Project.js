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
	
	var appname = "#" + this.id + " input[name=tab-project-appname]";
	var appversion = "#" + this.id + " input[name=tab-project-appversion]";
	
	var fields =	"#" + this.id + " fieldset.authors input";
	var name =		"#" + this.id + " fieldset.authors input[name=tab-project-name]";
	var mail =		"#" + this.id + " fieldset.authors input[name=tab-project-mail]";
	var authors =	"#" + this.id + " fieldset.authors ul";
	var addButton =	"#" + this.id + " fieldset.authors .add";
	var trash =		"#" + this.id + " fieldset.authors .trash";

	this.initView = function () {
		$(authors).sortable();
		$(addButton).click(function () {

			$.validity.setup({
				outputMode : "summary"
			});

			$.validity.start();
			$(name).require();
			$(mail).require().match("email");

			if (!$.validity.end().valid) {
				return false;
			}

			var nameText = $(name).val();
			var mailText = $(mail).val();
			$(authors).append(
				$("<li/>").addClass("ui-state-default")
					.append($("<span/>").addClass("name").text(nameText))
					.append($("<span/>").text(" - "))
					.append($("<span/>").addClass("mail").text(mailText))
			);
			$(fields).val("");
			
			return false;
		});
		
		$(trash)
		.droppable({
			accept : authors + " li",
			tolerance : 'touch',
			hoverClass : 'trash-active',
			drop : function (event, ui) {
				$(ui.draggable).remove();
			}
		})
		.click(function () {
			$("<div/>").text("To delete an author, drag/drop it on this trash can !").dialog({title : "Help"});
		});
	};
	
	this.getAuthors = function () {
		var authorsRes = [];
		$(authors + " li").each(function () {
			authorsRes.push({
				name : $(".name", $(this)).text(),
				mail : $(".mail", $(this)).text()
			});
		});
		return authorsRes;
	};

	this.validate = function () {
		if (!this.viewLoaded) {
			return false;
		}
		
		$.validity.setup({
			outputMode : "summary"
		});

		$.validity.start();

		// only appname / appversion are required
		$(appname).require();
		$(appversion).require();
		
		var result = $.validity.end();
		return result.valid;

	};
	
	this.getAppName = function () {
		return $.trim($(appname).val());
	};
	
	this.getAppVersion = function () {
		return $.trim($(appversion).val());
	};

};

izpack.view.Project.prototype = new izpack.view.GenericView("project");
