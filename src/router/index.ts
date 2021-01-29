import { createRouter, createWebHistory } from 'vue-router'

// TODO make it work with typescritp
const HelloWorld = () => import(/* webpackChunkName: "HelloWorld" */ "../examples/HelloWorld.vue");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld,
    },
  ]
});

export default router;
