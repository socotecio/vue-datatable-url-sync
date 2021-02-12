<template>
  <button @click="emitOrdering">{{buttonText}}</button>
</template>

<script>
export default {
  name: "BaseOrdering",
  props: {
    value: {
      type: Array,
      required: true
    },
    field: {
      type: String,
      reaquired: true
    },
  },
  data() {
    return {};
  },
  computed: {
    valueField() {
      if (this.value[0] && this.value[0].startsWith("-")) {
        return this.value[0].substring(1);
      }
      return this.value[0];
    },
    isDesc() {
      return this.valueField === this.field && this.value[0].startsWith("-");
    },
    isAsc() {
      return this.valueField === this.field && !this.value[0].startsWith("-");
    },
    isEmptyString() {
      return this.valueField !== this.field;
    },
    buttonText() {
      if (this.isEmptyString) {
        return "Order Asc"
      } else if (this.isAsc) {
        return "Order Desc"
      }
      return "Cancel Order"
    }
  },
  methods: {
    emitOrdering() {
      let emitValue = [];
      if (this.isEmptyString) {
        emitValue = [this.field];
      } else if (this.isAsc) {
        emitValue = [`-${this.field}`];
      }
      // if IsAsc return null so okay
      return this.$emit("input", emitValue);
    }
  }
};
</script>
