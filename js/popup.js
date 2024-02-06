var font_list = [
"Default font",
"맑은고딕",
"굴림",
"돋움",
"Arial",
"Times New Roman"
];

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	var tab = tabs[0];
	var url = tab.url;
  	tab_id = tab.id;


});

function send_to_content(obj, to_frame) {
	to_frame = to_frame || null;
    chrome.tabs.sendMessage(tab_id, obj, to_frame);
}

function font_family() {
	var font = document.getElementById('fontlist').value;
	send_to_content({ "font-family" : font });
}

document.getElementById('sizeup').addEventListener("click", function() { send_to_content({ "button" : "sizeup" }) }, false);
document.getElementById('sizedown').addEventListener("click", function() { send_to_content({ "button" : "sizedown" }) }, false);
document.getElementById('default_size').addEventListener("click", function() { send_to_content({ "button" : "default_size" }) }, false);

document.getElementById('lspaceup').addEventListener("click", function() { send_to_content({ "button" : "lspaceup" }) }, false);
document.getElementById('lspacedown').addEventListener("click", function() { send_to_content({ "button" : "lspacedown" }) }, false);
document.getElementById('default_letterspace').addEventListener("click", function() { send_to_content({ "button" : "default_letterspace" }) }, false);

document.getElementById('fontlist').addEventListener("change", function() { font_family();  }, false);

for (var i = 0; i < font_list.length; i++) {
	var fontlist = document.getElementById("fontlist");
	var opt = document.createElement('option');
    opt.value = font_list[i];
    opt.innerHTML = font_list[i];
    opt.style.fontFamily = font_list[i];
    fontlist.appendChild(opt);
}