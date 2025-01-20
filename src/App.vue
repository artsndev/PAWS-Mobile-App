<template>
  <v-app class="scrollable-section">
    <v-main>
      <!-- Add v-pull-to-refresh -->
      <v-pull-to-refresh @load="handleRefresh" :pull-down-threshold="pullDownThreshold">
        <router-view />
      </v-pull-to-refresh>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import useStatusBar from './composables/statusBar';

const { setStatusBarTransparent } = useStatusBar();
const pullDownThreshold = 64; // Customize threshold if needed

// Handle refresh logic
const handleRefresh = async () => {
  console.log('Refreshing data...');

  // Option 1: Simulate API call or refresh logic
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Option 2: Reload the page to refresh all data
  location.reload();

  console.log('Data refreshed!');
};

onMounted(() => {
  let elHtml = document.getElementsByTagName('html')[0];
  elHtml.style.overflowY = 'hidden';
});
onUnmounted(() => {
  let elHtml = document.getElementsByTagName('html')[0];
  elHtml.style.overflowY = null;
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');
* {
  font-family: 'Poppins', sans-serif;
  /* background-color: #F8BBD0; */
}

.scrollable-section {
  overflow-y: auto;
  max-height: 100vh;
}
</style>
