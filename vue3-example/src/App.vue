<template>
  <v-app>
    <v-main>
      <v-navigation-drawer
        permanent
      >
        <v-list>
          <v-list-item
            prepend-icon="mdi-view-dashboard"
            title="Home (vuetify datatable)"
            to="/"
          />
          <v-list-item
            prepend-icon="mdi-account-box"
            title="Simple Datatable"
            to="/simple"
          />
          <v-list-item
            prepend-icon="mdi-gavel"
            title="Multiple Datatable"
            to="/multiple-vuetify"
          />
        </v-list>
      </v-navigation-drawer>
      <v-container class="fill-height">
        <v-responsive
          class="align-centerfill-height mx-auto"
          max-width="900"
        >
          <router-view />
        </v-responsive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>
