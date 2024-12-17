<template>
  <v-row>
    <v-col cols="12">
      <v-form>
        <v-text-field
          v-model="form.search"
          label="search"
        />
        <v-checkbox
          v-model="form.is_answered"
          label="is Answered"
        />
      </v-form>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-card
        class="py-4"
        rounded="lg"
        variant="outlined"
      >
        <template #text>
          <v-data-table 
            v-model:options="vuetifyOptions"
            :items="items"
            :page="vuetifyOptions.page"
            :items-per-page="vuetifyOptions.itemsPerPage"
            :sort-by="vuetifyOptions.sortBy"
          />
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useDatatableUrlSync from '../../../src/useDatatableUrlSync';
import type { GenericDictionnary, VDUSDatatableOptions, VDUSFormSchema, VDUSConfiguration } from '../../../src/utils/VDUSTypes';
// import useDatatableUrlSync from 'vue-datatable-url-sync';
// import type { GenericDictionnary, VDUSDatatableOptions, VDUSFormSchema } from 'vue-datatable-url-sync/src/utils/VDUSTypes';
import fakeData from "../assets/data/data.js";
import { useRoute, useRouter } from "vue-router";

type FakeDataItem = {
  id: string;
  title: string;
  is_answered: boolean;
};

// --------------------- PROPS ------------------------------------
const props = defineProps({
  prefix: {
    type: String,
    default: ""
  },
})

// --------------------- DATA ------------------------------------
const form = ref<GenericDictionnary>({
  search: "",
  is_answered: false
});

const options = ref<VDUSDatatableOptions>({
  page: 1,
  page_size: 10,
  ordering: []
});

const configurations = ref<VDUSConfiguration>({
  prefix: props.prefix,
  serveurDefaultPageSize: 10,
})

const items = ref<FakeDataItem[]>([]);

const formSchema = ref<VDUSFormSchema>({
  is_answered: { type: "boolean" },
});

// --------------------- METHODS ------------------------------------
const filterData = (data: Array<FakeDataItem>, queryAsObject: GenericDictionnary): Array<FakeDataItem> => {
  let filteredData = data;

  // Filter by search
  if (typeof queryAsObject.search !== "undefined") {
    filteredData = filteredData.filter(item => {
      let respondToFilter = false;
      Object.values(item).forEach((value: unknown) => {
        const strValue = typeof value === "string" ? value : String(value);
        if (strValue.includes(queryAsObject.search)) {
          respondToFilter = true;
        }
      });
      return respondToFilter;
    });
  }

  // Filter by is_answered
  if (typeof queryAsObject.is_answered !== "undefined" && queryAsObject.is_answered !== null) {
    filteredData = filteredData.filter(item => item.is_answered === queryAsObject.is_answered);
  }

  // Ordering
  if (typeof queryAsObject.ordering !== "undefined" && queryAsObject.ordering.length > 0) {
    let orderingKey: string = queryAsObject.ordering[0];
    const reverse: boolean = orderingKey.startsWith("-");
    if (reverse) {
      orderingKey = orderingKey.replace("-", "");
    }

    filteredData = filteredData.sort((a: GenericDictionnary, b: GenericDictionnary) => {
      if (reverse) {
        return `${a[orderingKey]}`.localeCompare(b[orderingKey]);
      }
      return `${b[orderingKey]}`.localeCompare(a[orderingKey]);
    });
  }

  return filteredData;
};

const fetchDatas = (queryParams: string, queryAsObject: GenericDictionnary) => {
  items.value = filterData(fakeData, queryAsObject);
};

// --------------------- CREATED ------------------------------------
const {vuetifyOptions} = useDatatableUrlSync(useRoute(), useRouter(), form, fetchDatas, options, formSchema.value, null, configurations.value);
</script>
