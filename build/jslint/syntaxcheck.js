globalObjOptions = {
adsafe: false, 		// true if ADsafe.org rules should be enforced
bitwise: false,	 	// true if bitwise operators should not be allowed
browser: true,	 	// true if the standard browser globals should be predefined
cap: false, 		// true if upper case HTML should be allowed
debug: false, 		// true if debugger statements should be allowed
eqeqeq: true, 		// true if === should be required
evil: false, 		// true if eval should be allowed
forin: false, 		// true if unfiltered for in statements should be allowed
fragment: false, 	// true if HTML fragments should be allowed
glovar: true, 		// true if var should not be allowed to declare global variables
indent: 4, 		// the number of spaces used for indentation (default is 4)
laxbreak: false, 	// true if statement breaks should not be checked
nomen: false, 		// true if names should be checked for initial underbars
on: false, 		// true if HTML event handlers should be allowed
passfail: false, 	// true if the scan should stop on first error
plusplus: false, 	// true if ++ and -- should not be allowed
predef: ["Class", "jQuery", "$", "izpack", "izpack.tab", "izpack.generator", "XML", "XMLSerializer", "ActiveXObject", "XPathResult"],	// an array of strings, the names of predefined global variables
regexp: false, 		// true if . should not be allowed in RegExp literals
rhino: false, 		// true if the Rhino environment globals should be predefined
sidebar: false, 	// true if the Windows Sidebar Gadgets globals should be predefined
undef: true, 		// true if undefined global variables are errors
white: true, 		// true if strict whitespace rules apply
widget: false 		// true if the Yahoo Widgets globals should be predefined
};

load("build/jslint/fulljslint.js", "build/jslint/rhino.js");
