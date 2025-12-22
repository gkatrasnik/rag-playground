<template>   
  <Fieldset legend="Topics">
    <Form @submit="handleCreateTopic">
      <div class="buttons-container">
        <InputText v-model="newTopicName" placeholder="New topic name" required />
        <Button type="submit" label="Create Topic" />
      </div>      
    </Form>
    <Accordion value="0">
      <AccordionPanel v-for="topic in topics" :key="topic.name" :value="topics.indexOf(topic).toString()">
        <AccordionHeader>
          <span class="accordion-header-content">
            {{ topic.name }}
            <Button icon="pi pi-trash" class="ml-auto mr-2" text @click="deleteTopic(topic.name)" />
          </span>
        </AccordionHeader>
        <AccordionContent>
          <Topic :topic="topic" />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
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

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const { topics, fetchTopics, createTopic, deleteTopic } = useRag();
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

  .accordion-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
</style>
