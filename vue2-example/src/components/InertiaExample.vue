<template>

  <v-row>

    <v-col cols="12">
      <InertiaDatatable :items="items" :headers="headers" :withSearch="true">
        <template #item="{ item }">
          <v-row>
            <v-col>
              {{item.id}}
            </v-col>
            <v-col>
              {{item.title}}
            </v-col>
          </v-row>
        </template>
      </InertiaDatatable>
    </v-col>

  </v-row>
</template>

<script lang="ts">
import fakeData from "./data";
import InertiaDatatable from "./InertiaDatatable.vue"
import Vue from 'vue';


export default Vue.extend({
  name: 'InertiaExample',
  components: {
    InertiaDatatable: InertiaDatatable,
  },
  data: () => ({
    items: fakeData,
    headers: [
      { text: 'Id', value: 'id' },
      { text: 'Title', value: 'title' },
    ],
  }),
})
</script>