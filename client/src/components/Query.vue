<template>
  <Fieldset legend="Query a Topic">
    <Form @submit.prevent="queryTopic" >
      <div class="dropdowns-container" >
        <Select v-model="selectedTopic" :options="topics" optionLabel="name" optionValue="id" placeholder="Select a Topic" @change="fetchDocuments" required />
        <MultiSelect v-model="selectedDocuments" :options="documents" optionLabel="name" optionValue="id" placeholder="Select Documents" />
      </div>
      <div class="query-container" >
        <InputText v-model="question" placeholder="Ask a question" required />
        <Button type="submit" label="Submit" />
      </div>
    </Form>
    <Fieldset legend="Response" :toggleable="true" class="p-mt-4">
      <p>{{ response }}</p>
    </Fieldset>
  </Fieldset>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import Fieldset from 'primevue/fieldset';

const topics = ref([]);
const selectedTopic = ref(null);
const documents = ref([]);
const selectedDocuments = ref([]);
const question = ref('');
const response = ref('');

async function fetchTopics() {
  const response = await fetch('/rag/topics');
  topics.value = await response.json();
  if (topics.value.length > 0) {
    selectedTopic.value = topics.value[0].id;
    await fetchDocuments();
  }
}

async function fetchDocuments() {
  if (!selectedTopic.value) return;
  const topic = topics.value.find(t => t.id === selectedTopic.value);
  documents.value = topic ? topic.documents : [];
  selectedDocuments.value = [];
}

async function queryTopic() {
  const res = await fetch(`/rag/query/${selectedTopic.value}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: question.value,
      documentIds: selectedDocuments.value,
    }),
  });
  response.value = await res.text();
}

onMounted(fetchTopics);
</script>

<style>
  .dropdowns-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .query-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
</style>