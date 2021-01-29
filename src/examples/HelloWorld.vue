<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>test</h3>

    {{form}}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useDatatableUrlSync from '../lib-components/useDatatableUrlSync';
import * as fakeData from "./data";

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup () {
    const form = {
      search: ""
    }

    const fetchDatas = (queryParams: string, queryAsObject: Object) => {
      console.log(queryParams, queryAsObject)
      return fakeData
    }

    useDatatableUrlSync(form, fetchDatas)

    return {
      form
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
