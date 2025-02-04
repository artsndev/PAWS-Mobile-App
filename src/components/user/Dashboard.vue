<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Appbar/>
  <v-container>
    <v-img src="@/assets/images/bg.png" class="mx-n2"></v-img>
    <h4>Services</h4>
    <v-btn
      v-for="(item, index) in buttonTitles"
      :key="index"
      :icon="item.icon"
      :color="item.color"
      class="mx-1 mb-3"
      rounded="lg"
      size="75"
      @click="openDialog(index)"
    ></v-btn>
    <v-dialog
      v-for="(dialog, index) in dialogs"
      :key="index"
      v-model="dialog.isOpen"
      max-width="500"
    >
      <v-card elevation="10" rounded="lg">
        <!-- Header -->
        <v-card-title
          :class="['text-white d-flex align-center', dialog.color]"
        >
          <v-icon size="36" class="me-3">{{ buttonTitles[index].icon }}</v-icon>
          <span class="text-h5">{{ dialog.title }}</span>
        </v-card-title>

        <!-- Content -->
        <v-card-text class="py-4 px-6">
          <div
            v-for="(price, i) in dialog.prices"
            :key="i"
            class="d-flex justify-space-between align-center mb-3"
          >
            <span class="font-weight-medium">{{ price.service }}</span>
            <span class="text-primary font-weight-bold">{{ price.price }}</span>
          </div>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="closeDialog(index)">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <h2>Hello, {{ name }}</h2>
    <h5>Welcome to PAWSSIBLE Solutions Mobile App.</h5>
    <v-row class="mt-5">
          <v-col cols="6" v-for="(item, index) in data" :key="index">
              <v-card rounded="xl" class="mt-n3 mb-1 text-center" elevation="3" :to="'/pet/profile/' + item.id">
                  <v-row class="mx-1 mt-1 text-center">
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

const buttonTitles = ref([
  { icon: 'mdi-medical-bag', color: 'red' },
  { icon:'mdi-needle', color: 'info' },
  { icon:'mdi-medication', color: 'secondary' },
  { icon:'mdi-bandage', color: 'brown' },
  { icon:'mdi-store', color: 'pink' },
])

const dialogs = ref([
      {
        isOpen: false,
        title: "Vaccination",
        color: "bg-red",
        prices: [
          { service: "Cats", price: "₱ 250.00 - 780.00" },
          { service: "Dogs", price: "₱ 250.00 - 750.00" },
        ],
      },
      {
        isOpen: false,
        title: "Consultation",
        color: "bg-info",
        prices: [{ service: "Check-up", price: "₱ 350.00 - 500.00" }],
      },
      {
        isOpen: false,
        title: "Diagnostic and Lab Tests",
        color: "bg-secondary",
        prices: [
          { service: "CBC", price: "₱ 2,000.00 - 5,000.00" },
          { service: "Blood Chem", price: "₱ 2,000.00 - 5,000.00" },
        ],
      },
      {
        isOpen: false,
        title: "Surgery",
        color: "bg-brown",
        prices: [
          { service: "Cats", price: "₱ 3,000.00 - 6,000.00" },
          { service: "Dogs", price: "₱ 5,000.00 - 15,000.00" },
        ],
      },
      {
        isOpen: false,
        title: "Additional Services",
        color: "bg-pink",
        prices: [{ service: "Store Items", price: "Varies by product" }],
      },
    ]);

    const openDialog = (index) => {
      dialogs.value[index].isOpen = true;
    };

    const closeDialog = (index) => {
      dialogs.value[index].isOpen = false;
    };

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
