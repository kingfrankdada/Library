const state = {
  onlineUserCount: 0,
};

const mutations = {
  setOnlineUserCount(state, onlineUserCount) {
    state.onlineUserCount = onlineUserCount
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