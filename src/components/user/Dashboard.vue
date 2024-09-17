<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Appbar/>
  <h1>Hello, {{ name }}</h1>
</template>

<script setup>
import axios from 'axios';
import Appbar from './layouts/Appbar.vue'
import { BASE_URL } from '@/server';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

const router = useRouter()

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

onMounted(() => {
  loadUser()
})
</script>
