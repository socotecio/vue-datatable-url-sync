<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

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
