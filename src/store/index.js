import Vue from "vue";
import Vuex from "vuex";
import createLocalStorage from 'vuex-persistedstate';
import NormalModal from "./model/NormalModal.js";
import UserInfo from "./model/UserInfo.js";
import AdminLeftGuide from "./model/AdminLeftGuide.js";
import SysInfo from "./model/SysInfo.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  modules: {
    NormalModal,
    UserInfo,
    AdminLeftGuide,
    SysInfo
  },
  plugins: [createLocalStorage({
    storage: window.localStorage
  })]
});

export default store;