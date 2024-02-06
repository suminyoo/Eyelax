var voices = [];
var speed = 0.9;
var myTimeout;

function setVoiceList() {
    voices = window.speechSynthesis.getVoices();
}

function myTimer() {
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
    myTimeout = setTimeout(myTimer, 10000);
}

setVoiceList();

if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = setVoiceList;
}

function speech(txt) {
    if(!window.speechSynthesis) {
        alert("음성 재생을 지원하지 않는 브라우저입니다. 크롬, 파이어폭스 등의 최신 브라우저를 이용하세요");
        return;
    }
    var lang = 'ko-KR';

    window.speechSynthesis.cancel();
    myTimeout=setTimeout(myTimer,10000);
    var utterThis = new SpeechSynthesisUtterance(txt);

    var voiceFound = false;
    for(var i = 0; i < voices.length ; i++) {
        if(voices[i].lang.indexOf(lang) >= 0 || voices[i].lang.indexOf(lang.replace('-', '_')) >= 0) {
            utterThis.voice = voices[i];
            voiceFound = true;
        }
    }

    if(!voiceFound) {
        alert('voice not found');
        return;
    }

    utterThis.lang = lang;
    utterThis.pitch = 1;
    utterThis.rate = 0.9;
    utterThis.onend = function(){clearTimeout(myTimeout);}

    speechSynthesis.speak(utterThis);
}

chrome.tabs.executeScript({
    code: `document.getSelection().toString()`
}, (result) => {
    const origin = result[0]

    document.getElementById('say').addEventListener("click", function(e) {
        speech(result[0]);
    });
    document.getElementById('stop').addEventListener('click', function() {
        window.speechSynthesis.cancel();
    });
    document.getElementById('pause').addEventListener('click', function() {
        window.speechSynthesis.pause();
    });
    document.getElementById('resume').addEventListener('click', function() {
        window.speechSynthesis.resume();
    });

    //speed 조절
    /* document.getElementById('speedUp').addEventListener("click", function(e) {
        speed=Number(speed)+0.1;
        document.getElementById("speedNum").innerText = speed.toFixed(1);
    });
    document.getElementById('speedDown').addEventListener("click", function(e) {
        speed=Number(speed)-0.1;
        document.getElementById("speedNum").innerText = speed.toFixed(1);
    });
    document.getElementById("speedNum").innerText = speed; */
})




