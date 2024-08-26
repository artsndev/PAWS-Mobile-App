<template>
  <v-app class="scrollable-section">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import useStatusBar from './composables/statusBar';

// eslint-disable-next-line no-unused-vars
const { setStatusBarTransparent } = useStatusBar();

onMounted(() => {
  let elHtml = document.getElementsByTagName('html')[0];
  elHtml.style.overflowY = 'hidden';
})
onUnmounted(() => {
  let elHtml = document.getElementsByTagName('html')[0];
  elHtml.style.overflowY = null;
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');
* {
  font-family: 'Poppins', sans-serif;
  /* background-color: #ECEFF1; */

}
.scrollable-section {
    overflow-y: auto;
    max-height: 100vh;
}
</style>
