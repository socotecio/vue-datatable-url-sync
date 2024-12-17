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
            to="/multiple-datatable"
          />
        </v-list>

        <template #append>
          <div class="pa-2">
            <v-btn block>
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>
