"use strict";
/*
* @page index
* @tag home
* # GraouPack
* This is the doc for GraouPack, an Izpack UI in javascript.
*/
steal
.plugins(
  'jquery/controller',            // a widget factory
  'jquery/controller/subscribe',  // subscribe to OpenAjax.hub
  'jquery/view/ejs',              // client side templates
  'jquery/model',                 // Ajax wrappers
  'jquery/model/validations',     // validation
  'jquery/model/associations',    // associations
  'jquery/dom/form_params',       // form data helper
  'graoupack/generators'
)
.resources(
  // no dependency manager built in jquery : manually add them
  'jquery-ui/ui/jquery.ui.core.js',
  'jquery-ui/ui/jquery.ui.widget.js',
  'jquery-ui/ui/jquery.ui.button.js', // <-- dependency
  'jquery-ui/ui/jquery.ui.mouse.js',
  'jquery-ui/ui/jquery.ui.draggable.js', // <-- dependency
  'jquery-ui/ui/jquery.ui.position.js',
  'jquery-ui/ui/jquery.ui.resizable.js',
  'jquery-ui/ui/jquery.ui.dialog.js', // <-- dependency
  'jquery-ui/ui/jquery.ui.tabs.js', // <-- dependency
  'jquery-ui/ui/jquery.ui.droppable.js', // <-- dependency
  'jquery-ui/ui/jquery.ui.sortable.js' // <-- dependency
)
.then('http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js')

.css(
  'resources/jquery-ui/themes/base/jquery.ui.all',
  'graoupack'
)

// loads files in models folder
.models(
  'abstract',
  'locale',
  // 'pack',
  'panel',
  'panels/hello_panel',
  'panels/info_panel',
  'panels/licence_panel',
  'panels/target_panel',
  'panels/packs_panel',
  'panels/install_panel',
  'panels/finish_panel',
  'project',
  'author',
  'whole_project')

  // loads files in controllers folder
  .controllers(
    'main',
    'generate',
    'locale',
    // 'pack',
    'panel',
    'presentation',
    'project')

    .views();            // adds views to be added to build
