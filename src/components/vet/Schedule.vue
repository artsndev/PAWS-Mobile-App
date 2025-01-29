<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Appbar/>
  <!-- <v-breadcrumbs :items="breadCrumbsItems">
    <template v-slot:divider>
      <v-icon icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs> -->
  <v-row no-gutters>
    <v-col cols="12">
      <v-card-title>List of my Schedules</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" loading-text="Loading... Please wait" :items="filteredData" :items-per-page="pagination.rowsPerPage" v-model:page="pagination.page" :server-items-length="totalResults" class="elevation-0" :loading="isLoading">
          <template v-slot:top>
            <v-toolbar flat color="transparent">
              <v-text-field rounded color="primary" variant="outlined" v-model="searchQuery"  density="compact" label="Search by Date or Time" single-line hide-details/>
            </v-toolbar>
          </template>
          <template v-slot:item.schedule_time="{ item }">{{ formatDate(item.schedule_time) }}</template>
          <template v-slot:item.deleted_at="{ item }">
                                <v-chip color="warning" size="small" v-if="item.deleted_at">Occupied</v-chip>
                                <v-chip color="success" size="small" v-else>Available</v-chip>
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
import { computed, onMounted, ref, watch } from 'vue';
import Appbar from './layouts/Appbar.vue'
import axios from 'axios';
import { BASE_URL } from '@/server';
import dayjs from 'dayjs';

const breadCrumbsItems = ref([
    { title: 'Dashboard', href: '/doctor/dashboard', disabled: false },
    { title: 'Schedule', href: '/doctor/dashboard', disabled: true },
]);
const data = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);
const snackbar = ref(false);
const text = ref('');
const color = ref('');
const icon = ref('');
const message = ref('Are you sure to remove this account from the system?');

const pagination = ref({
    rowsPerPage: 10,
    page: 1,
});

const headers = [
    { title: 'Schedule', value: 'schedule_time', align: 'left' },
    { title: 'Status', value: 'deleted_at', align: 'end' },
];

const fetchData = async () => {
    try {
        isLoading.value = true;
        const token = localStorage.getItem('vetToken');
        const response = await axios.get(BASE_URL + '/vet/schedule', {
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
};

const editItem = (item) => {
    console.log('Edit item:', item);
  // Implement edit functionality here
};

const viewItem = (item) => {
    console.log('View item:', item);
  // Implement view functionality here
};

const deleteItem = async (userId) => {
    try {
        isLoading.value = true;
        const token = localStorage.getItem('adminToken');
        // eslint-disable-next-line no-unused-vars
        const response = await axios.delete(BASE_URL + '/api/admin/user/' + userId, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        snackbar.value = true
        color.value = 'success'
        icon.value = 'mdi-check'
        text.value = 'Deleted Successfully'
        fetchData();
    } catch (error) {
        console.error('Error deleting user:', error);
    } finally {
        isLoading.value = false;
    }
};

const formatDate = (dateTime) => {
    return dayjs(dateTime).format('dddd, MMMM D, YYYY hh:mm A');
};

const totalResults = computed(() => {
    return data.value.length;
});

const filteredData = computed(() => {
  if (!data.value) return []; // Ensure data is defined before filtering
    const search = searchQuery.value.toLowerCase();
    return data.value.filter(item =>
      formatDate(item.schedule_time).includes(search)
    );
});

watch([searchQuery, pagination], () => {
  pagination.value.page = 1; // Reset to the first page on search
});

onMounted(fetchData);
</script>
