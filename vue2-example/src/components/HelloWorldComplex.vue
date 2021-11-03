<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="6">
        <v-text-field
          v-model="form.id"
          append-icon="mdi-magnify"
          label="Id"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="form.title"
          append-icon="mdi-magnify"
          label="Title"
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
import { GenericDictionnary, VDUSDatatableOptions, VDUSFormSchema } from 'vue-datatable-url-sync/src/utils/VDUSTypes';
import fakeData from "./data";
import { ref } from '@vue/composition-api'

export default Vue.extend({
  name: 'HelloWorldComplex',
  data: () => ({
    headers: [
      { text: 'Id', value: 'id' },
      { text: 'Title', value: 'title' },
    ],
    fakeData
  }),
  setup (_, ctx) {

    const formSchema: VDUSFormSchema = {
      "title": {name: "title_overrided"}
    }
    // --------------------- DATA ------------------------------------
    const form = ref<GenericDictionnary>({
      id: "",
      title: ""
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
    const {vuetifyOptions} = useDatatableUrlSync(ctx.root.$route, ctx.root.$router, form, fetchDatas, options, formSchema)

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
