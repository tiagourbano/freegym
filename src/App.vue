<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer app v-model="drawer">
        <template v-slot:prepend>
          <v-list-item two-line>
            <v-list-item-avatar>
              <!-- <img src="https://randomuser.me/api/portraits/women/81.jpg"> -->
              <v-icon x-large>mdi-account</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ user.torre }} - {{ user.unidade }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar dense flat color="#97b158" class="white--text" app>
        <v-app-bar-nav-icon color="#fff" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Free Gym</v-toolbar-title>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>

      <v-footer app>
        Desenvolvido por Tiago Urbano - 2021
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios';
import { userKey } from '@/global';

export default {
  data: () => ({
    drawer: false,
    menuNotLogged: [
      { title: 'Login', icon: 'mdi-account', link: '/login' },
    ],
    menuUser: [
      { title: 'Home', icon: 'mdi-home-city', link: '/' },
      { title: 'Academia', icon: 'mdi-home-city', link: '/gym' },
      { title: 'Sair', icon: 'mdi-exit-to-app', link: '/logout' },
    ],
    menuGym: [
      { title: 'Home', icon: 'mdi-home-city', link: '/home/gym' },
      { title: 'Sair', icon: 'mdi-exit-to-app', link: '/logout' },
    ],
    validatingToken: true,
  }),
  computed: {
    items() {
      if (!this.$store.state.user.user) {
        return this.menuNotLogged;
      }

      return this.$store.state.user.user.role === 'place' ? this.menuGym : this.menuUser;
    },
    user() {
      return this.$store.state.user.user
        ? this.$store.state.user.user
        : { torre: '', unidade: '' };
    },
  },
  methods: {
    async validateToken() {
      this.validatingToken = true;

      const json = localStorage.getItem(userKey);
      const userData = JSON.parse(json);
      this.$store.dispatch('user/setUser', null);

      if (!userData) {
        this.validatingToken = false;
        this.$router.push('/login');
        return;
      }

      const res = await axios.post('/validateToken', userData);

      if (res.data) {
        this.$store.dispatch('user/setUser', userData);
      } else {
        this.$router.push('/login');
      }

      this.validatingToken = false;
    },
  },
  created() {
    this.validateToken();
  },
};
</script>

<style lang="scss">

</style>
