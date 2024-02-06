var font_times = 1;
var letter_space = 1;
var word_space = 1;

var total_elements = {
	"save_defaults" : 0,
	"font-size" : 0,
	"letter-spacing" : 0,
	"word-spacing" : 0,
	"font-family" : 0,
}
var font_options = { 
	"font-size" : null,
	"letter-spacing" : null,
	"word-spacing" : null,
	"font-family" : null,
};	

function isOnScreen(el)
{
	/*var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	var scrollBottom = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) + scrollTop;
	var scrollRight = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) + scrollLeft;*/
	
	// Don't return elements that are fixed position
	var el2 = el;
	while (typeof el2 === 'object' && !el2.nodeName.match(/^(body|#document)$/i)) {
        if (document.defaultView.getComputedStyle(el2,null).getPropertyValue('position').toLowerCase() === 'fixed') return false;
        el2 = el2.parentNode;
    }
	
	/* New way: el.getBoundingClientRect always returns 
		left, top, right, bottom of
		an element relative to the current screen viewport */ 
	var rect = el.getBoundingClientRect();
	if (rect.top >= 1 && rect.left >= 1 && 
		rect.bottom <= window.innerHeight && rect.right <= window.innerWidth) // 3/24/2018 - Changed to window.innerHeight and window.innerWidth
		return el;
	else 
		return false;
}

function send_to_background(obj)
{	
	chrome.runtime.sendMessage(obj, function(response) {
		if (test_mode == 1) console.log(response.farewell);
	});
}

function save_defaults(opt) {
	var options = ["font-size", "letter-spacing", "word-spacing" ,"font-family"]; // Version 1.3.7
	var onScreenEl = false;
	var elems = document.getElementsByTagName("*");
	var elems_length = elems.length;

	for (var i=0; i<elems_length; i++)
	for (var j=0; j<options.length; j++) // Version 1.3.7
	{
		var el = elems[i];
		var option = options[j];
		
		if (el.getAttribute('data-default-'+ option)) {
			var default_value = el.getAttribute('data-default-'+ option);
		}
		else {
			var default_value = document.defaultView.getComputedStyle(el,null).getPropertyValue(option);
			el.setAttribute('data-default-'+ option, default_value);
		}
	} 
	total_elements['save_defaults'] = elems_length;
	return (onScreenEl);
}

function change_fontsize(direction) {
	var onScreenEl = false;
	
	if (direction == "up") {
		font_times = Math.round((font_times + 0.1) * 10) / 10;
	}
	else if (direction == "down") {	
		if  (font_times > 0.2)  {
			font_times = Math.round((font_times - 0.1) * 10) / 10;
		}
		else return;
	}
	else if (direction == "default")
		font_times = 1;

	var elems = document.getElementsByTagName("*");
	var elems_length = elems.length;
		total_elements['font-size'] = elems.length;
		onScreenEl = save_defaults("font-size");

	for (var i=0; i<elems_length; i++) {
		var el = elems[i];
		if (el.getAttribute('data-default-font-size')) {
			var default_fontsize = parseFloat(el.getAttribute('data-default-font-size'));
		}
		else {
			var default_fontsize = parseFloat(document.defaultView.getComputedStyle(el,null).getPropertyValue("font-size"));
			el.setAttribute('data-default-font-size', default_fontsize);
		}
		var new_fontsize = Math.round(default_fontsize * font_times);
		var old_fontsize = Math.round(parseFloat(document.defaultView.getComputedStyle(el,null).getPropertyValue("font-size")));
		if (new_fontsize != old_fontsize) {
			if (!el.isContentEditable || (el.parentNode && !el.parentNode.isContentEditable)) {	
				el.style.setProperty("font-size", Math.round(default_fontsize * font_times) + "px", "important"); 
			}
		}
	}
}

function change_letterspace(direction) {
	var onScreenEl = false;
	
	if (direction == "up") {
		letter_space += 4;
	}
	else if (direction == "down") {	
		if  (letter_space > 1)  { 
			letter_space -= 4;
		}
		else return;
	}
	else if (direction == "default")
		letter_space = 1;

	var elems = document.getElementsByTagName("*");
	var elems_length = elems.length;
		total_elements['letter-spacing'] = elems.length;
		onScreenEl = save_defaults("letter-spacing");

	for (var i=0; i<elems_length; i++) {
		var el = elems[i];
		if (el.getAttribute('data-default-letter-spacing')) {
			var default_letterspace = parseFloat(el.getAttribute('data-default-letter-spacing'));
		}
		else {
			var default_letterspace = parseFloat(document.defaultView.getComputedStyle(el,null).getPropertyValue("letter-spacing"));
			el.setAttribute('data-default-letter-spacing', default_letterspace);
		}
		var new_letterspace = Math.round(default_letterspace * letter_space);
		var old_letterspace = Math.round(parseFloat(document.defaultView.getComputedStyle(el,null).getPropertyValue("letter-spacing")));
		if (new_letterspace != old_letterspace) {
			if (!el.isContentEditable || (el.parentNode && !el.parentNode.isContentEditable)) {	
				el.style.setProperty("letter-spacing", Math.round(default_letterspace * letter_space) + "px", "important"); 
			}
		}
	}
}

function change_fontfamily(value) {
	var elems = document.getElementsByTagName("*");
	var elems_length = elems.length;
	for (var i=0; i<elems_length; i++)
	{
		var el = elems[i];
		if (el.getAttribute('data-default-font-family')) {
			var default_fontfamily = el.getAttribute('data-default-font-family');
		}
		else {
			var default_fontfamily = document.defaultView.getComputedStyle(el,null).getPropertyValue("font-family");
			el.setAttribute('data-default-font-family', default_fontfamily);
		}
		var current_value = document.defaultView.getComputedStyle(el,null).getPropertyValue("font-family"); 
		
		if (current_value != value) {
			if (value == null || value.indexOf("Default") != -1)
			{
				el.style.setProperty("font-family", default_fontfamily, "important"); // last option is priority. Set to null if no priority
			}
			else
				el.style.setProperty("font-family", value, "important");
		}
	}
}

chrome.runtime.onMessage.addListener(
	function(obj, sender, sendResponse) {
    	if (obj.hasOwnProperty("button")) {
    		if (obj["button"] == "sizeup") change_fontsize("up");
    		else if (obj["button"] == "sizedown") change_fontsize("down");
    		else if (obj["button"] == "default_size") change_fontsize("default");	

			else if (obj["button"] == "lspaceup") change_letterspace("up");	
			else if (obj["button"] == "lspacedown") change_letterspace("down");	
			else if (obj["button"] == "default_letterspace") change_letterspace("default");

			else if (obj["button"] == "wspaceup") change_wordspace("up");	
			else if (obj["button"] == "wspacedown") change_wordspace("down");	
			else if (obj["button"] == "default_wordspace") change_wordspace("default");
    	}
    	if (obj.hasOwnProperty("font-family") && obj["font-family"] != null) {
    		change_fontfamily(obj["font-family"]);
    	}
  });