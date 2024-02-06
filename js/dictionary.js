chrome.tabs.executeScript({
    code: `document.getSelection().toString()`
}, (result) => {
    const origin = result[0]

    document.getElementById('korea_dict').addEventListener("click", function(e) {
        window.open("https://ko.dict.naver.com/#/search?query="+result[0], "", "fullscreen=yes");
    });

    document.getElementById('english_dict').addEventListener("click", function(e) {
        window.open("https://en.dict.naver.com/#/search?query="+result[0], "", "fullscreen=yes");
    });
})



