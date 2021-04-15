import axios from 'axios';
import { userKey } from '@/global';

const user = {
  namespaced: true,
  state: {
    user: null,
  },
  getters: {
    currentUser(state) {
      return state.user;
    },
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
  },
  actions: {
    setUser({ commit }, payload) {
      commit('SET_USER', payload);

      if (payload) {
        axios.defaults.headers.common.Authorization = `Bearer ${payload.token}`;
        localStorage.setItem(userKey, JSON.stringify(payload));
      } else {
        delete axios.defaults.headers.common.Authorization;
        localStorage.removeItem(userKey);
      }
    },
  },
};

export default user;
