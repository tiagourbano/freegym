<template>
  <v-layout justify-center>
    <v-flex xs10 md4>
      <v-sheet
        color="white"
        elevation="1"
        class="pb-8"
      >
        <v-toolbar dense color="primary">
          <v-toolbar-title class="white--text">Login</v-toolbar-title>
        </v-toolbar>

        <v-form
          v-model="valid"
          ref="form"
          lazy-validation
          @keyup.native.enter="submit"
          autocomplete="off"
        >
          <v-container>
            <v-alert dense text v-if="alert" :type="alertType">{{ alertMessage }}</v-alert>

            <v-layout column>
              <v-text-field
                label="Usuário"
                v-model="usuario"
                required
                class="campo-usuario"
              ></v-text-field>

              <v-text-field
                label="Senha"
                v-model="senha"
                type="password"
                required
              ></v-text-field>
            </v-layout>
          </v-container>
        </v-form>

        <v-layout justify-space-around row>
          <v-btn tile text to="/register" :disabled="!valid || loading">Registrar</v-btn>
          <v-btn
            tile
            text
            color="primary"
            @click="submit"
            :loading="loading"
            :disabled="!valid || loading"
          >Entrar</v-btn>
        </v-layout>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data: () => ({
    loading: false,
    valid: true,
    usuario: '',
    senha: '',
    alert: false,
    alertType: 'info',
    alertMessage: '',
  }),
  methods: {
    submit() {
      this.loading = true;

      axios.post('/login', {
        usuario: this.usuario.toUpperCase(),
        senha: this.senha,
      }).then((res) => {
        this.alert = true;
        this.alertType = 'success';
        this.alertMessage = 'Login realizado com sucesso!';
        this.$store.dispatch('user/setUser', res.data);

        setTimeout(() => {
          if (res.data.role === 'place') {
            this.$router.push('/home/gym');
            return;
          }

          this.$router.push('/');
        }, 1000);
      }).catch((err) => {
        this.alert = true;
        this.alertType = 'error';
        this.alertMessage = err.response.data;
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss">
  .campo-usuario {
    input {
      text-transform: uppercase !important;
    }
  }
</style>
