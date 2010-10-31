//js graoupack/scripts/doc.js
"use strict";

load('steal/rhino/steal.js');
steal.plugins("documentjs").then(function(){
	DocumentJS('graoupack/graoupack.html');
});
