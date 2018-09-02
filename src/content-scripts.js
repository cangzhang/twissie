const code = document.querySelector('#oauth_pin > p > kbd > code').innerText

chrome.runtime.sendMessage({ code }, function (response) {
    console.log(response);
});
