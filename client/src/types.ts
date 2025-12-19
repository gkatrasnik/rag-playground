export interface Document {
  name: string;
}

export interface Topic {
  name: string;
  documents: Document[];
}