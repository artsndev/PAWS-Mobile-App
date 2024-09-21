<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Appbar/>
  <v-container>
    <v-row>
      <v-col cols="12" v-for="(item, index) in cardItems" :key="index">
        <v-card elevation="4" rounded="lg">
          <v-card-title class="fs-35">
            <vue-number v-model="item.number" v-bind="number"></vue-number>
          </v-card-title>
            <v-card-text>
              <v-row align="center" no-gutters>
                <v-col cols="8" >
                  <p class="fs-16">{{ item.title }}</p>
                </v-col>
                <v-col cols="4" class="text-right mt-n16">
                    <v-icon color="blue-grey-darken-1" :icon="item.icon" size="58"></v-icon>
                </v-col>
            </v-row>
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import Appbar from './layouts/Appbar.vue'
import { component as VueNumber } from '@coders-tm/vue-number-format'
import axios from 'axios';
import { BASE_URL } from '@/server';

const count_users = ref(1)
const count_available_schedules = ref(1)
const count_taken_schedules = ref(1)
const count_appointments = ref(5)
const count_queuing = ref(53)
const count_queued = ref(53)

const cardItems = ref([
    { title: 'Total Users', number: count_users, icon: 'mdi-account-multiple-outline'},
    { title: 'Available Schedules', number: count_available_schedules, icon: 'mdi-calendar-multiple'},
    { title: 'Taken Schedules', number: count_taken_schedules, icon: 'mdi-calendar-multiple-check'},
    { title: 'Requested Appointments', number: count_appointments, icon: 'mdi-clipboard-text-multiple-outline'},
    { title: 'Pending Appointments', number: count_queuing, icon: 'mdi-clipboard-multiple-outline'},
    { title: 'Completed Appointments', number: count_queued, icon: 'mdi-clipboard-check-multiple-outline'},
])

const number = {
    decimal: '.',
    separator: ',',
    precision: 2,
    masked: false,
    disabled: true,
}

const countData = async () => {
    try {
        const token = localStorage.getItem('vetToken')
        const response = await axios.get(BASE_URL + '/vet/count', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = response.data.data
        count_users.value = data.user_count
        count_available_schedules.value = data.available_schedule_count
        count_taken_schedules.value = data.taken_schedule_count
        count_appointments.value = data.appointment_count
        count_queuing.value = data.queue_count
        count_queued.value = data.queued_count
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    countData();
    const intervalId = setInterval(() => {
        countData();
    }, 5000);
    onUnmounted(() => {
        clearInterval(intervalId);
    });
});
</script>

<style scoped>
.fs-35 {
    font-size: 35px;
}
.fs-16 {
  font-size: 16px;
}
</style>
