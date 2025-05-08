import { createStore } from 'vuex';

export default createStore({
  state: {
    profileRequired: false
  },
  mutations: {
    setProfileRequired(state, required) {
      state.profileRequired = required;
    }
  },
  actions: {
    updateProfileRequired({ commit }, required) {
      commit('setProfileRequired', required);
    }
  }
});