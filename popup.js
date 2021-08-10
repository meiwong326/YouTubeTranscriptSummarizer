
let summary = document.getElementById('summary')
let innerheader = document.getElementById("innerheader")

// listen for a summarized transcript from contentScript.js and then display it in popup.html
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    console.log(request)

    if (request.type == "summary") {
        innerheader.textContent = "Summarized Transcript:"
        summary.style.backgroundImage = "none"
        summary.style.backgroundSize = "contain"
        summary.style.backgroundColor = "white"
        summary.style.fontSize = "14px"
        summary.textContent = "\n" + request.summary 
    }
})


// listen for summarize button to be clicked 
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("summarizeButton").addEventListener('click', sendGenerate)
});


// send message to contentScript.js after summarized button is clicked
function sendGenerate() {
    console.log("clicked!")

    innerheader.textContent = "Processing..."
    document.getElementById("image").src = "/images/buffering2.gif"

    let params = {
        active: true,
        currentWindow: true
    }

    chrome.tabs.query(params, gotTabs); 

    let message = {
        msg: "generate",
    }

    function gotTabs(tabs) {
        message.url = tabs[0].url
        chrome.tabs.sendMessage(tabs[0].id, message)
    }

}
