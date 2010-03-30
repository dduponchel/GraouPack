globalObjOptions = {
    adsafe     : false, // true if ADsafe should be enforced
    bitwise    : true,  // true if bitwise operators should not be allowed
    browser    : true,  // true if the standard browser globals should be predefined
    cap        : false, // true if upper case HTML should be allowed
    css        : false, // true if CSS workarounds should be tolerated
    debug      : false, // true if debugger statements should be allowed
    devel      : true,  // true if logging should be allowed (console, alert, etc.)
    eqeqeq     : true,  // true if === should be required
    evil       : false, // true if eval should be allowed
    forin      : true,  // true if for in statements must filter
    fragment   : false, // true if HTML fragments should be allowed
    immed      : true,  // true if immediate invocations must be wrapped in parens
    indent     : 4,     // the number of spaces used for indentation (default is 4)
    laxbreak   : false, // true if line breaks should not be checked
	maxerr     : 50,    // The maximum number of warnings reported (default is 50)
//    maxlen     : 120,   // The maximum number of characters in a line
    nomen      : false, // true if names should be checked for initial or trailing underbars
    newcap     : true,  // true if constructor names must be capitalized
    on         : false, // true if HTML event handlers should be allowed
    onevar     : false, // true if only one var statement per function should be allowed
    passfail   : false, // true if the scan should stop on first error
    plusplus   : false, // true if increment/decrement should not be allowed
    predef     : ["window", "Class", "jQuery", "$", "izpack" ], // an array of strings, the names of predefined global variables
    regexp     : false, // true if . and [^...]  should not be allowed in RegExp literals. These forms should not be used when validating in secure applications.
    rhino      : false, // true if the Rhino environment globals should be predefined
    safe       : false, // true if the safe subset rules are enforced. These rules are used by ADsafe. It enforces the safe subset rules but not the widget structure rules.
    strict     : true,  // true if require the "use strict"; pragma
    sub        : false, // true if subscript notation may be used for expressions better expressed in dot notation.
    undef      : true,  // true if variables should be declared before used
    windows    : false, // true if MS Windows-specigic globals should be predefined
    white      : true,  // true if strict whitespace rules apply
    widget     : false  // true if the Yahoo Widgets globals should be predefined

};

load("build/jslint/fulljslint.js", "build/jslint/rhino.js");
