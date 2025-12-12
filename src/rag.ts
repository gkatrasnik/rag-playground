import { Ollama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { CHROMA_URL, OLLAMA_URL } from "./config";

export class RAGApplication {
  private vectorStore: Chroma | null = null;
  private llm: Ollama;
  private embeddings: OllamaEmbeddings;

  constructor() {
    this.llm = new Ollama({
      model: "gemma3:1b",
      temperature: 0.5,
      baseUrl: OLLAMA_URL,
    });

    this.embeddings = new OllamaEmbeddings({
      model: "nomic-embed-text",
      baseUrl: OLLAMA_URL,
    });
  }

  async init() {
    this.vectorStore = await Chroma.fromExistingCollection(this.embeddings, {
      collectionName: "rag-test-collection",
      url: CHROMA_URL,
    }).catch(async () => {
      // If the collection does not exist, it will be created when documents are added.
      return new Chroma(this.embeddings, {
        collectionName: "rag-test-collection",
        url: CHROMA_URL,
      });
    });
  }

  async addDocuments(documents: Document[], ids?: string[]) {
    if (!this.vectorStore) {
      await this.init();
    }
    if (this.vectorStore) {
      await this.vectorStore.addDocuments(documents, { ids });
    }
  }

  async query(question: string) {
    if (!this.vectorStore) {
      await this.init();
    }

    if (!this.vectorStore) {
      throw new Error("Failed to initialize vector store");
    }

    const retriever = this.vectorStore.asRetriever();

//     const template = `Answer the question based only on the following context:
// {context}

// Question: {question}
// `;
const template = `You are a helpful assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer from the context provided, just say that you don't know, don't try to make up an answer.
Provide a conversational and well-formatted answer.

Context: {context}

Question: {question}

Helpful Answer:`;
    const prompt = ChatPromptTemplate.fromTemplate(template);

    const chain = RunnableSequence.from([
      {
        context: retriever.pipe((docs) => {
          return docs.map((d) => d.pageContent).join("\n");
        }),
        question: new RunnablePassthrough(),
      },
      prompt,
      this.llm,
      new StringOutputParser(),
    ]);

    const result = await chain.invoke(question);
    return result;
  }
}
