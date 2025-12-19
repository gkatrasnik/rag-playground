<template>
  <div>
    <h1>RAG Playground</h1>
    <Topics />
    <Upload />
    <Query />
  </div>
</template>

<script setup>
import Topics from './components/Topics.vue';
import Upload from './components/Upload.vue';
import Query from './components/Query.vue';
</script>

<style>
body {
  font-family: sans-serif;
  margin: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
