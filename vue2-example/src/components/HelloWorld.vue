<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="fakeData"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import useDatatableUrlSync from 'vue-datatable-url-sync';
import fakeData from "./data";
export default {
  name: 'HelloWorld',

  data: () => ({
    headers: [
      { text: 'Id', value: 'id' },
      { text: 'Title', value: 'title' },
    ],
    fakeData
  }),
}
</script>
