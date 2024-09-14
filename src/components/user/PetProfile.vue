<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <AppBar/>
  <v-container>
    <div class="text-center">
      <v-avatar size="100" class="mx-auto">
        <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Avatar" style="object-fit: cover; width: 100%; height: 100%;">
      </v-avatar>
      <h2 class="mx-auto font-weight-regular mt-3">{{ name }}</h2>
      <p class="mx-auto text-grey font-weight-regular">{{ age }}</p>
    </div>
  </v-container>
  <!-- <v-divider></v-divider> -->
    <v-list  nav>
      <v-list-item>
        <p class="fs-10 mb-5">Details</p>
        <v-list-item-title class="font-weight-medium fs-10 mb-2">
          <v-icon>mdi-briefcase-variant-outline</v-icon>
          <span class="mx-2">{{ age }}</span>
        </v-list-item-title>
        <v-list-item-title class="font-weight-medium fs-10 mb-2">
          <v-icon>mdi-at</v-icon>
          <span class="mx-2">{{ breed }}</span>
        </v-list-item-title>
        <v-list-item-title class="font-weight-medium fs-10 mb-2">
          <v-icon>mdi-cake-variant-outline</v-icon>
          <span class="mx-2">{{ species }}</span>
        </v-list-item-title>
        <v-list-item-title class="font-weight-medium fs-10 mb-2">
          <v-icon>mdi-phone-outline</v-icon>
          <span class="mx-2">{{ sex }}</span>
        </v-list-item-title>
        <v-list-item-title class="font-weight-medium fs-10 mb-2">
          <v-icon>mdi-map-marker-radius-outline</v-icon>
          <span class="mx-2 text-wrap">{{ color }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-snackbar :timeout="2000" v-model="snackbar" color="success">
      <v-icon icon="mdi-check" class="px-2"></v-icon>
        {{ text }}
    </v-snackbar>
</template>

<script setup>
import AppBar from './layouts/Appbar.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { BASE_URL } from '@/server';
import { useRouter, useRoute } from 'vue-router';
import dayjs from 'dayjs';

const snackbar = ref(false)
const name = ref('')
const breed = ref('')
const color = ref('')
const species = ref('')
const sex = ref('')
const age = ref('')

const petId = ref(null)

const router = useRouter()

const formatDate = (dateTime) => {
    return dayjs(dateTime).format('dddd, MMMM D, YYYY hh:mm A');
};

const loadUser = async () => {
  try {
    const token = localStorage.getItem('userToken')
    const response = await axios.get(BASE_URL + '/user/pet/'+petId.value, {
      headers : {
        Authorization: `Bearer ${token}`
      }
    })
    const pet = response.data.data
    name.value = pet.name
    breed.value = pet.breed
    color.value = pet.color
    species.value = pet.species
    sex.value = pet.sex
    age.value = pet.age
  } catch (error) {
    if (error.response.status === 401) {
      location.reload()
        localStorage.removeItem('userToken');
      setTimeout(() => {
        router.push({
          name: 'Login'
        })
      }, 3000)
    }
  }
}

const formattedDate = (date) => {
    if (!date) return '';
    const d = new Date(date);

    // Pad single digits with leading zeros
    const pad = (num) => num.toString().padStart(2, '0');

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1); // Months are zero-based, so add 1
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const route = useRoute()

onMounted(() => {
  petId.value = route.params.id
  loadUser()
})
</script>

<style scoped>
.fs-10{
  font-size: 15px;
}
</style>
