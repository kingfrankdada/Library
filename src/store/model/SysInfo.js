const state = {
  onlineUserCount: 0,
  isLogActive: true,
};

const mutations = {
  setOnlineUserCount(payload, onlineUserCount) {
    payload.onlineUserCount = onlineUserCount
  },
  setLogActive(state, isLogActive) {
    state.isLogActive = isLogActive
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