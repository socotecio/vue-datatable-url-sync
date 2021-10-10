<template>

  <v-row>

    <!-- THE SEARCH -->
    <v-col cols="12" v-if="withSearch">
      <v-row justify="end">
        <v-col cols="12" md="6" lg="4" xl="3">
          <v-text-field
            v-model="form.search"
            append-icon="search"
            label="SEARCH"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>

    <!-- THE TABLE -->
    <v-col cols="12">
      <v-data-table
        :mobile-breakpoint="0"
        :items="items"
        :headers="headers"
        :search="form.search"
        :options.sync="vuetifyOptions"
        :footer-props="footerProps"
        class="elevation-1"
      >
        <template #item="{ item }">
          <slot name="item" :item="item"/>
        </template>

        <template #no-results>
          <v-alert color="warning" icon="warning" outlined>
            No results found for '{{form.search}}'
          </v-alert>
        </template>

      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import useDatatableUrlSync from 'vue-datatable-url-sync';
import { GenericDictionnary, VDUSDatatableOptions } from 'vue-datatable-url-sync/src/utils/VDUSTypes';
import { ref } from '@vue/composition-api'
import Vue from 'vue';

export default Vue.extend({
    name: 'InertiaDatatable',
    props: {
      items: Array,
      headers: Array,
      sortBy: {
        type: [String, Array],
        default: () => []
      },
      withSearch: {
        type: Boolean,
        default: false
      },
      sortDesc: {
        type: [Array],
        default: () => []
      },
    },
    data: () => ({
      footerProps: {
        'items-per-page-options': [10, 25, 50, -1],
        'items-per-page-text': 'Per page',
        'items-per-page-all-text': 'All'
      },
      itemsPerPage: 10,
    }),
  setup (props, ctx) {
    // --------------------- DATA ------------------------------------
    const form = ref<GenericDictionnary>({
      search: ""
    })
    const options = ref<VDUSDatatableOptions>({
        page: 1,
        page_size: 10,
        ordering: []
    })

    // --------------------- METHODS ------------------------------------
    const fetchDatas = (queryParams: string, queryAsObject: GenericDictionnary) => {
      // Vuetify do all the front filtering for us so fetchDatas can be a dummy function. 
      // If you are doing a backend filtering you have to adapt this function to fetch the data correctly filtered and paginated by your backend
      console.log(queryParams, queryAsObject)
    }

    // --------------------- CREATED ------------------------------------
    const {vuetifyOptions} = useDatatableUrlSync(ctx.root.$route, ctx.root.$router, form, fetchDatas, options)

    vuetifyOptions.value = {
      ...vuetifyOptions.value,
      sortBy: props.sortBy as any,
      sortDesc: props.sortDesc as any
    }

    // --------------------- INSTANCE ------------------------------------
    return {
      vuetifyOptions,
      form,
      options
    }
  }
  })
</script>