<template>
  <Fieldset legend="Upload Documents">
    <Form @submit="handleUpload">
      <div class="buttons-container">
        <Select v-model="selectedTopic" :options="topics" optionLabel="name" optionValue="name" placeholder="Select a Topic" required />
        <FileUpload mode="basic" name="files[]" @select="handleFileChange" :multiple="true" chooseLabel="Choose Files" />
        <Button type="submit" label="Upload" />
      </div>        
    </Form>
  </Fieldset>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import Select from 'primevue/select';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import Fieldset from 'primevue/fieldset';
import { useRag } from '../composables/useRag';

const { topics, selectedTopic, fetchTopics, uploadDocuments } = useRag();
const files = ref<File[]>([]);

function handleFileChange(event: FileUploadSelectEvent) {
  files.value = event.files;
}

async function handleUpload() {
  await uploadDocuments(files.value);
}

onMounted(fetchTopics);
</script>

<style>
  .buttons-container {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
</style>