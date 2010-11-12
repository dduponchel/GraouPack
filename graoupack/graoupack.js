"use strict";
/*
* @page index
* @tag home
* # GraouPack
* This is the doc for GraouPack, an Izpack UI in javascript.
*/
steal.plugins(
  'jquery/controller',            // a widget factory
  'jquery/controller/subscribe',  // subscribe to OpenAjax.hub
  'jquery/view/ejs',              // client side templates
  'jquery/model',                 // Ajax wrappers
  'jquery/model/validations',     // validation
  'jquery/dom/fixture',           // simulated Ajax requests
  'jquery/dom/form_params',       // form data helper
  'graoupack/generators')

  .css('graoupack')  // loads styles

  .resources('jStorage/jstorage')       // 3rd party script's (like jQueryUI), in resources folder

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
    'author')

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
