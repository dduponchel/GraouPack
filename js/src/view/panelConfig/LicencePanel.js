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
 
$.namespace("izpack.view.panelConfig");

izpack.view.panelConfig.LicencePanel = function (domView) {
	izpack.view.panelConfig.GenericPanel.apply(this, [ "LicencePanelConfig", domView ]);
	
	this.fileSrc = "#tab-panel-config-licence-file-src";
	this.useHTML = "#tab-panel-config-licence-file-html";
};

izpack.view.panelConfig.LicencePanel.prototype = $.extend({}, izpack.view.panelConfig.GenericPanel.prototype, {
	initView : function () {
	},

	setFileSrc : function (src) {
		$(this.fileSrc).val(src);
	},
	
	getFileSrc : function () {
		return $(this.fileSrc).val();
	},
	
	setUseHTML : function (useHTML) {
		$(this.useHTML)[0].checked = useHTML;
		if (useHTML) {
			$(".hideMe", this.domView).show();
		} else {
			$(".hideMe", this.domView).hide();
		}
	},
	
	getUseHTML : function () {
		return $(this.useHTML)[0].checked;
	}
});
