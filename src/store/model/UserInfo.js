const state = {
  userInfo: {
    role: 2, // 0: 超级管理员，1: 管理员，2: 普通用户
    username: '',
    usertoken: '',
    userIP: ''
  }
};

const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
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