<template>
  <div class="home-gym">
    <v-layout justify-center>
      <v-flex xs10 md4>
        <v-sheet
          color="white"
          elevation="1"
        >
          <v-form
            v-model="valid"
            ref="form"
            lazy-validation
            @keyup.native.enter="submit"
            v-if="bookingStatus.status !== 'busy'"
            autocomplete="off"
          >
            <v-container>
              <v-alert dense text v-if="alert" :type="alertType">{{ alertMessage }}</v-alert>

              <v-layout column>
                <v-text-field
                  label="Usuário"
                  v-model="bookingStatus.user"
                  class="campo-usuario"
                  required
                  :disabled="bookingStatus.status === 'waiting'"
                ></v-text-field>

                <v-text-field
                  label="Senha"
                  v-model="bookingStatus.pass"
                  type="password"
                  required
                ></v-text-field>

                <br>
                <v-btn
                  tile
                  color="primary"
                  @click="submit"
                  :loading="loading"
                  :disabled="!valid || loading"
                >
                  Check In
                </v-btn>
              </v-layout>
            </v-container>

          </v-form>

          <div class="checked-in d-flex flex-column align-center" v-else>
            <h2 class="pa-10">{{ bookingStatus.message }}</h2>

            <div class="mb-10">
              <v-btn
                tile
                color="primary"
                @click="checkout"
                :loading="loading"
                :disabled="!valid || loading"
              >
                Check Out
              </v-btn>
            </div>
          </div>
        </v-sheet>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeGym',
  data: () => ({
    bookingStatus: {},
    loading: false,
    valid: true,
    alert: false,
    alertType: 'info',
    alertMessage: '',
  }),
  methods: {
    getCurrentStatusGym() {
      axios.get('/booking/status')
        .then((res) => {
          this.bookingStatus = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    submit() {
      this.loading = true;

      axios.post('/booking/check-in', {
        bookingDate: this.bookingStatus.bookingDate,
        original: this.bookingStatus.original,
        user: this.bookingStatus.user.toUpperCase(),
        pass: this.bookingStatus.pass,
      }).then(() => {
        this.getCurrentStatusGym();
      }).catch((err) => {
        this.alert = true;
        this.alertType = 'error';
        this.alertMessage = err.response.data;
      }).finally(() => {
        this.loading = false;
      });
    },
    checkout() {
      this.loading = true;

      axios.post('/booking/check-out', {
        bookingDate: this.bookingStatus.bookingDate,
      }).then(() => {
        this.getCurrentStatusGym();
      }).catch((err) => {
        this.alert = true;
        this.alertType = 'error';
        this.alertMessage = err.response.data;
      }).finally(() => {
        this.loading = false;
      });
    },
  },
  created() {
    this.getCurrentStatusGym();
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
