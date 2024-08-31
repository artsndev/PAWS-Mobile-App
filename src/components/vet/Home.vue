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
import { ref } from 'vue';
import Appbar from './layouts/Appbar.vue'
import { component as VueNumber } from '@coders-tm/vue-number-format'

const count_patients = ref(1)
const count_doctors = ref(2)
const count_appointments = ref(5)
const count_queues = ref(53)

const cardItems = ref([
    { title: 'Total Users', number: count_patients, icon: 'mdi-account-multiple-outline'},
    { title: 'Total Pets', number: count_doctors, icon: 'mdi-paw'},
    { title: 'Appointments', number: count_appointments, icon: 'mdi-clipboard-text-multiple-outline'},
    { title: 'Completed Appointments', number: count_queues, icon: 'mdi-clipboard-check-multiple-outline'},
])

const number = {
    decimal: '.',
    separator: ',',
    precision: 2,
    masked: false,
    disabled: true,
}
</script>

<style scoped>
.fs-35 {
    font-size: 35px;
}
.fs-16 {
  font-size: 16px;
}
</style>
