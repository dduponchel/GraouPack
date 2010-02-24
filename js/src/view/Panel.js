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

izpack.view.Panel = function () {

	var availablePanels =	"#" + this.id + " #tab-panel-available div.available-panel";
	var addButtons =	"#" + this.id + " #tab-panel-available .action .add";
	var infoButtons =	"#" + this.id + " #tab-panel-available .action .info";
	var infoDiv =		"#tab-panel-info-dialog"; // special case, outside the tab
	
	var infoDialog = $("<div/>").append('<div id="tab-panel-info-dialog"/>').dialog({
		autoOpen : false,
		width : 510
	});
	
	this.initView = function () {
		$(infoButtons).click(function () {
			var panel = $(this).parents(".available-panel");
			$(infoDiv).html($(".detail", panel).html());
			infoDialog.dialog('option', 'title', $(".summary h3", panel).text())
			.dialog("open");
		});
	};

	this.validate = function () {
		if (!this.viewLoaded) {
			return false;
		}
		return true;
	};
};
izpack.view.Panel.prototype = new izpack.view.GenericView("panel");
