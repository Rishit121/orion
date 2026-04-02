import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# LangChain and RAG
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

# Import the indexing function
from index_docs import build_vectorstore

# Load environment variables
load_dotenv(dotenv_path="C:\\Users\\siddh\\orion\\.env", override=True)

app = FastAPI(title="Orion API")

# Setup CORS to allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for RAG
qa_chain = None

def init_qa_chain():
    global qa_chain
    try:
        embeddings = AzureOpenAIEmbeddings(
            azure_deployment=os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        )
        if os.path.exists("vectorstore") and os.path.isdir("vectorstore"):
            db = FAISS.load_local("vectorstore", embeddings, allow_dangerous_deserialization=True)
            llm = AzureChatOpenAI(
                azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
                azure_deployment=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT"),
                openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
                api_key=os.getenv("AZURE_OPENAI_API_KEY"),
                temperature=0.2
            )
            memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
            qa_chain = ConversationalRetrievalChain.from_llm(
                llm=llm,
                retriever=db.as_retriever(),
                memory=memory
            )
            print("✅ QA Chain initialized")
        else:
            print("⚠️ No vectorstore found. Please upload a document first.")
    except Exception as e:
        print(f"Error initializing QA chain: {e}")

# Initialize on startup
@app.on_event("startup")
async def startup_event():
    init_qa_chain()

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str
    youtube_url: str | None = None

@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    global qa_chain
    if not qa_chain:
        try:
            init_qa_chain() # Try to initialize if missed
        except Exception:
            pass
            
    if not qa_chain:
        raise HTTPException(status_code=400, detail="Vector store not initialized. Upload a document first.")
    
    # Run user query
    result = qa_chain.invoke({"question": req.query})
    answer = result["answer"]
    
    # Very basic concept extraction prompt for YouTube search
    llm = qa_chain.combine_docs_chain.llm_chain.llm # Extract inner LLM
    try:
        from langchain.schema import HumanMessage
        concept_msg = HumanMessage(content=f"Identify the main single 1-3 word educational concept from this text:\n\n{answer}\n\nReturn EXACTLY the concept string, nothing else.")
        concept_resp = llm.invoke([concept_msg])
        concept = concept_resp.content.strip().replace(" ", "+")
        yt_url = f"https://www.youtube.com/results?search_query={concept}+tutorial"
    except Exception as e:
        yt_url = None
        print(f"Error generating YT url: {e}")

    return ChatResponse(answer=answer, youtube_url=yt_url)
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    docs_dir = "docs"
    os.makedirs(docs_dir, exist_ok=True)
    file_location = os.path.join(docs_dir, file.filename)
    
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
        
    print(f"File saved to {file_location}")
    print("Rebuilding vectorstore...")
    build_vectorstore()
    init_qa_chain() # Re-initialize the chain after upload
    return {"info": f"file '{file.filename}' saved and indexed successfully"}

@app.post("/api/quiz")
async def generate_quiz():
    global qa_chain
    if not qa_chain:
        raise HTTPException(status_code=400, detail="Vector store not initialized. Upload a document first.")
    
    # fetch top docs from retriever based on a general dummy query to get context
    docs = qa_chain.retriever.invoke("summary of core concepts")
    context = "\n\n".join([d.page_content for d in docs])
    
    prompt = f"""
    Based on the following context, generate a 3-question multiple choice quiz.
    Format your response EXACTLY as a valid JSON array of objects, with each object having 'question', 'options' (array of 4 strings), and 'correct_answer' (one of the strings matching an option exactly). No markdown formatting or code blocks around the JSON. Just pure JSON.
    Context:
    {context}
    """
    try:
        from langchain.schema import HumanMessage
        llm = qa_chain.combine_docs_chain.llm_chain.llm
        quiz_resp = llm.invoke([HumanMessage(content=prompt)])
        
        # Parse JSON
        import json
        import re
        content = quiz_resp.content
        match = re.search(r'\[.*\]', content, re.DOTALL)
        if match:
            json_str = match.group(0)
            quiz_data = json.loads(json_str)
            return {"quiz": quiz_data}
        else:
            # Fallback parsing
            quiz_data = json.loads(content)
            return {"quiz": quiz_data}
    except Exception as e:
        print(f"Quiz Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate quiz")

@app.post("/api/mindmap")
async def generate_mindmap(req: ChatRequest):
    global qa_chain
    if not qa_chain:
        raise HTTPException(status_code=400, detail="Vector store not initialized.")
        
    docs = qa_chain.retriever.invoke(req.query)
    context = "\n\n".join([d.page_content for d in docs])
    
    prompt = f"""
    Create a Mermaid.js flowchart (graph TD) representing the relationships between the concepts in the following text related to "{req.query}".
    Return ONLY the mermaid code block, starting with 'graph TD'. No markdown formatting.
    Context:
    {context}
    """
    try:
        from langchain.schema import HumanMessage
        llm = qa_chain.combine_docs_chain.llm_chain.llm
        mm_resp = llm.invoke([HumanMessage(content=prompt)])
        mm_code = mm_resp.content.replace("```mermaid", "").replace("```", "").strip()
        return {"mermaid_code": mm_code}
    except Exception as e:
        print(f"Mindmap Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate mindmap")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
