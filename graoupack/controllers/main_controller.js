/*global confirm: true */

/**
 * @tag controllers, home
 */
$.Controller.extend('Graoupack.Controllers.Main',
/* @Static */
{
  onDocument: true,
  tabs : {
    'Presentation'  : 'presentation',
    'Project'       : 'my application',
    'Locale'        : 'locales',
    'Panel'         : 'panels',
    'Pack'          : 'packs'
  }
},
/* @Prototype */
{
  init: function () {
    if(!$("#GraouPack").length){
      $(document.body).append($('<div/>').attr('id','GraouPack'));
      $('#GraouPack').html(this.view('init', {tabs : this.Class.tabs} ));
    }
  },
  load: function(){
    $("#GraouPack").tabs();
  }
});
