// INFO - AM - 25/07/2022 - Hack for vue router wainting for integration:

// https://github.com/vuejs/vue-router/issues/3760
// https://github.com/vuejs/vue-router/pull/3763


import { getCurrentInstance, reactive, watchEffect } from 'vue'

/**
 * Returns the current route location. Equivalent to using `$route` inside
 * templates.
 */
export function useRoute () {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('getCurrentInstance() returned null. useRoute() must be called at the top of a setup function')
  }
  const route = reactive(Object.assign({}, instance.proxy.$root.$route))
  watchEffect(() => {
    Object.assign(route, instance.proxy.$root.$route)
  })

  return route
}

/**
 * Returns the router instance. Equivalent to using `$router` inside
 * templates.
 */
export function useRouter () {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error(
      'getCurrentInstance() returned null. useRouter() must be called at the top of a setup function',
    )
  }
  const router = instance.proxy.$root.$router
  watchEffect(() => {
    if (router) {
      Object.assign(router, instance.proxy.$root.$router)
    }
  })
  return router
}