import Vue from "vue";
import VueI18n from "vue-i18n";

import zhCN from "@/i18n/zh-CN";
import zhHk from "@/i18n/zh-HK";
import en from "@/i18n/en";
import de from "@/i18n/de";
import jp from "@/i18n/jp";
import ru from "@/i18n/ru";

Vue.use(VueI18n);

const messages = {
  "zh-CN": zhCN,
  "zh-HK": zhHk,
  en: en,
  de: de,
  jp: jp,
  ru: ru
};

const i18n = new VueI18n({
  locale: localStorage.getItem("language") || "zh-CN",
  fallbackLocale: "zh-CN",
  messages,
});

export default i18n;
