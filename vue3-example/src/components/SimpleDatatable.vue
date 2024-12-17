<template>
  <div class="container">
    <div class="mt-8">
      Datatable
    </div>
    <div class="mt-8 row"> 
      <div
        v-for="header in headers"
        :key="header"
        class="col width-30 border-right border-bottom"
      >
        <p>{{ header }}</p>
        <BaseOrdering
          :field="header"
          :value="options.ordering"
          @input="(value: string[]) => emitOptions('ordering', value)"
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
        class="col width-30 border-right"
      >
        <p>{{ value }}</p>
      </div>
    </div>
    <div class="mt-4 row">
      <div class="col width-40">
        <label>Item per page: </label>
        <select
          :value="options.page_size"
          @change="($event) => emitOptions('page_size', parseInt($event.target?.value))"
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
          @click="emitOptions('page', options.page - 1)"
        >
          Prev. page
        </button>
        <button
          v-if="lastVisibleIndex < items.length"
          @click="emitOptions('page', options.page + 1)"
        >
          Next page
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Item {
  [key: string]: any
}

interface Options {
  page: number
  page_size: number
  ordering: string[]
}

const props = defineProps({
  items: {
    type: Array<Item>,
    default: () => []
  },
  headers: {
    type: Array<string>,
    default: () => []
  },
  itemKey: {
    type: String,
    default: "id"
  },
  options: {
    type: Object as () => Options,
    default: () => ({
      page: 1,
      page_size: 10,
      ordering: []
    })
  }
})

const emit = defineEmits<{
  (e: 'update:options', value: Options): void;
}>()

const firstVisibleIndex = computed(() => ((props.options.page ?? 1) - 1) * (props.options.page_size ?? 10))
const lastVisibleIndex = computed(() => (props.options.page ?? 1) * (props.options.page_size ?? 10))

const currentItems = computed(() => {
  if (lastVisibleIndex.value > props.items.length) {
    return props.items.slice(firstVisibleIndex.value)
  }
  return props.items.slice(firstVisibleIndex.value, lastVisibleIndex.value)
})

function emitOptions<K extends keyof Options>(optionKey: K, value: Options[K]) {
  const newOptions = {
    ...props.options,
    [optionKey]: value
  }
  emit("update:options", newOptions)
}
</script>

<style scoped>
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
.width-30 {
  width: 30%;
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
