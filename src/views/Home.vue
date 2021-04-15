<template>
  <div class="home">
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="3">
          <v-sheet elevation="1" class="pa-5">
            <strong>Academia</strong>
            <v-alert
              outlined
              :color="type"
              text
            >
              {{ message }}
            </v-alert>

            <v-badge inline dot left color="warning">Em uso</v-badge><br />
            <v-badge inline dot left color="error">Em uso por outra unidade</v-badge><br />
            <v-badge inline dot left color="blue-grey">Aguardando</v-badge><br />
            <v-badge inline dot left color="success">Disponível</v-badge>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data: () => ({
    type: 'info',
    message: '',
  }),
  methods: {
    getCurrentStatusGym() {
      axios.get('/booking/status')
        .then((res) => {
          this.type = res.data.type;
          this.message = res.data.message;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  created() {
    this.getCurrentStatusGym();
  },
};
</script>

<style lang="scss" scoped>
  span.v-badge {
    font-weight: 500;
    font-size: .8rem;
  }
</style>
