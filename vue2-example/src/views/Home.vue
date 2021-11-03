<template>
  <div class="home">
    <HelloWorld />
    <HelloWorldComplex />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';
import HelloWorldComplex from '@/components/HelloWorldComplex.vue';

export default Vue.extend({
  name: 'Home',
  components: {
    HelloWorld,
    HelloWorldComplex,
  },
});
</script>
