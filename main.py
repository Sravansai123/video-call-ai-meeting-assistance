import os
import tempfile
import uuid
from datetime import datetime
from typing import Optional, List

import openai
import whisper
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Video Meeting AI Assistant", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
openai.api_key = os.getenv("OPENAI_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not all([openai.api_key, supabase_url, supabase_key]):
    raise ValueError("Missing required environment variables")

supabase: Client = create_client(supabase_url, supabase_key)

# Load Whisper model
whisper_model = whisper.load_model("base")

# Pydantic models
class QuestionRequest(BaseModel):
    question: str
    session_id: str

class SummaryRequest(BaseModel):
    session_id: str
    duration: str

class ConversationResponse(BaseModel):
    id: str
    question: str
    answer: str
    source: str
    timestamp: datetime

@app.get("/")
async def root():
    return {"message": "Video Meeting AI Assistant API"}

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    """
    Process a question - first check dataset, then fallback to LLM
    """
    try:
        # First, search in FAQ dataset
        faq_result = supabase.table('faq').select('*').ilike('question', f'%{request.question}%').limit(1).execute()
        
        if faq_result.data:
            # Found in dataset
            answer = faq_result.data[0]['answer']
            source = 'dataset'
        else:
            # Fallback to LLM
            answer = await generate_llm_response(request.question)
            source = 'llm'
        
        # Save conversation
        conversation_data = {
            'session_id': request.session_id,
            'question': request.question,
            'answer': answer,
            'source': source
        }
        
        supabase.table('conversations').insert(conversation_data).execute()
        
        return {
            "answer": answer,
            "source": source
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@app.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    session_id: str = Form(...)
):
    """
    Transcribe audio using Whisper
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await audio.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Transcribe using Whisper
        result = whisper_model.transcribe(temp_file_path)
        transcribed_text = result["text"].strip()
        
        # Clean up temp file
        os.unlink(temp_file_path)
        
        return {
            "text": transcribed_text,
            "confidence": result.get("confidence", 0.0)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error transcribing audio: {str(e)}")

@app.post("/summary")
async def generate_summary(request: SummaryRequest):
    """
    Generate meeting summary using conversation history
    """
    try:
        # Get conversation history
        conversations = supabase.table('conversations').select('*').eq('session_id', request.session_id).order('created_at').execute()
        
        if not conversations.data:
            return {"summary": "No conversations found for this session."}
        
        # Prepare conversation text for summary
        conversation_text = ""
        for conv in conversations.data:
            conversation_text += f"Q: {conv['question']}\nA: {conv['answer']}\n\n"
        
        # Generate summary using GPT
        summary_prompt = f"""
        Please create a professional meeting summary based on the following Q&A exchanges during a video call with an AI assistant.

        Duration: {request.duration}
        
        Conversation History:
        {conversation_text}
        
        Please provide:
        1. A brief overview of the meeting
        2. Key topics discussed
        3. Main questions and insights
        4. A friendly closing note
        
        Keep it professional but warm, as if written by a human assistant.
        """
        
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional meeting assistant creating summaries."},
                {"role": "user", "content": summary_prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        summary = response.choices[0].message.content
        
        # Save summary to database
        summary_data = {
            'session_id': request.session_id,
            'summary': summary,
            'total_messages': len(conversations.data),
            'duration': request.duration,
            'key_topics': extract_key_topics(conversations.data)
        }
        
        supabase.table('meeting_summaries').insert(summary_data).execute()
        
        return {"summary": summary}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

async def generate_llm_response(question: str) -> str:
    """
    Generate response using OpenAI GPT
    """
    try:
        system_prompt = """
        You are a professional AI assistant helping users during live video calls.
        
        Guidelines:
        - Provide clear, concise answers in bullet points when appropriate
        - Be friendly but professional
        - Include code examples when relevant (use proper markdown formatting)
        - Keep responses helpful and actionable
        - Use emojis occasionally (✅, 🔹, 🧠) for clarity
        - Format technical content clearly
        
        Always prioritize clarity and usefulness in your responses.
        """
        
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        return f"I apologize, but I encountered an error processing your request: {str(e)}"

def extract_key_topics(conversations: List[dict]) -> List[str]:
    """
    Extract key topics from conversation history
    """
    topics = set()
    
    for conv in conversations:
        question = conv['question'].lower()
        
        if any(keyword in question for keyword in ['code', 'programming', 'function', 'api']):
            topics.add('Programming & Development')
        if any(keyword in question for keyword in ['meeting', 'presentation', 'demo']):
            topics.add('Meeting Management')
        if any(keyword in question for keyword in ['project', 'team', 'workflow']):
            topics.add('Project Management')
        if any(keyword in question for keyword in ['database', 'sql', 'data']):
            topics.add('Database & Data')
        if any(keyword in question for keyword in ['explain', 'how', 'what', 'why']):
            topics.add('Explanations & Learning')
    
    return list(topics)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
