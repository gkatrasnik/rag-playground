import { ref, watch } from 'vue';
import type { Topic, Document, Message } from '../types';

const topics = ref<Topic[]>([]);
const selectedTopic = ref<Topic | null>(null);
const documents = ref<Document[]>([]);
const selectedDocuments = ref<string[]>([]);
const question = ref<string>('');
const response = ref<string>('');
const messages = ref<Message[]>([]);
const isLoading = ref(false);

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

async function uploadDocuments(files: File[], topicName?: string) {
  const topic = topicName || selectedTopic.value?.name;
  if (!topic) {
    console.error('No topic selected');
    return;
  }
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  await fetch(`/api/rag/topics/${topic}/documents`, {
    method: 'POST',
    body: formData,
  });
  await fetchTopics();
}

async function queryTopic() {
  if (!selectedTopic.value) return;

  var newQuestion = question.value.trim();
  if (newQuestion === '') return;

  isLoading.value = true;
  question.value = ''; //reset question input
  messages.value.push({ content: newQuestion, sender: 'user' });

  const res = await fetch(`/api/rag/topics/${selectedTopic.value.name}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: newQuestion,
      documentsToUse: selectedDocuments.value,
    }),
  });
  response.value = await res.text();
  messages.value.push({ content: response.value, sender: 'rag' });
  isLoading.value = false;
}

async function deleteTopic(topicName: string) {
  await fetch(`/api/rag/topics/${topicName}`, {
    method: 'DELETE',
  });
  
  if (selectedTopic.value?.name === topicName) {
    selectedTopic.value = null;
  }
  await fetchTopics();
}

async function deleteDocument(topicName: string, documentName: string) {
  await fetch(`/api/rag/topics/${topicName}/documents/${documentName}`, {
    method: 'DELETE',
  });
  await fetchTopics();
}

watch(selectedTopic, (newTopic, oldTopic) => {
  if (newTopic) {
    documents.value = newTopic.documents;
    if (newTopic.name !== oldTopic?.name) {
      selectedDocuments.value = newTopic.documents.map(doc => doc.name);
      messages.value = [];
    }
  } else {
    documents.value = [];
    selectedDocuments.value = [];
    messages.value = [];
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
    messages,
    isLoading,
    fetchTopics,
    createTopic,
    uploadDocuments,
    queryTopic,
    deleteTopic,
    deleteDocument,
    isLoading,
  };
}
