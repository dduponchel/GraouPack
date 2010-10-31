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
  'jquery/dom/fixture',           // simulated Ajax requests
  'jquery/dom/form_params')       // form data helper

  .css('graoupack')  // loads styles

  .resources()       // 3rd party script's (like jQueryUI), in resources folder

  // loads files in models folder
  .models(
    'abstract',
    // 'locale',
    // 'pack',
    // 'panel',
    'project',
    'author')

    // loads files in controllers folder
    .controllers(
      'main',
      // 'locale',
      // 'pack',
      // 'panel',
      'presentation',
      'project')

      .views();            // adds views to be added to build
