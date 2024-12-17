<template>
  <button @click="emitOrdering">
    {{ buttonText }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Array as () => string[],
    required: true
  },
  field: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'input', value: string[]): void
}>()

const valueField = computed(() => {
  const firstVal = props.value[0]
  if (firstVal && firstVal.startsWith("-")) {
    return firstVal.substring(1)
  }
  return firstVal
})

// const isDesc = computed(() => valueField.value === props.field && props.value[0]?.startsWith("-"))
const isAsc = computed(() => valueField.value === props.field && !props.value[0]?.startsWith("-"))
const isEmptyString = computed(() => valueField.value !== props.field)

const buttonText = computed(() => {
  if (isEmptyString.value) {
    return "Order Asc"
  } else if (isAsc.value) {
    return "Order Desc"
  }
  return "Cancel Order"
})

function emitOrdering() {
  let emitValue: string[] = []
  if (isEmptyString.value) {
    // currently no ordering, set to ascending
    emitValue = [props.field]
  } else if (isAsc.value) {
    // currently ascending, set to descending
    emitValue = [`-${props.field}`]
  } 
  // else if isDesc: currently descending, clear the ordering (empty array)

  emit('input', emitValue)
}
</script>
