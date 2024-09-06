<!-- eslint-disable vue/valid-template-root -->
<template>
  <div>
    <v-fab
      :icon="'mdi-pencil-outline'"
      :rounded="'lg'"
      class="me-5 mb-5"
      :color="'blue-grey-lighten-5'"
      @click="dialog"
      :location="'bottom right'"
      app
      sticky
      appear
    ></v-fab>

    <!-- Bind dialog visibility using v-model -->
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card title="Add a Schedule" prepend-icon="mdi-calendar-plus">
        <v-card-text>Add Schedule</v-card-text>
        <v-container>
          <v-form @submit.prevent="addSchedule">
            <v-text-field
              :error-messages="schedule_time_error"
              type="datetime-local"
              v-model="form.schedule_time"
              density="compact"
              label="Schedule"
              variant="outlined"
            ></v-text-field>
            <v-btn type="submit" color="primary" class="text-capitalize mt-2">Submit</v-btn>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Close Dialog</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const dialog = ref(false);
</script>

<style scoped>
.fab {
  position: fixed;
  bottom: 16px;
  right: 16px;
}
</style>
