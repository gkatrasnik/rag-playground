<template>
  <Panel :header="topic.name" toggleable class="topic-panel">
    <template #icons>
      <Button icon="pi pi-trash" class="p-panel-header-icon p-link p-mr-2" @click="deleteTopic(topic.name)" />
    </template>
    <div class="topic-content-container">
        <Upload :topicName="topic.name" />
        <Listbox :options="topic.documents" optionLabel="name">
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
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import Listbox from 'primevue/listbox';

defineProps<{
  topic: Topic;
}>();

const emit = defineEmits<{
  (e: 'delete', topicName: string): void;
}>();

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