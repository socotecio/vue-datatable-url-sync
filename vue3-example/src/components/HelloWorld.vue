<template>
  <div class="container">
    <h3>Test Vue Datatable Url Sync</h3>
    <p>The order is alphabetical but this is the example behavior you can implement what you want</p>

    <div class="row mt-8">
      <label for="search">Search: </label>
      <input
        id="search"
        v-model="form.search"
      >
    </div>

    <SimpleDatatable
      v-model:options="options"
      :items="items"
      :headers="['id', 'title']"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useDatatableUrlSync from 'vue-datatable-url-sync/useDatatableUrlSync';
import fakeData from "./data";
import SimpleDatatable from './SimpleDatatable.vue';
import {GenericDictionnary} from "vue-datatable-url-sync";

type FakeDataItem = {
  id: string,
  title: string,
}

export default defineComponent({
  name: 'HelloWorld',
  components: {
    SimpleDatatable
  },
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
    const filterData = (fakeData: Array<FakeDataItem>, queryAsObject: GenericDictionnary): Array<FakeDataItem> => {
      if (typeof queryAsObject.search !== "undefined") {
        fakeData = fakeData.filter(data => {
          let respondToFilter: boolean = false;
          Object.values(data).forEach((value: any) => {
            if (value.includes(queryAsObject.search)) {
              respondToFilter = true
            }
          })
          return respondToFilter
        })
      }

      if (typeof queryAsObject.ordering !== "undefined") {
        // If multiple ordering you can loop on ordering
        let orderingKey: string = queryAsObject.ordering[0];
        const reverse: boolean = orderingKey.startsWith("-")
        if (reverse) {
          orderingKey = orderingKey.replace("-", "")
        }

        fakeData = fakeData.sort((a: GenericDictionnary, b: GenericDictionnary) => {
          if(reverse) {
            return a[orderingKey].localeCompare(b[orderingKey])
          }
          return b[orderingKey].localeCompare(a[orderingKey])
        })
      }

      return fakeData
    }

    const fetchDatas = (queryParams: string, queryAsObject: GenericDictionnary) => {
      items.value = filterData(fakeData, queryAsObject)
    }

    // --------------------- CREATED ------------------------------------
    useDatatableUrlSync(form, fetchDatas, options)

    // --------------------- INSTANCE ------------------------------------
    return {
      form,
      options,
      items
    }
  }
});
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
