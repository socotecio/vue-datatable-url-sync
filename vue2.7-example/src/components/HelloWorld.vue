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
          :search="form.search"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import useDatatableUrlSync from 'vue-datatable-url-sync';
import { GenericDictionnary, VDUSDatatableOptions } from 'vue-datatable-url-sync/src/utils/VDUSTypes';
// import useDatatableUrlSync from '../../../src/useDatatableUrlSync';
// import { GenericDictionnary, VDUSDatatableOptions, VDUSFormSchema } from '../../../src/utils/VDUSTypes';
import fakeData from "./data.js";
import { ref } from 'vue'
// import { useRouter, useRoute } from 'vue2-helpers/vue-router';
import { useRoute, useRouter } from "@/router/composable.js";

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
    const form = ref<GenericDictionnary>({
      search: ""
    })
    const options = ref<VDUSDatatableOptions>({
        page: 1,
        page_size: 10,
        ordering: []
    })
    const items = ref<any>([])

    // --------------------- METHODS ------------------------------------
    const fetchDatas = (queryParams: string, queryAsObject: GenericDictionnary) => {
      // Vuetify do all the front filtering for us so fetchDatas can be a dummy function. 
      // If you are doing a backend filtering you have to adapt this function to fetch the data correctly filtered and paginated by your backend
      console.log(queryParams, queryAsObject)
    }

    // --------------------- CREATED ------------------------------------
    // INFO - 11/04/2022 - If you don't need watch on route query change you can use ctx.root.$route, ctx.root.$router instead of vue2-helpers/vue-router to avoid installing an other dependency
    // See: https://github.com/socotecio/vue-datatable-url-sync/issues/5 and https://github.com/socotecio/vue-datatable-url-sync/pull/6/files
    const {vuetifyOptions} = useDatatableUrlSync(useRoute(), useRouter(), form, fetchDatas, options)

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
