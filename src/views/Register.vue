<template>
  <v-layout justify-center>
    <v-flex xs10 md4>
      <v-sheet
        color="white"
        elevation="1"
        class="pb-8"
      >
        <v-toolbar dense color="primary">
          <v-toolbar-title class="white--text">Criar conta</v-toolbar-title>
        </v-toolbar>

        <v-form v-model="valid" ref="formRegister" lazy-validation @keyup.native.enter="validate">
          <v-container>
            <v-alert dense text v-if="alert" :type="alertType">{{ alertMessage }}</v-alert>

            <v-layout column>
              <v-select
                :items="torres"
                label="Torre"
                v-model="form.torreSigla"
                required
                :rules="[value => !!value || 'Campo obrigatório']"
              ></v-select>

              <v-select
                :disabled="unidades.length === 0"
                :items="unidades"
                label="Unidade"
                v-model="form.unidade"
                required
                :rules="[value => !!value || 'Campo obrigatório']"
              ></v-select>

              <v-text-field
                label="Usuário"
                v-model="usuario"
                disabled
                required
              ></v-text-field>

              <v-text-field
                label="Senha"
                v-model="form.senha"
                type="password"
                required
                :rules="[value => !!value || 'Campo obrigatório']"
              ></v-text-field>
            </v-layout>
          </v-container>
        </v-form>

        <v-layout justify-space-around row>
          <v-btn tile text to="/login" :disabled="!valid || loading">Login</v-btn>
          <v-btn
            tile
            text
            color="primary"
            @click="validate"
            :loading="loading"
            :disabled="!valid || loading"
          >Registrar</v-btn>
        </v-layout>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data: () => ({
    loading: false,
    valid: true,
    torres: [
      { text: 'Copaíba', value: 'C' },
      { text: 'Figueira', value: 'F' },
    ],
    form: {
      torre: '',
      torreSigla: '',
      unidade: '',
      usuario: '',
      senha: '',
    },
    alert: false,
    alertType: 'info',
    alertMessage: '',
  }),
  computed: {
    unidades() {
      const units = [];

      if (this.form.torreSigla === 'C') {
        // eslint-disable-next-line no-plusplus
        for (let i = 3; i <= 26; i++) {
          // eslint-disable-next-line no-plusplus
          for (let j = 1; j <= 4; j++) {
            units.push((i * 10) + j);
          }
        }
      } else if (this.form.torreSigla === 'F') {
        // eslint-disable-next-line no-plusplus
        for (let i = 3; i <= 25; i++) {
          // eslint-disable-next-line no-plusplus
          for (let j = 1; j <= 6; j++) {
            units.push((i * 10) + j);
          }
        }
      }

      return units;
    },
    usuario() {
      return `${this.form.torreSigla}${this.form.unidade}`;
    },
  },
  methods: {
    validate() {
      if (this.$refs.formRegister.validate()) {
        this.submit();
      }
    },
    submit() {
      this.loading = true;

      const data = {
        ...this.form,
        usuario: this.usuario.toUpperCase(),
        torre: this.torres.filter((torre) => torre.value === this.form.torreSigla)[0].text,
      };

      axios.post('/register', data)
        .then(() => {
          this.alert = true;
          this.alertType = 'success';
          this.alertMessage = 'Usuário cadastrado com sucesso!';

          setTimeout(() => {
            this.$router.push('/login');
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
