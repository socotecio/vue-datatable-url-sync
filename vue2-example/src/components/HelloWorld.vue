<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-text-field
          v-model="form.search"
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

<script lang="ts">
import Vue from 'vue';
import useDatatableUrlSync from 'vue-datatable-url-sync';
import { GenericDictionnary } from 'vue-datatable-url-sync/src/utils/VDUSTypes';
import fakeData from "./data";
import { ref } from '@vue/composition-api'

export default Vue.extend({
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

    // --------------------- METHODS ------------------------------------
    const fetchDatas = (queryParams: string, queryAsObject: GenericDictionnary) => {
      console.log("icicicicic", queryParams, queryAsObject)
      // items.value = fakeData
    }

    // --------------------- CREATED ------------------------------------
    const {vuetifyOptions} = useDatatableUrlSync(form, fetchDatas, options)

    // --------------------- INSTANCE ------------------------------------
    return {
      vuetifyOptions,
      form,
      options,
      items
    }
  }
});
</script>
