import streamlit as st
import os
from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

# Load .env
load_dotenv(dotenv_path="C:\\Users\\siddh\\orion\\.env", override=True)

# Page config
st.set_page_config(page_title="StudySphere AI", page_icon="📚")

st.title("Orion AI — Your Personal Study Assistant")

@st.cache_resource
def load_qa_chain():

  # embeddings + vectorstore
    embeddings = AzureOpenAIEmbeddings(
        azure_deployment=os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    )

    db = FAISS.load_local("vectorstore", embeddings, allow_dangerous_deserialization=True)

    # LLM
    llm = AzureChatOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        azure_deployment=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT"),
        openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        temperature=0
    )

    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

    return ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=db.as_retriever(),
        memory=memory
    )

qa_chain = load_qa_chain()

# Chat UI
if "history" not in st.session_state:
    st.session_state["history"] = []

user_input = st.chat_input("Ask something from your notes...")

if user_input:
    with st.spinner("Thinking..."):
        result = qa_chain.invoke({"question": user_input})
        answer = result["answer"]

        st.session_state["history"].append(("user", user_input))
        st.session_state["history"].append(("ai", answer))

# Display chat
for role, msg in st.session_state["history"]:
    if role == "user":
        st.chat_message("user").markdown(msg)
    else:
        st.chat_message("assistant").markdown(msg)
