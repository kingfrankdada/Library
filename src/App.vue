<template>
  <div id="app">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="shortcut icon"
      href="assets/img/favicon.png"
      type="image/x-icon"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.css"
    />
    <link rel="stylesheet" href="../src/assets/css/swiper-bundle.min.css" />
    <router-view class="app__content"></router-view>
  </div>
</template>

<script>
// import { mapState } from "vuex";
import { mapMutations } from "vuex";
export default {
  name: "app",

  data() {
    return {
      onlineUsers: 0,
    };
  },

  computed: {
    // ...mapState("WebSocket", ["onlineUserCount"]),
  },

  methods: {
    ...mapMutations("NormalModal", [
      "setSearchModalVisible",
      "setLoginModalVisible",
      "setLogoutModalVisible",
      "setRegModalVisible",
      "setSelectModalVisible",
      "setAddModalVisible",
      "setUpdateModalVisible",
    ]),
    ...mapMutations("SysInfo", ["setOnlineUserCount"]),

    // 获取在线用户数
    connectWebSocket() {
      const ws = new WebSocket("ws://localhost:3001");

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "onlineUserCount") {
          this.onlineUserCount = data.count;
          this.setOnlineUserCount(data.count);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket 连接已关闭");
      };
    },
  },

  mounted() {
    this.connectWebSocket();
  },
};
</script>

<style>
@import "./assets/css/google-fonts.css";
/*=============== VARIABLES CSS ===============*/
:root {
  --header-height: 8vh;
  --body-height: 92vh;

  /*========== 弹窗组件尺寸 ==========*/
  --search-modal-content-weight: 40%;
  --search-modal-content-height: 30%;
  --small-modal-content-weight: 25%;
  --small-modal-content-height: 25%;
  --normal-modal-content-weight: 25%;
  --normal-modal-content-height: 60%;
  --large-modal-content-weight: 70%;
  --large-modal-content-height: 70%;

  /*========== Colors ==========*/
  /*Color mode HSL(hue, saturation, lightness)*/
  --first-color: hsl(230, 62%, 56%);
  --title-color: hsl(230, 70%, 16%);
  --text-color: hsl(230, 16%, 45%);
  --border-color: hsl(230, 50%, 90%);
  --white-color: hsl(0, 0%, 100%);
  --background-color: #f3f3f3;
  /* --body-color: hsl(230, 100%, 96%); */
  --body-color: hsl(0, 0%, 100%);
  --grey-color: hsl(0, 0%, 95%);
  --admin-color: hsl(229, 37%, 26%);
  --container-color: hsl(230, 100%, 97%);

  /*========== Font and typography ==========*/
  /*.5rem = 8px | 1rem = 16px ...*/
  --body-font: "Montserrat", sans-serif;
  --second-font: "Montagu Slab", serif;
  --biggest-font-size: 2rem;
  --h1-font-size: 1.5rem;
  --h2-font-size: 1.25rem;
  --h3-font-size: 1rem;
  --normal-font-size: 0.938rem;
  --small-font-size: 0.813rem;
  --smaller-font-size: 0.75rem;

  /*========== Font weight ==========*/
  --font-regular: 400;
  --font-medium: 500;
  --font-semi-bold: 600;

  /*========== z index ==========*/
  --z-tooltip: 10;
  --z-fixed: 100;
}

/*========== Responsive typography ==========*/
@media screen and (min-width: 1150px) {
  :root {
    --biggest-font-size: 3.5rem;
    --h1-font-size: 2.25rem;
    --h2-font-size: 1.5rem;
    --h3-font-size: 1.25rem;
    --normal-font-size: 1rem;
    --small-font-size: 0.875rem;
    --smaller-font-size: 0.813rem;
  }
}

/*=============== BASE ===============*/
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

body,
input,
button {
  font-family: var(--body-font);
  font-size: var(--normal-font-size);
}

body {
  background-color: var(--white-color);
  color: var(--text-color);
  transition: background-color 0.4s;
}

.app__content {
  padding-top: var(--header-height);
}

input,
button {
  border: none;
  outline: none;
}

h1,
h2,
h3,
h4 {
  color: var(--title-color);
  font-family: var(--second-font);
  font-weight: var(--font-medium);
}

ul {
  list-style: none;
}

a {
  text-decoration: none;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

/*=============== THEME ===============*/
/*========== Variables Dark theme ==========*/
body.dark-theme {
  --title-color: hsl(230, 48%, 85%);
  --text-color: hsl(230, 16%, 70%);
  --border-color: hsl(230, 12%, 18%);
  --body-color: hsl(230, 12%, 8%);
  --container-color: hsl(230, 12%, 12%);
}

/*========== 
	Color changes in some parts of 
	the website, in dark theme
==========*/
.dark-theme .shadow-header {
  box-shadow: 0 2px 16px hsla(0, 0%, 0%, 0.4);
}

.dark-theme .nav__menu {
  box-shadow: 0 -8px 32px hsla(0, 0%, 0%, 0.4);
}

.dark-theme .scrollup {
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, 0.4);
}

.dark-theme .search,
.dark-theme .login {
  background-color: hsla(262, 12%, 8%, 0.6);
}

.dark-theme::-webkit-scrollbar {
  background-color: hsl(230, 16%, 15%);
}

.dark-theme::-webkit-scrollbar-thumb {
  background-color: hsl(230, 16%, 25%);
}

.dark-theme::-webkit-scrollbar-thumb:hover {
  background-color: hsl(230, 16%, 35%);
}
/*=============== REUSABLE CSS CLASSES ===============*/
.container {
  max-width: 100%;
  margin-inline: 1.5rem;
}

.grid {
  display: grid;
  gap: 1.5rem;
}

.section {
  padding-block: 5rem 1rem;
}

.section__title {
  text-align: center;
  font-size: var(--h1-font-size);
  font-family: var(--second-font);
  margin-bottom: 2rem;
}

.main {
  overflow: hidden;
}
</style>