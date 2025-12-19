<template>
  <Fieldset legend="Query a Topic">
    <Form @submit="queryTopic" >
      <div class="dropdowns-container" >
        <Select v-model="selectedTopic" :options="topics" optionLabel="name" optionValue="name" placeholder="Select a Topic" required />
        <MultiSelect v-model="selectedDocuments" :options="documents" optionLabel="name" optionValue="name" placeholder="Select Documents" />
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
import { onMounted } from 'vue';
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import Fieldset from 'primevue/fieldset';
import { useRag } from '../composables/useRag';

const { 
  topics, 
  selectedTopic, 
  documents, 
  selectedDocuments,
  question,
  response,
  fetchTopics, 
  queryTopic 
} = useRag();

onMounted(async () => {
  await fetchTopics();
  if (topics.value.length > 0 && !selectedTopic.value) {
    selectedTopic.value = topics.value[0].id;
  }
});
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