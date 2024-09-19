import Vue from "vue";
import Vuex from "vuex";
import createLocalStorage from 'vuex-persistedstate';
import NormalModal from "./model/NormalModal.js";
import UserInfo from "./model/UserInfo.js";
import LeftGuide from "./model/LeftGuide.js";
import WebSocket from "./model/WebSocket.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  modules: {
    NormalModal,
    UserInfo,
    LeftGuide,
    WebSocket
  },
  plugins: [createLocalStorage({
    storage: window.localStorage
  })]
});

export default store;