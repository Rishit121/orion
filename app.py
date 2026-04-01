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
