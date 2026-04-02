# index_docs.py — Azure OpenAI version (final)
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="C:\\Users\\siddh\\orion\\.env", override=True)

# LangChain imports
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import AzureOpenAIEmbeddings
from langchain_community.vectorstores import FAISS

def build_vectorstore():
    docs_folder = "docs"
    docs = []
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

    for fn in os.listdir(docs_folder):
        if fn.lower().endswith(".pdf"):
            print(f"📄 Loading {fn}...")
            loader = PyPDFLoader(os.path.join(docs_folder, fn))
            docs.extend(loader.load())

    chunks = splitter.split_documents(docs)
    print(f"✅ Split into {len(chunks)} chunks")

    # Azure Embeddings (make sure your env file is correct)
    embeddings = AzureOpenAIEmbeddings(
        azure_deployment=os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT"),
        openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    )

    db = FAISS.from_documents(chunks, embeddings)
    db.save_local("vectorstore")

    print("✅ Vectorstore created successfully and saved to ./vectorstore/")

if __name__ == "__main__":
    build_vectorstore()
