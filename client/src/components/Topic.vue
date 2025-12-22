<template>
  <Panel :header="topic.name" toggleable collapsed class="topic-panel">  
    <template #icons>
      <Button icon="pi pi-trash" class="p-panel-header-icon p-link p-mr-2" text @click="deleteTopic(topic.name)" />         
    </template>
    <div class="topic-content-container">
      <Button label="Add documents" @click="isUploadDialogVisible = true" />
      <Dialog v-model:visible="isUploadDialogVisible" modal header="Upload Documents" :style="{ width: '50rem' }">
        <Upload :topicName="topic.name" @uploaded="isUploadDialogVisible = false" />
      </Dialog>

      <Listbox v-if="topic.documents.length > 0" :options="topic.documents" optionLabel="name">
        <template #option="slotProps">
            <div class="document-item">
            <span>{{ slotProps.option.name }}</span>
            <Button icon="pi pi-trash" class="p-button-sm p-button-text" @click="deleteDocument(topic.name, slotProps.option.name)" />
            </div>
        </template>
      </Listbox>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import type { Topic } from '../types';
import { useRag } from '../composables/useRag';
import Upload from './Upload.vue';
import Button from 'primevue/button';
import Listbox from 'primevue/listbox';
import Dialog from 'primevue/dialog';
import Panel from 'primevue/panel';
import { ref } from 'vue';


defineProps<{
  topic: Topic;
}>();

const isUploadDialogVisible = ref(false);

const { deleteDocument, deleteTopic } = useRag();

</script>

<style scoped>
    .topic-panel {
        min-width: 100%;
        max-width: 600px;
    }
    .topic-content-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }
    .document-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
</style>