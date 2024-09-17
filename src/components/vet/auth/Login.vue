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
    <v-row align="center" justify="center" class=" px-2 mt-5 mb-16" >
      <v-col cols="12" sm="8" md="8" lg="4" xl="3" xxl="4">
        <div class="mb-9" color="primary">
          <h2 class="font-weight-bold mt-3 text-center">Welcome Back vet!</h2>
          <p class="mt-2 mb-6 text-center">Glad to see you again 🥰</p>
          <v-alert v-if="error" icon="mdi-alert"  variant="tonal" class="mb-5"  color="red-darken-4">
            {{ error }}
          </v-alert>
          <v-form @submit.prevent="login">
            <v-text-field density="compact" prepend-inner-icon="mdi-email-outline" v-model="form.email" label="Email Address" placeholder="Example: rubickking04@gmail.com" variant="outlined" class="mb-1" :error-messages="email_error" clearable color="purple-lighten-2"></v-text-field>
            <v-text-field density="compact" prepend-inner-icon="mdi-lock-outline" v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password" hint="Must be 8-20 characters long." clearable variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="togglePasswordVisibility" :error-messages="password_error" color="purple-lighten-2"></v-text-field>
            <v-row no-gutters>
              <v-col cols="6">
                <div class="text-start">
                  <v-checkbox v-model="form.remember" label="Remember me" color="purple-lighten-2" class="small" hide-details></v-checkbox>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-subtitle-1 text-medium-emphasis justify-space-between mt-4 text-end">
                  <a class="text-caption text-decoration-none text-purple-lighten-3" href="#" rel="noopener noreferrer" target="_blank">
                    Forgot login password?
                  </a>
                </div>
              </v-col>
            </v-row>
            <v-row class="text-center">
              <v-col>
                <v-btn type="submit" :disabled="isLoading" :loading="isLoading" color="purple-lighten-2" class="mb-2 text-capitalize" block rounded="xs">
                  Sign in
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
          <div class="text-center">
              <p class="text-muted mt-4">Don't have an account? <RouterLink to="/vet/register" class="text-decoration-none text-purple-lighten-3"><span>Register here</span></RouterLink></p>
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
  email: '',
  password: '',
  remember: '',
});

const error = ref('')
const email_error = ref('')
const password_error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const timer = ref(null)

const login = async () => {
  try {
    isLoading.value = true;
    const response = await axios.post(BASE_URL + '/vet/login', form);

    const clearValidationErrors = () => {
      email_error.value = '';
      password_error.value = '';
    }

    const clearErrorValidation = () => {
      error.value = '';
    }

    const setValidationError = () => {
      clearValidationErrors();
      timer.value = setTimeout(() => {
        email_error.value = response.data.errors.email;
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
</script>


<style>
.fs-50 {
  font-size: 50px;
}</style>
