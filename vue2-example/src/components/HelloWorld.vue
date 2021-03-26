<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="fakeData"
          :options.sync="vuetifyOptions"
          class="elevation-1"
          :search="search"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import useDatatableUrlSync from 'vue-datatable-url-sync';
import fakeData from "./data";
import { ref } from '@vue/composition-api'

export default {
  name: 'HelloWorld',

  data: () => ({
    headers: [
      { text: 'Id', value: 'id' },
      { text: 'Title', value: 'title' },
    ],
    fakeData
  }),
  setup () {
    // --------------------- DATA ------------------------------------
    const form = ref({
      search: ""
    })
    const options = ref({
        page: 1,
        page_size: 10,
        ordering: []
    })
    const items = ref<any>([])
  }
}
</script>
