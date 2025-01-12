import Vue from "vue";
import VueI18n from "vue-i18n";

import zhCN from "@/i18n/zh-CN";
import en from "@/i18n/en";

Vue.use(VueI18n);

const messages = {
  "zh-CN": zhCN,
  en: en,
};

const i18n = new VueI18n({
  locale: localStorage.getItem("language") || "zh-CN",
  fallbackLocale: "zh-CN",
  messages,
});

export default i18n;
