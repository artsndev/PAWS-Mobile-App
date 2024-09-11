<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app-bar flat active elevation="0" >
    <template v-slot:prepend>
      <v-btn icon  @click="goBack">
          <v-icon size="25">mdi-chevron-left</v-icon>
        </v-btn>
    </template>
    <!-- <v-spacer></v-spacer> -->
    <v-app-bar-title class="text-center me-4">Login as a User</v-app-bar-title>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>
