<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container class="py-16">
    <v-row align="center" justify="center" class="min-vh-100 px-2">
      <v-col cols="12" sm="8" md="8" lg="4" xl="3" xxl="4">
        <div class="text-center">
          <!-- Image Section -->
          <img src="@/assets/logo/logo.jpg"  alt="avatar" class="mb-1" height="165" width="165">
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-sheet class="d-flex align-end  mx-auto px-4 min-vh-100" color="deep-purple-darken-1" elevation="4" max-width="800" width="100%" style="border-top-left-radius: 30px; border-top-right-radius: 30px;">
    <v-row align="center" justify="center" class=" px-2 mt-5 mb-3" >
      <v-col cols="12" sm="8" md="8" lg="4" xl="3" xxl="4">
        <div class="mb-9" color="primary">
          <h2 class="font-weight-bold mt-3 text-center">Veterinarian Register!</h2>
          <p class="mt-2 mb-6 text-center">Create your free vetaccount now.</p>
          <v-alert v-if="error" icon="mdi-alert"  variant="tonal" class="mb-5"  color="red-darken-4">
            {{ error }}
          </v-alert>
          <v-form @submit.prevent="register">
            <v-text-field density="compact" prepend-inner-icon="mdi-account-outline" v-model="form.name" label="Full Name" placeholder="Juan Dela Cruz" variant="outlined" :error-messages="name_error" clearable color="purple-lighten-2"></v-text-field>
            <v-text-field density="compact" prepend-inner-icon="mdi-email-outline" v-model="form.email" label="Email Address" placeholder="Example: rubickking04@gmail.com" variant="outlined" class="mb-1" :error-messages="email_error" clearable color="purple-lighten-2"></v-text-field>
            <v-text-field density="compact" prepend-inner-icon="mdi-lock-outline" v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password" hint="Must be 8-20 characters long." clearable variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="togglePasswordVisibility" :error-messages="password_error" color="purple-lighten-2"></v-text-field>
            <v-text-field density="compact" prepend-inner-icon="mdi-lock-outline" v-model="form.password_confirmation" :type="showConfirmPassword ? 'text' : 'password'" label="Confirm Password" class="mb-2" hint="Must be matched with your password." clearable variant="outlined" :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="toggleConfirmPasswordVisibility" :error-messages="confirm_password_error" color="purple-lighten-2"></v-text-field>
            <v-row class="text-center">
              <v-col>
                <v-btn type="submit" :disabled="isLoading" :loading="isLoading" color="purple-lighten-2" class="mb-2 text-capitalize" block rounded="xs">
                  Sign up
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
          <div class="text-center">
              <p class="text-muted mt-4">Already have an account? <RouterLink to="/login" class="text-decoration-none text-purple-lighten-2"><span>Login here</span></RouterLink></p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios';
import { useRouter } from 'vue-router';
import { BASE_URL } from '@/server';

const router = useRouter();

const form = reactive({
  name: '',
  email: '',
  address: '',
  birthdate: null,
  specialization: '',
  phone_number: '',
  password: '',
  password_confirmation: '',
});

const error = ref('')
const name_error = ref('')
const email_error = ref('')
const birthdate_error = ref('')
const address_error = ref('')
const specialization_error = ref('')
const phone_number_error = ref('')
const password_error = ref('')
const confirm_password_error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const timer = ref(null)

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(d);
}


const register = async () => {
  try {
    isLoading.value = true;
    const formData = new FormData();
        formData.append('name', form.name);
        formData.append('email', form.email);
        formData.append('address', form.address);
        formData.append('birthdate', formatDate(form.birthdate));
        formData.append('specialization', form.specialization);
        formData.append('phone_number', form.phone_number);
        formData.append('password', form.password);
        formData.append('password_confirmation', form.password_confirmation);
    const response = await axios.post(BASE_URL + '/vet/register', formData);

    const clearValidationErrors = () => {
      name_error.value = '';
      email_error.value = '';
      birthdate_error.value = '';
      address_error.value = '';
      phone_number_error.value = '';
      specialization_error.value = '';
      password_error.value = '';
    }

    const clearErrorValidation = () => {
      error.value = '';
    }

    const setValidationError = () => {
      clearValidationErrors();
      timer.value = setTimeout(() => {
        name_error.value = response.data.errors.name;
        email_error.value = response.data.errors.email;
        birthdate_error.value = response.data.errors.birthdate;
        address_error.value = response.data.errors.address;
        phone_number_error.value = response.data.errors.phone_number;
        specialization_error.value = response.data.errors.specialization;
        password_error.value = response.data.errors.password;
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
      localStorage.setItem('vetToken', response.data.data.vetToken);
      router.push('/vet/dashboard');
    } else {
      if (response.data.errors) {
        setValidationError();
      } else {
        setErrorValidation();
      }
    }
  } catch (error) {
    console.log("Error Data: ", error);
  } finally {
    isLoading.value = false;
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
}
const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
}
</script>


<style>
.fs-30 {
    font-size: 30px;
}
</style>
