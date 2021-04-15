<template>
  <div class="gym">
    <h1>Academia</h1>
    <v-alert
      dense
      text
      v-if="alert"
      :type="alertType"
      dismissible
    >
      {{ alertMessage }}
    </v-alert>

    <v-container fluid>
      <v-row>
        <v-col>
          <v-sheet elevation="1">
            <v-toolbar dense color="primary">
              <v-toolbar-title class="white--text">Minhas reservas</v-toolbar-title>
            </v-toolbar>

            <v-row
              v-if="myReservations.length === 0"
            >
              <v-col class="ma-10 d-flex align-center justify-center">
                {{ noBookingMessage }}
              </v-col>
            </v-row>
            <v-row
              v-for="reservation in myReservations"
              :key="reservation._id"
              no-gutters
              class="pa-5 reservation"
            >
              <v-col class="text-center">
                {{ reservation.bookingDate | date('dd/MM/yyyy HH:mm') }}
              </v-col>
              <v-col class="text-center">
                <v-btn
                  elevation="0"
                  color="error"
                  @click="cancelBooking(reservation._id)"
                  :loading="sending"
                  :disabled="sending"
                  v-if="canCancel(reservation.bookingDate)"
                >
                  Cancelar
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>

        <v-col cols="12" offset="0" md="5" offset-md="1">
          <v-sheet class="d-flex flex-column" elevation="1">
            <v-toolbar dense color="primary">
              <v-toolbar-title class="white--text">Reservar</v-toolbar-title>
            </v-toolbar>

            <v-container>
              <v-row>
                <v-date-picker
                  v-model="today"
                  locale="pt-br"
                  @click:date="dateClick"
                  :min="min"
                  :max="max"
                  full-width
                ></v-date-picker>
              </v-row>

              <v-row
                v-for="reservation in dayReservations"
                :key="reservation.date"
                class="hour-reservation"
              >
                <v-col>
                  {{ reservation.date | date('HH:mm') }}
                  <span v-if="reservation.user"> - {{ reservation.user }}</span>
                </v-col>
                <v-col class="d-flex justify-end">
                  <v-btn
                    v-if="!reservation.user && canBook(reservation.date)"
                    color="success"
                    @click="booking(reservation.date)"
                    :loading="sending"
                    :disabled="sending"
                  >
                    Reservar
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>

          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {
  format, addDays, isBefore,
} from 'date-fns';
import axios from 'axios';

export default {
  name: 'Gym',
  data: () => ({
    noBookingMessage: `Você pode fazer ${process.env.VUE_APP_MAX_BOOK} reservas!`,
    myReservations: [],
    today: format(new Date(), 'yyyy-MM-dd'),
    min: format(new Date(), 'yyyy-MM-dd'),
    max: format(addDays(new Date(), process.env.VUE_APP_QTY_DAY), 'yyyy-MM-dd'),
    dayReservations: [],
    currentSelectedDay: format(new Date(), 'yyyy-MM-dd'),
    alert: false,
    alertType: 'info',
    alertMessage: '',
    sending: false,
  }),
  methods: {
    showAlert(type, message) {
      this.alert = true;
      this.alertType = type;
      this.alertMessage = message;
    },
    getMyReservations() {
      axios.get('/booking').then((res) => {
        this.myReservations = res.data;
      });
    },
    getDayReservations(date) {
      axios.get('/booking/date', { params: { day: date } }).then((res) => {
        this.dayReservations = res.data;
      });
    },
    canCancel(date) {
      return isBefore(new Date(), new Date(date));
    },
    cancelBooking(bookingId) {
      this.sending = true;

      axios.delete(`/booking/${bookingId}`)
        .then(() => {
          this.showAlert('success', 'Reserva cancelada com sucesso!');
          this.getMyReservations();
          this.getDayReservations(this.currentSelectedDay);
        })
        .catch((err) => {
          this.showAlert('error', err.response.data);
        })
        .finally(() => {
          this.sending = false;
        });
    },
    dateClick(date) {
      this.currentSelectedDay = date;
      this.getDayReservations(date);
    },
    canBook(date) {
      if (this.myReservations.length >= process.env.VUE_APP_MAX_BOOK) {
        return false;
      }

      if (isBefore(new Date(date), new Date())) {
        return false;
      }

      return true;
    },
    booking(date) {
      this.sending = true;

      axios.post('/booking', { bookingDate: date })
        .then(() => {
          this.showAlert('success', 'Reserva efetuada com sucesso!');
          this.getMyReservations();
          this.getDayReservations(this.currentSelectedDay);
        })
        .catch((err) => {
          this.showAlert('error', err.response.data);
        })
        .finally(() => {
          this.sending = false;
        });
    },
  },
  created() {
    this.getMyReservations();
    this.getDayReservations(this.today);
  },
};
</script>

<style lang="scss">
  .reservation {
    font-weight: 600;

    &:nth-child(even) {
      background: #ececec;
    }
  }

  .v-picker {
    margin: 30px auto 10px;

    .v-picker__title {
      display: none;
    }
  }

  .hour-reservation {
    &:nth-child(even) {
      background: #ececec;
    }
  }
</style>
