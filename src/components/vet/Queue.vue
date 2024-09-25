<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Appbar/>
  <v-breadcrumbs :items="breadCrumbsItems">
    <template v-slot:divider>
      <v-icon icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>
  <v-row no-gutters>
    <v-col cols="12">
      <v-card-title>List of Queued Appointments</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" loading-text="Loading... Please wait" :items="filteredData" :items-per-page="pagination.rowsPerPage" v-model:page="pagination.page" :server-items-length="totalResults" class="elevation-0" :loading="isLoading">
          <template v-slot:top>
            <v-toolbar flat color="transparent">
              <v-text-field rounded color="primary" variant="outlined" v-model="searchQuery"  density="compact" label="Search by Name or Email" single-line hide-details/>
            </v-toolbar>
          </template>
          <template v-slot:item.name="{ item }">{{ item.name }}</template>
          <template v-slot:item.actions="{ item }">
            <div class="text-end mx-n2">
              <!-- View Dialog -->
              <v-dialog v-model="item.viewDialog" max-width="500" persistent fullscreen>
                <template v-slot:activator="{ props }">
                  <v-btn density="comfortable" icon @click="viewItem(item)" variant="text" color="deep-purple-darken-1" v-bind="props">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card title="View Patient's Appointment" prepend-icon="mdi-badge-account-horizontal-outline">
                    <v-card-text>
                      <div class="text-center">
                        <v-avatar size="100" class="mx-auto">
                          <img :src="avatar" alt="Avatar" style="object-fit: cover; width: 100%; height: 100%;">
                        </v-avatar>
                        <h2 class="mx-auto font-weight-regular mt-3">{{ item.user.name }}</h2>
                        <p class="mx-auto text-grey font-weight-regular">{{ item.user.email }}</p>
                      </div>
                      <v-divider class="mt-3 mb-3"></v-divider>
                      <p class="fs-10 mb-5">Pet Owner Details</p>
                      <v-list-item-title class="font-weight-medium fs-10 mb-2 mt-n4">
                          <v-icon>mdi-at</v-icon>
                          <span class="mx-2">{{ item.user.email }}</span>
                      </v-list-item-title>
                      <v-divider class="mt-3 mb-3"></v-divider>
                      <p>Pet Appointment Details</p>
                      <v-form class="mt-3">
                        <v-row gutters="1">
                          <v-col cols="6" >
                            <v-text-field readonly v-model="item.pet.name" density="compact" variant="outlined" color="deep-purple-darken-3" label="Pet's Name"></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <v-text-field readonly v-model="item.pet.breed" density="compact" variant="outlined" color="deep-purple-darken-3" label="Pet's Breed"></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row class="mt-n6">
                          <v-col cols="6">
                            <v-text-field readonly v-model="item.pet.sex" density="compact" variant="outlined" color="deep-purple-darken-3" label="Pet's Sex"></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <v-text-field readonly v-model="item.pet.species" density="compact" variant="outlined" color="deep-purple-darken-3" label="Pet's Species"></v-text-field>
                          </v-col>
                        </v-row>
                        <v-text-field readonly v-model="item.pet.color" density="compact" variant="outlined" color="deep-purple-darken-3" label="Pet's Color"></v-text-field>
                        <!-- <v-text-field readonly v-model="item.schedule.schedule_time" density="compact" variant="outlined" color="deep-purple-darken-3" label="Appointment Schedule"></v-text-field> -->
                        <v-textarea readonly v-model="item.appointment.purpose_of_appointment" density="compact" color="deep-purple-darken-3" variant="outlined" label="Purpose of Appointment" auto-grow rows="1"></v-textarea>
                      </v-form>
                      <v-divider class="mt-3 mb-3"></v-divider>
                      <p>Pet Record</p>
                      <div v-for="(result, index) in item.appointment.result" :key="index">
                        <v-form class="mt-6">
                          <v-text-field readonly v-model="result.physical_exam" density="compact" variant="outlined" color="deep-purple-darken-3" label="Physical Examination"></v-text-field>
                          <v-text-field readonly v-model="result.treatment_plan" density="compact" variant="outlined" color="deep-purple-darken-3" label="Treatment Plan"></v-text-field>
                        </v-form>
                        <v-divider v-if="index !== item.appointment.result.length - 1" ></v-divider>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>

              <!-- Delete Dialog -->
              <v-dialog v-model="item.viewDialog" max-width="500" persistent fullscreen>
                <template v-slot:activator="{ props }">
                  <v-btn density="comfortable" icon @click="(item)" variant="text" color="deep-purple-darken-1" v-bind="props">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <template v-slot:default="{ isActive }">

                </template>
              </v-dialog>
              <v-btn v-if="!item.deleted_at" density="comfortable" icon @click="markAsDone(item.id)" variant="text" color="warning">
                <v-icon>mdi-alert-outline</v-icon>
              </v-btn>

            </div>
          </template>
          <template v-slot:no-data>
            <v-alert type="info" :value="true">No data available</v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-col>
  </v-row>
  <v-snackbar :timeout="5000" v-model="snackbar" :color="color">
    <v-icon :icon="icon" class="px-2"></v-icon>
    {{ text }}
  </v-snackbar>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import Appbar from './layouts/Appbar.vue'
import axios from 'axios';
import { BASE_URL } from '@/server';
import avatar from '@/assets/images/avatar.png'

const breadCrumbsItems = ref([
    { title: 'Dashboard', href: '/doctor/dashboard', disabled: false },
    { title: 'Queues', href: '/doctor/dashboard', disabled: true },
]);
const data = ref([]); // Initialize as an empty array
const searchQuery = ref('');
const isLoading = ref(false);
const snackbar = ref(false);
const text = ref('');
const color = ref('');
const icon = ref('');

const pagination = ref({
    rowsPerPage: 10,
    page: 1,
});

const headers = [
    { title: 'Pet Owners Name', value: 'user.name', align: 'left' },
    { title: 'Actions', value: 'actions', sortable: false, align: 'end' }, // Added actions column
];

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

const viewItem = (item) => {
    console.log('View item:', item);
  // Implement view functionality here

};

const fetchData = async () => {
    try {
        isLoading.value = true;
        const token = localStorage.getItem('vetToken');
        const response = await axios.get(BASE_URL + '/vet/queue', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        data.value = response.data.data
    } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
            snackbar.value = true;
            text.value = 'Error fetching your data. Please try again.';
            color.value = 'red'
            icon.value = 'mdi-exclamation'
            localStorage.removeItem('vetToken');
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    } finally {
        isLoading.value = false;
    }
}


const markAsDone = async (id) => {
    try {
        isLoading.value = true
        const token = localStorage.getItem('vetToken');
        const response = await axios.delete(BASE_URL + '/vet/queue/' + id, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        snackbar.value = true
        icon.value = 'mdi-check'
        color.value = 'success'
        text.value = 'Queued Successfully'
        fetchData()
    } catch (error) {
        console.log(error)
    } finally {
        isLoading.value = false
    }
}

const totalResults = computed(() => {
    return data.value.length;
});

const filteredData = computed(() => {
  if (!data.value) return []; // Ensure data is defined before filtering
    const search = searchQuery.value.toLowerCase();
    return data.value.filter(item =>
        item.user.name.toLowerCase().includes(search)
    );
});

watch([searchQuery, pagination], () => {
  pagination.value.page = 1; // Reset to the first page on search
});

onMounted(() => {
  fetchData()
});
</script>
