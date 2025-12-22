<template>
  <div class="app-container">
    <BurgerIcon @toggle="toggleDrawer" />
    <SideDrawer :isOpen="isDrawerOpen" @toggle="toggleDrawer">
      <Topics />
    </SideDrawer>
    <div class="main-content">
      <Query />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Topics from './components/Topics.vue';
import Query from './components/Query.vue';
import SideDrawer from './components/SideDrawer.vue';
import BurgerIcon from './components/BurgerIcon.vue';

const isDrawerOpen = ref(true);

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};
</script>

<style>
body {
  font-family: sans-serif;
  margin: 0;
}

.app-container {
  display: flex;
  overflow-x: hidden;
}

.main-content {
  transition: margin-left 0.3s ease;
  padding: 2em;
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

@media (min-width: 768px) {
  .main-content.drawer-open {
  }
}

h1 {
  text-align: center;
}
</style>
