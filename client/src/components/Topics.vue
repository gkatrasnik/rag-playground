<template>
  <Fieldset legend="Topics">
    <Panel v-for="topic in topics" :key="topic.name" :header="topic.name" toggleable>
      <template #icons>
        <Button icon="pi pi-trash" class="p-panel-header-icon p-link p-mr-2" @click="deleteTopic(topic.name)" />
      </template>
      <Listbox :options="topic.documents" optionLabel="name">
        <template #option="slotProps">
          <div class="document-item">
            <span>{{ slotProps.option.name }}</span>
            <Button icon="pi pi-trash" class="p-button-sm p-button-text" @click="deleteDocument(topic.name, slotProps.option.name)" />
          </div>
        </template>
      </Listbox>
    </Panel>
    <Form @submit="handleCreateTopic">
      <div class="buttons-container">
        <InputText v-model="newTopicName" placeholder="New topic name" required />
        <Button type="submit" label="Create Topic" />
      </div>      
    </Form>
  </Fieldset>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import Fieldset from 'primevue/fieldset';
import Listbox from 'primevue/listbox';
import { useRag } from '../composables/useRag';

const { topics, fetchTopics, createTopic, deleteTopic, deleteDocument } = useRag();
const newTopicName = ref('');

async function handleCreateTopic() {
  await createTopic(newTopicName.value);
  newTopicName.value = '';
}

onMounted(fetchTopics);
</script>

<style>
  .buttons-container {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  .document-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
</style>
