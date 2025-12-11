import { RAGApplication } from "./rag";
import { Document } from "@langchain/core/documents";
import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    const ragApp = new RAGApplication();
    
    console.log("Initializing RAG Application...");
    await ragApp.init();

    const docs = [
        new Document({ pageContent: "The powerhouse of the cell is the mitochondria", metadata: { source: "https://example.com" } }),
        new Document({ pageContent: "Buildings are made out of brick", metadata: { source: "https://example.com" } }),
        new Document({ pageContent: "Mitochondria are made out of lipids", metadata: { source: "https://example.com" } }),
        new Document({ pageContent: "The 2024 Olympics are in Paris", metadata: { source: "https://example.com" } }),
    ];
    const ids = ["1", "2", "3", "4"];

    console.log("Adding sample documents...");
    await ragApp.addDocuments(docs, ids);
    console.log("Documents added.");

    const askQuestion = () => {
        rl.question("\nEnter your question (or 'exit' to quit): ", async (question) => {
            if (question.toLowerCase() === 'exit') {
                rl.close();
                return;
            }

            try {
                console.log("Thinking...");
                const answer = await ragApp.query(question);
                console.log("\nAnswer:", answer);
            } catch (error) {
                console.error("Error:", error);
            }

            askQuestion();
        });
    };

    askQuestion();
}

main().catch(console.error);