# vue-datatable-url-sync
Synchronize your datatable filter, ordering and options with the query params. In Vue2 and Vue3 with the composition api !

# Goal and explanation

Have you ever as an user filtered or navigated in a datable, open an item of the datable, go back to the datable and see you loose all your filter and pagination and have to rewrite them again ?
If yes was it frustrating ?
If yes then this lib is here to help your user never feel that again. Even if you reload the page or share the link with others user.


Now there is already some other lib even in pure Vanilla to sync the query parameters with a javascript object. But you have to rewrite all the logic avec the datatble options (page, pageSize, ordering) and even compare the difference between two state.

By separating the filters and the datable options vue-datatable-url-sync automatise all the desired behavior for working with datatable.

Example of usage with a vuetify datatable:

// coming soon

# Installation:

```
npm install vue-datatable-url-sync
```

# Usage

[For full example see this file for vue 3](https://github.com/socotecio/vue-datatable-url-sync/blob/main/vue3-example/src/components/HelloWorld.vue)

[For full example see this file for vue 2](https://github.com/socotecio/vue-datatable-url-sync/blob/main/vue2-example/src/components/HelloWorld.vue)
### 1 - Import the lib

```js
import useDatatableUrlSync from 'vue-datatable-url-sync';
```

### 2 - Define your setup function and the data you use for your datatable

```js
setup (props, ctx) {
    const form = ref({
        search: ""
    })
    const options = ref({
        page: 1,
        page_size: 10,
        ordering: []
    })
    const items = ref<any>([])
}
```

### 3 - Define the function called each time the url query change (in the setup fucntion)

```js
const fetchDatas = (queryParams: string, queryAsObject: GenericDictionnary) => {
    console.log(queryParams, queryAsObject)
}
```

### 4 - Use it

```js
// Vue 3
useDatatableUrlSync(useRoute(), useRouter(), form, fetchDatas, options)
// Vue 2
useDatatableUrlSync(ctx.root.$route, ctx.root.$router, form, fetchDatas, options)
```

### 5 Return your data to use it in the datatable 

```js
return {
    form,
    options,
    items
}
```


# useDatatableUrlSync params

Prototype:
```js
function useDatatableUrlSync(route: any, router: any, form: GenericDictionnary, fetchDatas: Function, options: GenericDictionnary, formSchema?: GenericDictionnary, initializeForm?: Function, configurations?: VDUSConfiguration)
```

| Params | Description |
| route | The route element from vue router. As it differe from Vue2 and Vue3 we can't import it automatically and need to have the instance in parameter |
| router | The route instance from vue router. As it differe from Vue2 and Vue3 we can't import it automatically and need to have the instance in parameter |
| form | A simple object used to filter the form. This object is synchronized with the url. When it change it reset the page attribute of the options variable |
| fetchDatas | Callback function called when options or form changed or after a reload with the correct parameter to send to the backend for backend pagination or custom actions. This function take 2 parameter: queryParams, queryAsObject that are the data transformed by VDUS to match your backend criteria in string or object format.  |
| options | The options used for the datatable. It follow a strict pattern. See [DatatableOptions](#TODO) type for more informations. If your server use other query identifier use formSchema to change their name before fetchDatas been called |
| formSchema | The object that allow you to customize the defaut value, the type and the names send to the backend. See [FormSchema](#TODO) type for the structure and [the documentation section](#TODO) to understand how to use it |
| initializeForm | A callback function called at the component creation to allow developer to adapt behavior depending of the query params in the url if needed. Usefull if to value are non-compatible because user change it manually. |
| configurations | Object that allow to personnalise the behavior of VDUS in specific case. See [VDUSConfiguration](#TODO) type and [the documentation section](#TODO) to understand how to use it |


# useDatatableUrlSync returned value

| Key name | Description |
| loading | Boolean value to be able to wait in the template that the data is correctly setted from the url and the data retrieve or filtered in fetchDatas especially if your fetchDatas is asynchronous |
| vuetifyOptions | The datatable options on the vuetify format to be able to use it directly in the template without the need to transform it |
