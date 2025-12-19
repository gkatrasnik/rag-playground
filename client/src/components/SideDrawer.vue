<template>
  <aside class="side-drawer" :class="{ open: isOpen }">
    <button @click="$emit('toggle')" class="close-button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="drawer-content">
      <slot></slot>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();
defineEmits(['toggle']);
</script>

<style scoped>
.side-drawer {
  position: relative;
  height: 100vh;
  width: 450px;
  padding: 20px;
  background: var(--p-surface-800);
  transition: margin-left 0.3s ease;
  overflow-y: auto;
  flex-shrink: 0;
  margin-left: -450px; /* width + padding */
  z-index: 1100;
}

.side-drawer.open {
  margin-left: 0;
}

.drawer-content {
  margin-top: 50px;
}

.close-button {
  position: absolute;
  padding: 10px;
  margin-bottom: 30px;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  cursor: pointer;
}
</style>