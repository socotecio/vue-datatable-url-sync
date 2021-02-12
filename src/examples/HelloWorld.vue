<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>test</h3>

    {{form}}

    <input v-model="form.search" />

    <SimpleDatatable :items="items" />

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useDatatableUrlSync from '../lib-components/useDatatableUrlSync';
import fakeData from "./data";
import SimpleDatatable from './SimpleDatatable.vue';

export default defineComponent({
  name: 'HelloWorld',
  components: {
    SimpleDatatable
  },
  props: {
    msg: String,
  },
  setup () {
    const form = ref({
      search: ""
    })
    const options = ref({})
    const items = ref<any>([])

    const fetchDatas = (queryParams: string, queryAsObject: Object) => {
      console.log("icicci", queryParams, queryAsObject)
      items.value = fakeData
    }

    useDatatableUrlSync(form, fetchDatas, options)

    return {
      form,
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
