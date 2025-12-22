<template>
  <div class="query-component">
    <div class="chat-container" ref="chatContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message-container', message.sender]">
        <div class="message-bubble">{{ message.content }}</div>
      </div>
      <div v-if="isLoading" class="message-container rag">
        <div class="message-bubble">Answering...</div>
      </div>
    </div>
    <Fieldset :legend="selectedTopic?.name || 'Please select a topic'">
      <Form @submit="queryTopic" >
        <div class="query-container" >
          <InputText 
            v-model="question" 
            :placeholder="selectedTopic ? 'Ask a question' : 'Please select a topic in sidebar'" 
            required 
            fluid 
            :disabled="!selectedTopic || isLoading"
            size="large"
          />
          <Button type="submit" label="Submit" :disabled="isLoading" />
        </div>
      </Form>    
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Fieldset from 'primevue/fieldset';
import { useRag } from '../composables/useRag';

const { 
  selectedTopic, 
  question,
  messages,
  queryTopic,
  isLoading,
} = useRag();

const chatContainer = ref<HTMLElement | null>(null);

watch(messages, () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}, { deep: true });
</script>

<style>
  .query-component {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    max-width: 800px;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  .chat-container {
    height: 75vh;    
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    /* border: 1px solid var(--p-fieldset-border-color); */
    padding: 1rem;
  }
  .message-container {
    display: flex;
    margin-bottom: 1rem;
  }
  .message-container.user {
    justify-content: flex-end;
  }
  .message-container.rag {
    justify-content: flex-start;
  }
  .message-bubble {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    max-width: 80%;
  }
  .message-container.user .message-bubble {
    background-color: var(--p-primary-color);
    color: var(--p-primary-contrast-color);
  }
  .message-container.rag .message-bubble {
    background-color: var(--p-surface-200);
    color: var(--p-primary-contrast-color);
  }
  .query-container {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>