<template>
  <div class="container">
    <div class="mt-8">
      Datatable
    </div>
    <div class="mt-8 row"> 
      <div
        v-for="header in headers"
        :key="header"
        class="col width-40 border-right border-bottom"
      >
        <p>{{ header }}</p>
        <BaseOrdering
          :field="header"
          :value="options.ordering"
          @input="emitOptions('ordering', $event)"
        />
      </div>
    </div>
    <div
      v-for="item in currentItems"
      :key="item[itemKey]"
      class="row"
    >
      <div
        v-for="(value, key) in item"
        :key="key"
        class="col width-40 border-right"
      >
        <p>{{ value }}</p>
      </div>
    </div>
    <div class="mt-4 row">
      <div class="col width-40">
        <label>Item per page: </label>
        <select
          :modelValue="options.page_size"
          @change="emitOptions('page_size', parseInt($event.target.value))"
        >
          <option
            v-for="itemNumber in [5, 10, 20]"
            :key="itemNumber"
            :selected="options.page_size === itemNumber"
            :value="itemNumber"
          >
            {{ itemNumber }}
          </option>
        </select>
      </div>

      <div class="col width-40">
        <button
          v-if="options.page > 1"
          @click="emitOptions('page', options.page-1)"
        >
          Prev. page
        </button>
        <button
          v-if="lastVisibleIndex < items.length"
          @click="emitOptions('page', options.page+1)"
        >
          Next page
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import BaseOrdering from "./BaseOrdering";

export default {
  name: "SimpleDatatable",
  components: {
    BaseOrdering
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => []
    },
    itemKey: {
      type: String,
      default: "id"
    },
    options: {
      type: Object,
      default: () => ({
        page: 1,
        page_size: 10,
        ordering: []
      })
    }
  },
  emits: ['update:options'],
  computed: {
    firstVisibleIndex() {
      return ((this.options.page ?? 1) - 1) * this.options.page_size ?? 10;
    },
    lastVisibleIndex() {
      return (this.options.page ?? 1) * this.options.page_size ?? 10;
    },
    currentItems() {
      if(this.lastVisibleIndex > this.items.length) {
        return this.items.slice(this.firstVisibleIndex)
      }
      return this.items.slice(this.firstVisibleIndex, this.lastVisibleIndex)
    }
  },
  methods: {
    emitOptions(optionKey, value) {
      const newOptions = {
        ...this.options,
        [optionKey]: value
      }
      this.$emit("update:options", newOptions)
    }
  }
}
</script>

<style>
.container {
  width: 600px;
  margin: auto;
}
.row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
}
.col {
  display: flex;
  padding: 8px;
}
.width-40 {
  width: 40%;
}
.mt-8 {
  margin-top: 32px;
}
.mt-4 {
  margin-top: 16px;
}
.border-right {
  border-right: 1px solid;
}
.border-bottom {
  border-bottom: 1px solid;
}
</style>