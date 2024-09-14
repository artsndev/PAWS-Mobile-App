<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app-bar flat color="deep-purple-darken-1">
    <template v-slot:prepend>
      <v-app-bar-nav-icon size="33" class="ms-2" @click="toggleMenu"></v-app-bar-nav-icon>
    </template>
    <v-dialog fullscreen transition="dialog-bottom-transition">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" icon>
          <v-icon>mdi-forum-plus-outline</v-icon>
        </v-btn>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              Appointment Form
              <v-btn icon="mdi-close" variant="text" @click="isActive.value = false"></v-btn>
            </v-card-title>
            <v-card-text>
              <div class=" mb-4">Invite collaborators to your network and grow your connections.</div>
              <v-form @submit.prevent="createAppointment">

              </v-form>
            </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Close Dialog"
          @click="isActive.value = false"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </template>
    </v-dialog>

        <v-btn icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" flat color="deep-purple-darken-1">
    <div class="text-center mt-3">
      <v-avatar size="70" class="mx-auto">
        <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Avatar" style="object-fit: cover; width: 100%; height: 100%;">
      </v-avatar>
      <v-list>
        <v-list-item :subtitle="email" :title="name"></v-list-item>
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
        <v-list-item prepend-icon="mdi-location-exit" title="Sign out" value="logout" class="ms-1 mt-1 fs-5" @click="logout"></v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="text-center mb-2">
        <!-- <p class="text-grey fs-14">@QuirkyQuarks Squadrons</p> -->
        <p class="text-grey mb-2 fs-14">© 2024 All rights reserved.</p>
      </div>
    </template>
  </v-navigation-drawer>

</template>

<script setup>
import { BASE_URL } from '@/server';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const drawer = ref(false);
const toggleMenu = () => {
  drawer.value = !drawer.value;
}

const navDrawitems = ref([
  { icon: 'mdi-chart-donut', text: 'Dashboard', routeName: 'Home' },
  { icon: 'mdi-paw-outline', text: 'Pet', routeName: 'Pet'},
  { icon: 'mdi-history', text: 'History', routeName: 'Vet User'},
  { icon: 'mdi-account-outline', text: 'Profile', routeName: 'Vet Queue'},
]);

const router = useRouter();

const name = ref('');
const email = ref('');

const loadUser = async () => {
  try {
    const token = localStorage.getItem('userToken')
    const response = await axios.get(BASE_URL + '/user/data', {
      headers : {
        Authorization: `Bearer ${token}`
      }
    })
    name.value = response.data.name
    email.value = response.data.email
    console.log(name.value)
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.removeItem('userToken');
      setTimeout(() => {
        location.reload()
        router.push({
          name: 'Login'
        })
      }, 3000)
    }
  }
}
const logout = async () => {
    try {
        const token = localStorage.getItem('userToken');
        await axios.post(BASE_URL + '/user/logout', null, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        localStorage.removeItem('userToken');
        router.push({ name: 'Login' });
    } catch (error) {
        console.error(error);
    }
};
const createAppointment = async () => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.post(BASE_URL + '/user/appointment', formData, {
      headers: {
        Authorization: `Beare ${token}`
      }
    })
  } catch (error) {
    console.log(error)
  }
}

const pet = ref([])

const fetchPet = async () => {
  try {
    const token = localStorage.getItem('userToken')
    const response = await axios.get(BASE_URL + '/user/appoinment/pet', {
      headers: {
        Authorization: `Beare ${token}`
      }
    })
    pet.value = response.data
    console.log(pet)
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  fetchPet()
  loadUser()
})

</script>
