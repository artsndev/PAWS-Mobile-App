<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app-bar flat color="deep-purple-darken-1">
    <template v-slot:prepend>
      <v-app-bar-nav-icon size="33" class="ms-2" @click="toggleMenu"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>My Dashboard</v-app-bar-title>
    <template v-slot:append>
      <v-dialog max-width="500" persistent v-model="addScheduledialog">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn icon="mdi-calendar-plus" v-bind="activatorProps"></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card>
            <v-toolbar color="transparent">
              <v-toolbar-title>Add Schedule</v-toolbar-title>
              <v-spacer></v-spacer>
                <v-btn icon="mdi-close"  @click="isActive.value = false"></v-btn>
            </v-toolbar>
            <v-container>
                <v-form @submit.prevent="addSchedule" class="mt-n2">
                    <v-text-field :error-messages="schedule_time_error" type="datetime-local" v-model="form.schedule_time" density="compact" label="Schedule" variant="outlined"></v-text-field>
                    <v-btn type="submit" color="primary" class="text-capitalize mt-1">Submit</v-btn>
                </v-form>
            </v-container>
        </v-card>
        </template>
      </v-dialog>
    </template>
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
    <v-snackbar :timeout="2000" v-model="snackbar" color="success">
      <v-icon icon="mdi-check" class="px-2"></v-icon>
        {{ text }}
    </v-snackbar>
</template>

<script setup>
import { BASE_URL } from '@/server';
import axios from 'axios';
import { reactive } from 'vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const drawer = ref(false);
const toggleMenu = () => {
  drawer.value = !drawer.value;
}

const navDrawitems = ref([
  { icon: 'mdi-chart-donut', text: 'Dashboard', routeName: 'Vet Dashboard' },
  { icon: 'mdi-clipboard-text-multiple-outline', text: 'Appointments', routeName: 'Vet Appointment'},
  { icon: 'mdi-account-multiple-outline', text: 'Schedule', routeName: 'Vet Schedule'},
  { icon: 'mdi-account-multiple-outline', text: 'Users', routeName: 'Vet User'},
  { icon: 'mdi-clipboard-check-multiple-outline', text: 'Queued', routeName: 'Vet Queue'},
]);

const router = useRouter();

const name = ref('');
const email = ref('');

const loadUser = async () => {
  try {
    const token = localStorage.getItem('vetToken')
    const response = await axios.get(BASE_URL + '/vet/data', {
      headers : {
        Authorization: `Bearer ${token}`
      }
    })
    name.value = response.data.name
    email.value = response.data.email
    console.log(name.value)
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.removeItem('vetToken');
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
        const token = localStorage.getItem('vetToken');
        await axios.post(BASE_URL + '/vet/logout', null, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        localStorage.removeItem('vetToken');
        router.push({ name: 'Login' });
    } catch (error) {
        console.error(error);
    }
};

const snackbar = ref(false)
const text = ref('')

const schedule_time_error = ref('')

const timer = ref(null)

const form = reactive({
    schedule_time: ''
})

const addScheduledialog = ref(false)

const addSchedule = async () => {
    try {
        const formData = new FormData();
        formData.append('schedule_time', form.schedule_time);
        const token = localStorage.getItem('vetToken')
        const response = await axios.post(BASE_URL + '/vet/schedule', formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
        const clearValidationError = () => {
            schedule_time_error.value = ''
        }
        const setValidationError = () => {
            clearValidationError()
            timer.value = setTimeout(() => {
                schedule_time_error.value = response.data.errors.schedule_time
            }, 1)
            setTimeout(() => {
                clearValidationError();
            }, 10000);
        }
        if (response.data.success) {
            snackbar.value = true
            text.value = "Submitted Successfully."
            addScheduledialog.value = false
            // location.reload()
            router.push('/vet/schedules')
        } else {
            setValidationError()
        }
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
  loadUser()
})

</script>
