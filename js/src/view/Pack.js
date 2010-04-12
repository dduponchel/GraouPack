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

$.Class("izpack.view", "Pack", {
	isa : "GenericView",
	init : function () {
		this._super("pack");
		
		this.defaultConfig		= null;
		
		this.addButton			= "#tab-pack-add-button";
		this.addName			= "#tab-pack-add-name";
		this.template			= "#tab-pack-template";
		this.packsContainer		= "#tab-pack-packs";
		this.packs				= this.packsContainer + " .pack";
		this.configDom			= "#tab-pack-config";
		this.packConfigButton	= this.packsContainer + " .config";
		this.packRemoveButton	= this.packsContainer + " .remove";
	},
	methods : {
		initView : function () {
			
			$(this.addButton)
			.button()
			.bind("click", {view : this}, function (event) {
				var view = event.data.view,
					config,
					$addName = $(view.addName);
				
				$.validity.setup({
					outputMode : "summary"
				});
				
				$.validity.start();
				$addName.require();
				
				if (!$.validity.end().valid) {
					return false;
				}
				
				config = $(view.configDom).data("config.controller").getDefaultConfig();
				config.set("name", $addName.val());
				view.addPack(config);
				$addName.val("");
				
				$(view.packsContainer).trigger("izpack.change");
				return false;
			});

			$(this.packsContainer)
			.delegate(this.packConfigButton, "click", {view : this}, function (event) {
				// click on a config button
				var $configDom		= $(event.data.view.configDom),
					pack			= $(this).parents(".pack"),
					configHandler	= $configDom.data("config.controller");
					
				$configDom.data("targetPack", pack);
				configHandler.setConfig($(pack).data("config"));
				configHandler.showView();
				
				$configDom.dialog("open");
			})
			.delegate(this.packRemoveButton, "click", {view : this}, function (event) {
				$(this).parents(".pack").remove();
				$(event.data.view.packsContainer).trigger("izpack.change");
			})
			.delegate(this.packs, "izpack.packUpdate", {view : this}, function (event) {
				// update the name and trigger the izpack.change
				// this = updated pack
				var $this = $(this);
				
				$this.find("h3").text($this.data("config").get("name"));
				
				$(event.data.view.packsContainer).trigger("izpack.change");
			});
		},
		
		createConfigDialog : function () {
			return $(this.configDom).dialog({
				autoOpen : false,
				modal : true,
				buttons : {
					"save" : function (event) {
						var $this			= $(this),
							targetPack		= $this.data("targetPack"),
							configHandler	= $this.data("config.controller"),
							isValid			= configHandler.validate();
						
						if (!isValid) {
							return false;
						}
						
						configHandler.saveConfig();
						configHandler.setConfig(null);
						$(this).dialog('close');
						$(targetPack).trigger("izpack.packUpdate"); // will trigger izpack.update
					},
					"cancel" : function (event) {
						// nothing more to do, we haven't changed the model.
						$(this)
						.data("targetPack", null)
						.dialog('close');
					}
				},
				close : function () {
					$(this).data("targetPack", null);
				},
				width : 510
			});
		},
		
		addPack : function (config) {
			var pack = $(this.template)
			.clone()
			.removeAttr("id")
			.removeClass("ui-helper-hidden")
			.data("config", config);
			pack.find("h3").text(config.get("name"));
			$(this.packsContainer).append(pack);
		},
		
		getPacks : function () {
			var res = [];
			$(this.packs).each(function () {
				res.push($(this).data("config"));
			});
			return res;
		},
		
		setPacks : function (packs) {
			$(this.packsContainer).empty();
			for (var i = 0; i < packs.length; i++) {
				this.addPack(packs[i]);
			}
		}
	}
});
