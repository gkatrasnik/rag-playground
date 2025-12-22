<template>   
  <Fieldset legend="Topics">
    <Form @submit="handleCreateTopic">
      <div class="buttons-container">
        <InputText v-model="newTopicName" placeholder="New topic name" required />
        <Button type="submit" label="Add Topic" />
      </div>      
    </Form>
      <DataView :value="topics">
        <template #list="slotProps">
          <div class="topics-container">       
            <Topic v-for="(topic, index) in slotProps.items" :key="index" :topic="topic" />
          </div>
        </template>
      </DataView>
  </Fieldset>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Fieldset from 'primevue/fieldset';
import DataView from 'primevue/dataview';
import { useRag } from '../composables/useRag';
import Topic from './Topic.vue';
import type { Topic as TopicType } from '../types';

const { topics, fetchTopics, createTopic, deleteTopic } = useRag();
const newTopicName = ref('');
const selectedTopic = ref<TopicType | null>(null);

async function handleCreateTopic() {
  await createTopic(newTopicName.value);
  newTopicName.value = '';
}

onMounted(fetchTopics);
</script>

<style>
   .topics-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;

  }

  .buttons-container {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
  }  
</style>
