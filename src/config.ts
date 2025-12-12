import "dotenv/config";

export const APP_PORT = process.env.APP_PORT || "3000";

export const CHROMA_HOST = process.env.CHROMA_HOST || "localhost";
export const CHROMA_PORT = process.env.CHROMA_PORT || "8000";
export const CHROMA_URL = `http://${CHROMA_HOST}:${CHROMA_PORT}`;

export const OLLAMA_HOST = process.env.OLLAMA_HOST || "localhost";
export const OLLAMA_PORT = process.env.OLLAMA_PORT || "11434";
export const OLLAMA_URL = `http://${OLLAMA_HOST}:${OLLAMA_PORT}`;
