<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Appbar/>
  <v-container>
    <v-img src="@/assets/images/bg.png" class="mx-n2"></v-img>
    <v-btn icon="mdi-medical-bag" color="red"></v-btn>

    <h2>Hello, {{ name }}</h2>
    <h5>Welcome to PAWSSIBLE Solutions Mobile App.</h5>
    <v-row class="mt-5">
          <v-col cols="6" v-for="(item, index) in data" :key="index">
              <v-card rounded="xl" class="mt-n3 mb-1" elevation="3" :to="'/pet/profile/' + item.id">
                  <v-row class="mx-1 mt-1">
                      <v-col cols="8">
                        <v-avatar size="80" class="mx-auto mb-3">
                          <v-img :src="item.avatar" alt="Avatar" style="object-fit: cover; width: 100%; height: 100%;"></v-img>
                      </v-avatar>
                      </v-col>
                      <!-- <v-col cols="4" class="mt-n1 text-end">
                          <v-btn icon="mdi-trash-can-outline" density="comfortable" variant="flat"></v-btn>
                      </v-col> -->
                  </v-row>
                  <v-list lines="one">
                      <v-list-item class="mt-n3 mb-1">
                          <template v-slot:default>
                              <v-list-item-content>
                                  <v-list-item-title class="fs-26">{{ item.name }}</v-list-item-title>
                                  <v-list-item-subtitle class="fs-16">{{ item.species }}</v-list-item-subtitle>
                              </v-list-item-content>
                          </template>
                      </v-list-item>
                  </v-list>
                  <v-card-actions>
                    <v-btn color="deep-purple-lighten-2" text="View Pet" block rounded="xl" variant="outlined"></v-btn>
                  </v-card-actions>
              </v-card>
          </v-col>
        </v-row>
  </v-container>
</template>

<script setup>
import axios from 'axios';
import Appbar from './layouts/Appbar.vue'
import { BASE_URL } from '@/server';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import petImage from '@/assets/images/dog.jpg'

const router = useRouter()

const name = ref('')
const email = ref('')
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

const data = ref([])

const fetchData = async () => {
    try {
        const token = localStorage.getItem('userToken')
        const response = await axios.get(BASE_URL + '/user/pet', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        data.value = response.data.data
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
  loadUser()
  fetchData()
})
</script>
