<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('user/setUser', null);
      this.$router.push('/login');
    },
  },
  created() {
    this.logout();
  },
};
</script>
