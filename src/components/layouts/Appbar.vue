<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app-bar flat color="deep-purple-darken-1">
    <template v-slot:prepend>
      <v-app-bar-nav-icon size="30" :ripple="false" @touchstart.prevent="toggleMenu" @mousedown.prevent="toggleMenu" @click="toggleMenu"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Application Bar</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" flat color="deep-purple-darken-1">
    <div class="text-center mt-3">
      <v-avatar size="70" class="mx-auto">
        <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Avatar" style="object-fit: cover; width: 100%; height: 100%;">
      </v-avatar>
      <v-list>
        <v-list-item subtitle="alfhaigarusman@gmail.com" title="Al-Fhaigar J. Usman"></v-list-item>
      </v-list>
    </div>
    <v-list density="compact" nav class="mt-3">
      <v-divider class="mb-5"></v-divider>
        <v-list-item v-for="(item, i) in navDrawitems" :key="i" :value="item" class="fs-5">
            <template v-slot:prepend>
                <v-icon :icon="item.icon" size="33"></v-icon>
            </template>
            <router-link :to="{ name: item.routeName }" class="text-white text-decoration-none">
                <v-list-item-title v-text="item.text"></v-list-item-title>
            </router-link>
        </v-list-item>
        <v-divider class="mt-5"></v-divider>
    </v-list>
    <template v-slot:append>
      <div class="text-center mb-2">
        <p class="text-grey fs-14">@QuirkyQuarks Squadrons</p>
        <p class="text-grey mb-2 fs-14">© 2024 All rights reserved.</p>
      </div>
    </template>
  </v-navigation-drawer>

</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(false);
const toggleMenu = () => {
  drawer.value = !drawer.value;
}

const navDrawitems = ref([
  { icon: 'mdi-account-outline', text: 'Home', routeName: 'Home' },
  { icon: 'mdi-account-outline', text: 'Home', routeName: 'Home' },
  { icon: 'mdi-account-outline', text: 'Home', routeName: 'Home' },
  { icon: 'mdi-account-outline', text: 'Home', routeName: 'Home' },
  { icon: 'mdi-account-outline', text: 'Home', routeName: 'Home' },

//   { icon: 'mdi-bullhorn-variant-outline', text: 'Announcement', routeName: 'Announcement'},
//   { icon: 'mdi-doctor', text: 'Doctor', routeName: 'Doctor'},
//   { icon: 'mdi-message-text-outline', text: 'Session', routeName: 'Session'},
//   { icon: 'mdi-cog-outline', text: 'Settings',},
]);

</script>
