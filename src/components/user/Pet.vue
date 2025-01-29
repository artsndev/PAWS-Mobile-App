<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Appbar/>
  <v-container>
      <v-card-title class="mb-5">Your Pet</v-card-title>
        <v-row v-if="data && data.length > 0">
          <v-col cols="6" v-for="(item, index) in data" :key="index">
              <v-card rounded="xl" class="mt-n3 mb-1 text-center" elevation="3" :to="'/pet/profile/' + item.id">
                  <v-row class="mx-1 mt-1">
                      <v-col cols="12">
                        <v-avatar size="80" class="mx-auto mb-3">
                                        <v-img :src="item.avatar" alt="Avatar" style="object-fit: cover; width: 100%; height: 100%;"></v-img>
                                    </v-avatar>
                      </v-col>
                      <!-- <v-col cols="2" class="mt-n1 text-end">
                          <v-btn icon="mdi-trash-can-outline" density="comfortable" variant="flat" @click="deleteItem(item.id)"></v-btn>
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

        <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-icon icon="mdi-paw-off" class="fs-48"></v-icon>
        <h3>No pets available</h3>
        <p>Add a pet to see their profile here.</p>
      </v-col>
    </v-row>

        <v-snackbar :timeout="2000" v-model="snackbar" color="success">
      <v-icon icon="mdi-check" class="px-2"></v-icon>
        {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import axios from 'axios';
import Appbar from './layouts/Appbar.vue'
import { BASE_URL } from '@/server';
import { onMounted, ref } from 'vue';
import petImage from '@/assets/images/dog.jpg'

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

const isLoading = ref(false)
const snackbar = ref(false)
const text = ref('')
const color = ref('')
const icon = ref('')


onMounted(() => {
    fetchData()
})
</script>
