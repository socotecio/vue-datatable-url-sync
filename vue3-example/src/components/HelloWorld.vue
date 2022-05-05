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

        <select name="answered" id="answered-select" v-model="form.is_answered">
            <option :value="null">Not answered</option>
            <option :value="false">Answer is false</option>
            <option :value="true">Answer is true</option>
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

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useDatatableUrlSync from 'vue-datatable-url-sync';
import { GenericDictionnary, VDUSDatatableOptions, VDUSFormSchema } from 'vue-datatable-url-sync/src/utils/VDUSTypes';
// import useDatatableUrlSync from '../../../src/useDatatableUrlSync';
// import { GenericDictionnary, VDUSDatatableOptions, VDUSFormSchema } from '../../../src/utils/VDUSTypes';
import fakeData from "./data.js";
import SimpleDatatable from './SimpleDatatable.vue';
import { useRoute, useRouter } from "vue-router";

type FakeDataItem = {
  id: string;
  title: string;
  is_answered: boolean;
}

export default defineComponent({
  name: 'HelloWorld',
  components: {
    SimpleDatatable
  },
  setup () {
    // --------------------- DATA ------------------------------------
    const form = ref<GenericDictionnary>({
      search: "",
      is_answered: false
    })
    const options = ref<VDUSDatatableOptions>({
        page: 1,
        page_size: 10,
        ordering: []
    })
    const items = ref<any>([])

    const formSchema = ref<VDUSFormSchema>({
      is_answered: { type: "nullBoolean", default: false }
    })

    // --------------------- METHODS ------------------------------------
    const filterData = (fakeData: Array<FakeDataItem>, queryAsObject: GenericDictionnary): Array<FakeDataItem> => {
      if (typeof queryAsObject.search !== "undefined") {
        fakeData = fakeData.filter(data => {
          let respondToFilter = false;
          Object.values(data).forEach((value: any) => {
            if(typeof(value) !== "string") {
              value = `${value}`
            }
            if (value.includes(queryAsObject.search)) {
              respondToFilter = true
            }
          })
          return respondToFilter
        })
      }
      if (typeof queryAsObject.is_answered !== "undefined") {
        fakeData = fakeData.filter(data => {
          return data.is_answered === queryAsObject.is_answered
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
            return `${a[orderingKey]}`.localeCompare(b[orderingKey])
          }
          return `${b[orderingKey]}`.localeCompare(a[orderingKey])
        })
      }

      return fakeData
    }

    const fetchDatas = (queryParams: string, queryAsObject: GenericDictionnary) => {
      items.value = filterData(fakeData, queryAsObject)
    }

    // --------------------- CREATED ------------------------------------
    useDatatableUrlSync(useRoute(), useRouter(), form, fetchDatas, options, formSchema.value)

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
