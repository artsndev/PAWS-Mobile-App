<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app-bar flat color="deep-purple-darken-1">
    <template v-slot:prepend>
      <v-app-bar-nav-icon size="33" class="ms-2" @click="toggleMenu"></v-app-bar-nav-icon>
    </template>
    <v-dialog max-width="600" persistent v-model="addPetdialog">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn icon="mdi-plus" v-bind="activatorProps"></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card>
            <v-toolbar color="transparent">
              <v-toolbar-title>Add Pet</v-toolbar-title>
              <v-spacer></v-spacer>
                <v-btn icon="mdi-close"  @click="isActive.value = false"></v-btn>
            </v-toolbar>
            <v-container>
                <v-form @submit.prevent="addPet" class="mt-n2">
                  <file-pond
  v-model="form.avatar"
  class="mb-8"
  ref="pond"
  @change="onChange"
  label-idle="Add your pet avatar here..."
  :allow-multiple="false"
  :accepted-file-types="['image/jpeg', 'image/png']"
  :server="{
    url: BASE_URL + '/user/upload',
    process: {
      url: '/',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // Use reactive token value
      },
    },
  }"
  :files="myFiles"
  @init="handleFilePondInit"
/>
                  <v-text-field v-model="form.name" :error-messages="name_error" label="Pet's Name" variant="outlined" density="compact" color="primary"></v-text-field>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field v-model="form.species" :error-messages="species_error" label="Pet's Species" variant="outlined" density="compact" color="primary"></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field v-model="form.breed" :error-messages="breed_error" label="Pet's Breed" variant="outlined" density="compact" color="primary"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="mt-n5">
                    <v-col cols="6">
                      <v-select  v-model="form.sex" :error-messages="sex_error" :items="[ 'Male', 'Female']" label="Pet's Gender" variant="outlined" density="compact" color="primary"></v-select>
                    </v-col>
                    <v-col>
                      <v-text-field v-model="form.age" :error-messages="age_error" label="Pet's Age" variant="outlined" density="compact" color="primary"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-text-field v-model="form.color" :error-messages="color_error" label="Pet's Color" variant="outlined" density="compact" color="primary"></v-text-field>
                  <v-btn type="submit" color="primary" class="text-capitalize mt-1">Submit</v-btn>
                </v-form>
            </v-container>
        </v-card>
        </template>
      </v-dialog>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" flat color="deep-purple-darken-1">
    <div class="text-center mt-3">
      <v-avatar size="70" class="mx-auto">
        <img :src="avatar" alt="Avatar" style="object-fit: cover; width: 100%; height: 100%;">
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

</template>

<script setup>
import { BASE_URL } from '@/server';
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import avatar from '@/assets/images/avatar.png'
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Create component
const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
);

const token = ref(localStorage.getItem('userToken') || '');


const drawer = ref(false);
const toggleMenu = () => {
  drawer.value = !drawer.value;
}
const addPetdialog = ref(false)

const form = reactive({
  avatar: null,
  name: '',
  color: '',
  species: '',
  breed: '',
  age: '',
  sex: null,
})

const onChange = async (e) => {
    console.log("Pet Avatar : ", e.target.files[0]);
    form.avatar = e.target.files[0];
}
const snackbar = ref(false)
const text = ref('')
const timer = ref(null)

const name_error = ref('')
const breed_error = ref('')
const species_error = ref('')
const age_error = ref('')
const sex_error = ref('')
const color_error = ref('')

const addPet = async () => {
    try {
        const formData = new FormData();
        formData.append('avatar', form.avatar);
        formData.append('name', form.name);
        formData.append('breed', form.breed);
        formData.append('species', form.species);
        formData.append('color', form.color);
        formData.append('age', form.age);
        formData.append('sex', form.sex);
        const token = localStorage.getItem('userToken')
        const response = await axios.post(BASE_URL + '/user/pet', formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
        const clearValidationError = () => {
            name_error.value = ''
            breed_error.value = ''
            species_error.value = ''
            age_error.value = ''
            sex_error.value = ''
            color_error.value = ''
        }
        const setValidationError = () => {
            clearValidationError()
            timer.value = setTimeout(() => {
                name_error.value = response.data.errors.name
                breed_error.value = response.data.errors.breed
                species_error.value = response.data.errors.species
                age_error.value = response.data.errors.age
                sex_error.value = response.data.errors.sex
                color_error.value = response.data.errors.color
            }, 1)
            setTimeout(() => {
                clearValidationError();
            }, 10000);
        }
        if (response.data.success) {
            snackbar.value = true
            text.value = "Submitted Successfully."
            addPetdialog.value = false
            // location.reload()
            router.push('/pet')
        } else {
            setValidationError()
        }
    } catch (error) {
        console.log(error)
    }
}

const navDrawitems = ref([
  { icon: 'mdi-chart-donut', text: 'Dashboard', routeName: 'Home' },
  { icon: 'mdi-paw-outline', text: 'Pet', routeName: 'Pet'},
  { icon: 'mdi-history', text: 'History', routeName: 'History'},
  // { icon: 'mdi-account-outline', text: 'Profile', routeName: 'Vet Queue'},
]);

const router = useRouter();

const name = ref('');
const email = ref('');

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
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.removeItem('userToken');
      setTimeout(() => {
        location.reload()
        route.push({
          name: 'Login'
        })
      }, 3000)
    }
  }
}
const logout = async () => {
    try {
        const token = localStorage.getItem('userToken');
        await axios.post(BASE_URL + '/user/logout', null, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        localStorage.removeItem('userToken');
        router.push({ name: 'Login' });
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
  loadUser()
})

</script>
