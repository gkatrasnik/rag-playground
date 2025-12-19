import { ref, watch } from 'vue';

interface Document {
  name: string;
}

interface Topic {
  name: string;
  documents: Document[];
}

const topics = ref<Topic[]>([]);
const selectedTopic = ref<string | null>(null);
const documents = ref<Document[]>([]);
const selectedDocuments = ref<string[]>([]);
const question = ref<string>('');
const response = ref<string>('');

async function fetchTopics() {
  const res = await fetch('/api/rag/topics');
  topics.value = await res.json();
}

async function createTopic(name: string) {
  await fetch('/api/rag/topics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: name }),
  });
  await fetchTopics();
}

async function uploadDocuments(files: File[]) {
  if (!selectedTopic.value) return;
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  await fetch(`/api/rag/topics/${selectedTopic.value}/documents`, {
    method: 'POST',
    body: formData,
  });

  await fetchTopics();
}

async function queryTopic() {
  if (!selectedTopic.value) return;
  const res = await fetch(`/api/rag/topics/${selectedTopic.value}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: question.value,
      documentsToUse: selectedDocuments.value,
    }),
  });
  response.value = await res.text();
}

async function deleteTopic(topicName: string) {
  await fetch(`/api/rag/topics/${topicName}`, {
    method: 'DELETE',
  });
  await fetchTopics();
  if (selectedTopic.value === topicName) {
    selectedTopic.value = null;
  }
}

async function deleteDocument(topicName: string, documentName: string) {
  await fetch(`/api/rag/topics/${topicName}/documents/${documentName}`, {
    method: 'DELETE',
  });
  await fetchTopics();
}

watch(selectedTopic, (newTopic, oldTopic) => {
  if (newTopic) {
    const topic = topics.value.find(t => t.name === newTopic);
    documents.value = topic ? topic.documents : [];
    if (newTopic !== oldTopic) {
      selectedDocuments.value = [];
    }
  } else {
    documents.value = [];
    selectedDocuments.value = [];
  }
});

export function useRag() {
  return {
    topics,
    selectedTopic,
    documents,
    selectedDocuments,
    question,
    response,
    fetchTopics,
    createTopic,
    uploadDocuments,
    queryTopic,
    deleteTopic,
    deleteDocument,
  };
}
