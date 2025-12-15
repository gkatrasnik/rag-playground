import { Injectable } from '@nestjs/common';
import { Ollama } from '@langchain/ollama';
import { OllamaEmbeddings } from '@langchain/ollama';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { Document } from '@langchain/core/documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  RunnableSequence,
  RunnablePassthrough,
  RunnableLambda
} from '@langchain/core/runnables';
import { ChromaClient } from 'chromadb';
import { CHROMA_URL, OLLAMA_URL } from '../config';

@Injectable()
export class RagService {
  private llm: Ollama;
  private embeddings: OllamaEmbeddings;
  private chromaClient: ChromaClient;

  constructor() {
    this.llm = new Ollama({
      model: 'gemma3:1b',
      temperature: 0.5,
      baseUrl: OLLAMA_URL,
    });

    this.embeddings = new OllamaEmbeddings({
      model: 'nomic-embed-text',
      baseUrl: OLLAMA_URL,
    });

    this.chromaClient = new ChromaClient({ path: CHROMA_URL });
  }

  async createTopic(topic: string) {
    const vectorStore = new Chroma(this.embeddings, {
      collectionName: topic,
      url: CHROMA_URL,
    });

    // Add and immediately delete a dummy document to force collection creation
    // with the correct embedding function.
    const tempId = `init-${Date.now()}`;
    await vectorStore.addDocuments(
      [{ pageContent: 'init', metadata: { source: 'init' } }],
      { ids: [tempId] },
    );
    await vectorStore.delete({ ids: [tempId] });
  }

  async deleteTopic(topic: string) {
    await this.chromaClient.deleteCollection({ name: topic });
  }

  async listTopics() {
    const collections = await this.chromaClient.listCollections();
    return collections.map((c) => c.name);
  }

  async listDocuments(topic: string): Promise<string[]> {
    const collection = await this.chromaClient.getCollection({ name: topic });
    const allDocs = await collection.get();
    const filenames = allDocs.metadatas
      .map((meta) => (meta as any).filename)
      .filter(Boolean);
    return [...new Set(filenames)];
  }

  async deleteDocument(topic: string, filename: string) {
    const collection = await this.chromaClient.getCollection({ name: topic });
    await collection.delete({ where: { filename } });
  }

  async addDocuments(
    topic: string,
    documents: Document[]
  ) {
    const vectorStore = new Chroma(this.embeddings, {
      collectionName: topic,
      url: CHROMA_URL,
    });
    await vectorStore.addDocuments(documents);
  }

  async query(
    topic: string,
    question: string,
    documentsToUse?: string[],
  ) {
    const vectorStore = new Chroma(this.embeddings, {
      collectionName: topic,
      url: CHROMA_URL,
    });

    const retriever = vectorStore.asRetriever({
      filter:
        documentsToUse && documentsToUse.length > 0
          ? {
              filename: {
                $in: documentsToUse,
              },
            }
          : undefined,
    });

    const template = `You are a helpful assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer from the context provided, just say that you don't know, don't try to make up an answer.
Provide a conversational and well-formatted answer.

Context: {context}

Question: {question}

Helpful Answer:`;
    const prompt = ChatPromptTemplate.fromTemplate(template);

    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(
          new RunnableLambda({
            func: (docs) => {
              console.log('Retrieved documents:', docs);
              return docs.map((d) => d.pageContent).join('\n');
            },
          }),
        ),
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
