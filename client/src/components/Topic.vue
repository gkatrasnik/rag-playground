<template>
  <Panel :header="topic.name" toggleable :collapsed="!isSelected" @click.capture="handlePanelClick" :class="{ 'p-panel-selected': isSelected }">
    <template #icons>
      <Button icon="pi pi-trash" class="p-button-sm p-button-text" @click.stop="deleteTopic(topic.name)" />
    </template>
    <div class="topic-content-container">
      <Button label="Add documents" @click="isUploadDialogVisible = true" />
      <Dialog v-model:visible="isUploadDialogVisible" modal header="Upload Documents" :style="{ width: '50rem' }">
        <Upload :topicName="topic.name" @uploaded="isUploadDialogVisible = false" />
      </Dialog>

      <Listbox v-if="topic.documents.length > 0" :options="topic.documents" optionLabel="name" optionValue="name" v-model="selectedDocuments" multiple>
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

const props = defineProps<{
  topic: Topic;
  isSelected: boolean;
}>();

const emit = defineEmits(['select']);
const isUploadDialogVisible = ref(false);
const { deleteDocument, deleteTopic, selectedDocuments } = useRag();

function handlePanelClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.closest('.p-panel-header-icon') || target.closest('button')) {
    return;
  }
  emit('select');
}
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
    :deep(.p-panel-header) {
        cursor: pointer;
    }
    .p-panel-selected {
      border-left: 5px solid var(--p-primary-color);
    }
</style>