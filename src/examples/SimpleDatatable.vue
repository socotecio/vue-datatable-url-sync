<template>
  <div>
    Datatable
  </div>
  <div>
    <div v-for="item in items" :key="item[itemKey]">
      <div v-for="(value, key) in item" :key="key">
        {{key}}: {{value}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SimpleDatatable",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemKey: {
      type: String,
      default: "id"
    }
  }
}
</script>

<style>

</style>