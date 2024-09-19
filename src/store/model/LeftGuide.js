const state = {
  leftGuideInfo: {
    isLeftGuideVisible: true,
  }
};

const mutations = {
  setLeftGuideVisible(state, boolen) {
    state.isLeftGuideVisible = boolen
  },
};

const actions = {};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};