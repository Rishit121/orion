# Orion
Orion is a Retrieval-Augmented Generation (RAG) system designed to process, index, and intelligently query large documents such as textbooks, research papers, and multi-hundred-page PDFs. The system transforms static text into an interactive, context-aware conversational interface capable of producing grounded, document-based answers.

Built using Azure OpenAI, LangChain, Python, and FAISS, Orion demonstrates a complete end-to-end RAG pipeline suitable for search, study assistance, research support, or knowledge extraction tasks.

# Features:
1. Conversational question answering with context memory
2. Capable of handling large PDFs (800+ pages) efficiently
3. Semantic search powered by Azure OpenAI embeddings
4. FAISS vector store for fast similarity search
5. Modular agent architecture to support extension and customization
6. Local document processing to preserve data privacy
7. Full RAG pipeline including document loading, chunking, embeddings, vector indexing, and retrieval.


#Tech Stack
# Tech Stack

-Languages
1. Python

-AI & Retrieval
1. Azure OpenAI (GPT-4o, text-embedding-ada-002)
2. LangChain
3. FAISS

-Document Processing
1. PyPDF
2. Recursive Character Text Splitter

-Architecture
1. Retrieval-Augmented Generation (RAG)
2. Conversational memory
3. Vector-based retrieval

# Project Structure

orion/
│── agent.py                # Conversational RAG agent
│── index_docs.py           # Document loader, splitter, and vectorstore generator
│── requirements.txt        # Project dependencies
│── .env                    # Environment variables (excluded from Git)
│── vectorstore/            # FAISS index (excluded from Git)
│── docs/                   # PDFs or study material (excluded from Git)

# How Orion Works

1. Document Ingestion- index_docs.py loads all PDFs from the docs/ directory.Each document is parsed and prepared for chunking.

2. Text Chunking- Using the Recursive Character Text Splitter from LangChain, Orion divides text into overlapping segments to preserve semantic continuity.

3. Embedding Generation- Each chunk is embedded using Azure OpenAI’s embedding model. These embeddings form the basis for semantic retrieval.

4. Vector Indexing- FAISS stores and indexes the generated embeddings, enabling efficient nearest-neighbor search across thousands of chunks.

5. Retrieval and Reasoning- agent.py combines:  Retrieval using FAISS, LLM reasoning using Azure GPT-4o Mini, Conversation memory to produce answers grounded in the user’s documents.

6. Interactive Querying- The agent responds to questions with context-aware, citation-relevant answers based entirely on the embedded text.

# Setup Instructions 

1. Clone the repository
2. Create a virtual environment

python -m venv venv
venv\Scripts\activate

3. Install dependencies

pip install -r requirements.txt

4. Configure environment variables

Create a .env file in the project root using the following template:

AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_ENDPOINT=your_endpoint
AZURE_OPENAI_CHAT_DEPLOYMENT=your_chat_model
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=your_embedding_model

5. Add documents
Place your PDFs inside: docs/

6. Build the vector store

python index_docs.py

7. Run the agent

python agent.py


# Core Concepts

1. Retrieval-Augmented Generation: Orion follows a retrieval-first architecture, ensuring answers are grounded in the provided documents rather than relying solely on generative output.
2. Chunking Strategy: Overlapping, semantically coherent chunks improve both retrieval accuracy and the completeness of the model’s responses.
3. Vector Search: FAISS enables fast similarity search across embeddings, even for large document sets.
4. Modular Design: Embeddings, LLMs, retrievers, and memory components are separated, allowing experimentation and upgrades without redesigning the entire system



