export interface Document {
  name: string;
}

export interface Topic {
  name: string;
  documents: Document[];
}

export interface Message {
  content: string;
  sender: 'user' | 'rag';
}