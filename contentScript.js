
// listen for message from pop.js to generate a summary 
chrome.runtime.onMessage.addListener(generateSummary);


// generates a summarized transcript
function generateSummary(request, sender, sendResponse) {
    console.log(request)

    if (request.msg == "generate") {

        console.log("got generate!")

        // get the video_id using regular expression 
        let url = request.url
        let regexp = /=(.*)/
        let video_id = url.match(regexp)[1]
        
        // send a http request
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://127.0.0.1:5000/api/summarize_youtube/url=" + video_id)
        xhr.send()

        // after summary is received, send it to popup.js
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {

                let message = {
                    type: "summary", 
                    summary: xhr.responseText
                }

                chrome.runtime.sendMessage(message)

                console.log(message)
            }
        }
    }
} 