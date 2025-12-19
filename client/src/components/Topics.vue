<template>
  <Fieldset legend="Topics">
    <div class="topics-container">
      <Form @submit="handleCreateTopic">
        <div class="buttons-container">
          <InputText v-model="newTopicName" placeholder="New topic name" required />
          <Button type="submit" label="Create Topic" />
        </div>      
      </Form>

      <Topic v-for="topic in topics" :key="topic.name" :topic="topic" />    
    </div>
  </Fieldset>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Fieldset from 'primevue/fieldset';
import { useRag } from '../composables/useRag';
import Topic from './Topic.vue';

const { topics, fetchTopics, createTopic } = useRag();
const newTopicName = ref('');

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
  }  
</style>
