# Orion:

Orion is a Retrieval-Augmented Generation (RAG) system designed to process, index, and intelligently query large documents such as textbooks, research papers, and multi-hundred-page PDFs. The system transforms static text into an interactive, context-aware conversational interface capable of producing grounded, document-based answers.

Built using Azure OpenAI, LangChain, Python, and FAISS, Orion demonstrates a complete end-to-end RAG pipeline suitable for search, study assistance, research support, or knowledge extraction tasks.

Features:
Conversational question answering with context memory
Capable of handling large PDFs (800+ pages) efficiently
Semantic search powered by Azure OpenAI embeddings
FAISS vector store for fast similarity search
Modular agent architecture to support extension and customization
Local document processing to preserve data privacy
Full RAG pipeline including document loading, chunking, embeddings, vector indexing, and retrieval.
