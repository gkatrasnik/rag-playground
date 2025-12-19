<template>
  <Fieldset legend="Topics">
    <Panel v-for="topic in topics" :key="topic.id" :header="topic.name" toggleable>
      <Listbox :options="topic.documents" optionLabel="name" />
    </Panel>
    <Form @submit.prevent="createTopic">
      <div class="buttons-container">
        <InputText v-model="newTopicName" placeholder="New topic name" required />
        <Button type="submit" label="Create Topic" />
      </div>      
    </Form>
  </Fieldset>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import Fieldset from 'primevue/fieldset';
import Listbox from 'primevue/listbox';

const topics = ref([]);
const newTopicName = ref('');

async function fetchTopics() {
  const response = await fetch('/rag/topics');
  topics.value = await response.json();
}

async function createTopic() {
  await fetch('/rag/topics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newTopicName.value }),
  });
  newTopicName.value = '';
  await fetchTopics();
}

onMounted(fetchTopics);
</script>
