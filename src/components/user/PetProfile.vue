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
    <v-footer class="position-bottom">
      <v-dialog v-model="addAppointment" transition="dialog-bottom-transition" fullscreen>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn block v-bind="activatorProps" color="blue-darken-4 sticky-bottom" rounded="lg">Request For Appointment</v-btn>
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
                <v-text-field v-model="form.pet_id" class="d-none"  label="Hello"></v-text-field>
                <v-text-field v-model="form.veterinarian_id" class="d-none"  label="Hello"></v-text-field>
                <v-text-field v-model="form.schedule_id" class="d-none"  label="Hello"></v-text-field>
                <v-select class="mb-2" :error-messages="appointment_error" color="primary" v-model="form.appointment_time" density="compact" clearable chips label="Select a schedule" :items="scheduleItem" variant="outlined" ></v-select>
                <!-- <v-select class="mb-2" :error-messages="appointment_session_error" v-model="form.session_of_appointment" color="primary" variant="outlined" density="compact" :items="items" label="Select a Session of appointment" multiple>
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index < 1">
                      <span>{{ item.title }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="text-grey text-caption align-self-center">
                      (+{{ form.session_of_appointment.length - 1 }} others)
                    </span>
                  </template>
                </v-select> -->
                <v-textarea :error-messages="appointment_purpose_error" v-model="form.purpose_of_appointment" label="Purpose of Appointment. *" density="compact" :counter="300" class="mb-2" rows="3" variant="outlined" persistent-counter color="primary" auto-grow></v-textarea>
                <v-btn color="primary" block type="submit" class="text-decoration-none">Submit a Request</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-footer>
    <v-snackbar :timeout="2000" v-model="snackbar" color="success">
      <v-icon icon="mdi-check" class="px-2"></v-icon>
        {{ text }}
    </v-snackbar>
</template>

<script setup>
import AppBar from './layouts/Appbar.vue';
import { ref, onMounted, reactive } from 'vue';
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

const petsId = ref(null)

const router = useRouter()

const formatDate = (dateTime) => {
    return dayjs(dateTime).format('dddd, MMMM D, YYYY hh:mm A');
};

const loadUser = async () => {
  try {
    const token = localStorage.getItem('userToken')
    const response = await axios.get(BASE_URL + '/user/pet/'+petsId.value, {
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

const petId = ref(null)
const veterinarianId = ref(null)
const schedId = ref(null)
const appointment_error = ref('')
const appointment_session_error = ref('')
const appointment_purpose_error = ref('')
const error = ref('')
const timer = ref(null)
const form = reactive({
  pet_id: petId,
  veterinarian_id: veterinarianId,
  schedule_id: schedId,
  appointment_time: null,
  purpose_of_appointment: '',
  session_of_appointment: [],
})
const addAppointment = ref(false)
const createAppointment = async () => {
  try {
    const formData = new FormData();
    formData.append('pet_id', form.pet_id);
    formData.append('veterinarian_id', form.veterinarian_id);
    formData.append('schedule_id', form.schedule_id);
    formData.append('appointment_time', formattedDate(form.appointment_time));
    formData.append('purpose_of_appointment', form.purpose_of_appointment);
    formData.append('session_of_appointment', form.session_of_appointment.join(', '));
    const token = localStorage.getItem('userToken');
    const response = await axios.post(BASE_URL + '/user/appointment', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const clearValidationErrors = () => {
      appointment_error.value = '';
      appointment_session_error.value = '';
      appointment_purpose_error.value = '';
    }

    const clearErrorValidation = () => {
      error.value = '';
    }

    const setValidationError = () => {
      clearValidationErrors();
      timer.value = setTimeout(() => {
        appointment_error.value = response.data.errors.appointment_time;
        appointment_session_error.value = response.data.errors.purpose_of_appointment;
        appointment_purpose_error.value = response.data.errors.session_of_appointment;
      }, 1);
      setTimeout(() => {
        clearValidationErrors();
      }, 10000);
    }

    const setErrorValidation = () => {
      clearErrorValidation();
      setTimeout(() => {
        error.value = response.data.message;
      }, 1);
      setTimeout(() => {
        clearErrorValidation();
      }, 10000);
    }
    if(response.data.success){
      snackbar.value = true
      addAppointment.value = false
      // scheduleItem.value = scheduleItem.value.filter(time => time !== formatDate(form.appointment_time));
      router.push({
        name: 'Session'
      })
    } else {
      if (response.data.errors) {
        setValidationError();
      } else {
        setErrorValidation();
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const route = useRoute()

onMounted(() => {
  petsId.value = route.params.id
  loadUser()
})
</script>

<style scoped>
.fs-10{
  font-size: 15px;
}
</style>
