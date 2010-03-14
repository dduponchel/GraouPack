// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

// modified version from svg-edit http://code.google.com/p/svg-edit/

(function($) {
$.base64 = {};
/**
 * Encode in base64 an array of bytes.
 */
$.base64.encode = function (input) {
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = new Array( Math.floor( (input.length + 2) / 3 ) * 4 );
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0, p = 0;

		do {
				chr1 = input[i++];
				chr2 = input[i++];
				chr3 = input[i++];

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
						enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
						enc4 = 64;
				}

				output[p++] = keyStr.charAt(enc1);
				output[p++] = keyStr.charAt(enc2);
				output[p++] = keyStr.charAt(enc3);
				output[p++] = keyStr.charAt(enc4);
		} while (i < input.length);

		return output.join('');

};

})(jQuery);
