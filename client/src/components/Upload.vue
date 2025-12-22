<template>
    <Form @submit="handleUpload">
      <div class="controls-container">
        <FileUpload ref="fileUploadRef" mode="basic" name="files[]" @select="handleFileChange" :multiple="true" chooseLabel="Choose Files" />
        <div class="buttons-container">
          <Button type="submit" label="Upload" :disabled="!files.length" />
          <Button v-if="files.length" type="button" label="Clear" @click="clearFiles" severity="secondary" />
        </div>        
      </div>        
    </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import { useRag } from '../composables/useRag';

const props = defineProps<{
  topicName:string;
}>();

const emit = defineEmits<{
  (e: 'uploaded'): void;
}>();

const { uploadDocuments } = useRag();
const files = ref<File[]>([]);
const fileUploadRef = ref(null);

function handleFileChange(event: FileUploadSelectEvent) {
  files.value = event.files;
}

async function handleUpload() {
  if (!files.value.length) return;
  await uploadDocuments(files.value, props.topicName);
  clearFiles();
  emit('uploaded');
}

function clearFiles() {
  files.value = [];
  if (fileUploadRef.value) {
    (fileUploadRef.value as any).clear();
  }
}
</script>

<style>
  .controls-container {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }
  .buttons-container {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
</style>