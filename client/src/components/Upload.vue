<template>
  <Panel header="Upload documents" :toggleable="true" :collapsed="false">
    <Form @submit="handleUpload">
      <div class="buttons-container">
        <FileUpload ref="fileUploadRef" mode="basic" name="files[]" @select="handleFileChange" :multiple="true" chooseLabel="Choose Files" />
        <Button type="submit" label="Upload" :disabled="!files.length" />
        <Button v-if="files.length" type="button" label="Clear" @click="clearFiles" severity="secondary" />
      </div>        
    </Form>
  </Panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import Panel from 'primevue/panel';
import { useRag } from '../composables/useRag';

const props = defineProps<{
  topicName: string;
}>();

const { uploadDocuments } = useRag();
const files = ref<File[]>([]);
const fileUploadRef = ref<FileUpload | null>(null);

function handleFileChange(event: FileUploadSelectEvent) {
  files.value = event.files;
}

async function handleUpload() {
  if (!files.value.length) return;
  await uploadDocuments(files.value, props.topicName);
  clearFiles();
}

function clearFiles() {
  files.value = [];
  fileUploadRef.value?.clear();
}
</script>

<style>
  .buttons-container {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
</style>