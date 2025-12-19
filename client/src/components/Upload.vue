<template>
  <Fieldset legend="Upload Documents">
    <Form @submit.prevent="uploadFiles" class="p-fluid p-formgrid p-grid">
        <Select v-model="selectedTopic" :options="topics" optionLabel="name" optionValue="id" placeholder="Select a Topic" required />
        <FileUpload mode="basic" name="files[]" @select="handleFileChange" :multiple="true" chooseLabel="Choose Files" />
        <Button type="submit" label="Upload" />
    </Form>
  </Fieldset>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import Select from 'primevue/select';
import FileUpload from 'primevue/fileupload';
import Fieldset from 'primevue/fieldset';

const topics = ref([]);
const selectedTopic = ref(null);
const files = ref([]);

async function fetchTopics() {
  const response = await fetch('/rag/topics');
  topics.value = await response.json();
}

function handleFileChange(event) {
  files.value = event.files;
}

async function uploadFiles() {
  const formData = new FormData();
  formData.append('topicId', selectedTopic.value);
  for (const file of files.value) {
    formData.append('files', file);
  }

  await fetch('/rag/documents', {
    method: 'POST',
    body: formData,
  });

  // Ideally, we'd refresh the topics list here or the parent component
}

onMounted(fetchTopics);
</script>
