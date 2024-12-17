<template>
  <div class="container">
    <h3>Test Vue Datatable Url Sync</h3>
    <p>The order is alphabetical but this is the example behavior you can implement what you want</p>

    <div class="row mt-8">
      <div class="width-40">
        <label for="search">Search: </label>
        <input
          id="search"
          v-model="form.search"
        >
      </div>
      <div class="width-40">
        <label for="answered-select">Is answered: </label>

        <select
          id="answered-select"
          v-model="form.is_answered"
          name="answered"
        >
          <option :value="null">
            Not answered
          </option>
          <option :value="false">
            Answer is false
          </option>
          <option :value="true">
            Answer is true
          </option>
        </select>
      </div>
    </div>

    <SimpleDatatable
      v-model:options="options"
      :items="items"
      :headers="['id', 'title', 'is_answered']"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useDatatableUrlSync from 'vue-datatable-url-sync';
import type { GenericDictionnary, VDUSDatatableOptions, VDUSFormSchema } from 'vue-datatable-url-sync/src/utils/VDUSTypes';
import fakeData from "../assets/data/data.js";
import { useRoute, useRouter } from "vue-router";

type FakeDataItem = {
  id: string;
  title: string;
  is_answered: boolean;
};

// --------------------- DATA ------------------------------------
const form = ref<GenericDictionnary>({
  search: "",
  is_answered: true
});

const options = ref<VDUSDatatableOptions>({
  page: 1,
  page_size: 10,
  ordering: []
});

const items = ref<FakeDataItem[]>([]);

const formSchema = ref<VDUSFormSchema>({
  is_answered: { type: "boolean" }
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
useDatatableUrlSync(useRoute(), useRouter(), form, fetchDatas, options, formSchema.value);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

