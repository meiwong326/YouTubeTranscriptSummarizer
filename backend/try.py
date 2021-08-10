from youtube_transcript_api import YouTubeTranscriptApi
from transformers import T5ForConditionalGeneration, T5Tokenizer, pipeline
import re

def transcript(url):
    t = ""
    try: 
        t = get_transcript(url)
        return summarize(t)
    except Exception:
        return "No Transcript"
        

def get_transcript(video_id):
    transcript_dict =  YouTubeTranscriptApi.get_transcript(video_id)
    transcript = ""
    for i in transcript_dict:
        transcript += i["text"] + " "
    return transcript 


def summarize(transcript):
    # https://www.thepythoncode.com/article/text-summarization-using-huggingface-transformers-python
    
    # initialize the model architecture and weights
    model = T5ForConditionalGeneration.from_pretrained("t5-base")

    # initialize the model tokenizer
    tokenizer = T5Tokenizer.from_pretrained("t5-base")

    # encode the text into tensor of integers 
    inputs = tokenizer.encode(transcript, 
                            return_tensors="pt", 
                            max_length=512, 
                            truncation=True)

    # generate the summarization                        
    outputs = model.generate(inputs, 
                            max_length=150, 
                            min_length=40, 
                            length_penalty=1.0, 
                            num_beams=4, 
                            early_stopping=True)
    decode_outputs = tokenizer.decode(outputs[0])

    # delete words between <> (padding)
    return re.sub(r'<.+?>', '', decode_outputs)



def summarize2(video_id):
    summarization = pipeline("summarization")
    return summarization(get_transcript(video_id))[0]['summary_text']