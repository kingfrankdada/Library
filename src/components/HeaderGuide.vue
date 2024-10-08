<template>
  <header class="header" id="header">
    <div class="nav container">
      <router-link to="/home" class="nav__logo">
        <i class="ri-book-3-line"></i>
        <span>高校图书管理系统</span>
      </router-link>

      <!-- 登陆后显示用户信息 -->
      <div class="nav__userinfo" v-if="userInfo.userToken">
        Welcome : {{ userInfo.userName }}
      </div>

      <!-- 导航列表 -->
      <div class="nav__menu">
        <ul class="nav__list">
          <li
            v-for="item in menuList"
            :title="item.title"
            :key="item.id"
            class="nav__item"
          >
            <i :class="item.icon"></i>
            <router-link :to="item.path">{{ item.name }}</router-link>
          </li>

          <!-- 登陆后显示用户设置 -->
          <li v-if="userInfo.userToken" title="用户设置" class="nav__item">
            <i class="ri-user-line login-button"></i>
            <router-link to="/home/setting">Account</router-link>
          </li>

          <!-- 管理员设置 -->
          <li v-if="userInfo.isAdmin" title="系统设置" class="nav__item">
            <i class="ri-settings-line"></i>
            <router-link to="/admin">System</router-link>
          </li>
        </ul>
      </div>

      <div class="nav__actions">
        <!-- 搜索 -->
        <div class="nav__search" title="搜索">
          <PublicSearch></PublicSearch>
        </div>

        <!-- 检测到token为非空条件时，判断用户已登陆隐藏登陆按钮-->
        <!-- 登录模态框，包含NormalModal与PublicLogin组件 -->
        <div v-if="!userInfo.userToken" title="登陆">
          <PublicLogin></PublicLogin>
        </div>

        <!-- 注册模态框 -->
        <NormalModal :size="modalSize" v-if="isRegModalVisible">
          <PublicReg></PublicReg>
        </NormalModal>

        <!-- 登出模态框 -->
        <div v-if="userInfo.userToken" title="登出">
          <PublicLogout></PublicLogout>
        </div>

        <div class="nav__darkmode" title="夜间模式">
          <i class="ri-moon-line change-theme" id="theme-button"></i>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NormalModal from "@/components/NormalModal";
import PublicLogin from "./PublicLogin";
import PublicLogout from "./PublicLogout.vue";
import PublicReg from "./PublicReg.vue";
import PublicSearch from "./PublicSearch.vue";

export default {
  name: "HeaderGuide",

  components: {
    NormalModal,
    PublicLogin,
    PublicLogout,
    PublicReg,
    PublicSearch,
  },

  data() {
    return {
      modalSize: "normal",
      modalSizeSmall: "small",
      menuList: [
        {
          id: 1,
          name: "Home",
          title: "网站主页",
          path: "/home",
          icon: "ri-home-line",
        },
        {
          id: 2,
          name: "Book",
          title: "图书中心",
          path: "/home/book",
          icon: "ri-book-3-line",
        },
        {
          id: 3,
          name: "Forum",
          title: "在线论坛",
          path: "/home/forum",
          icon: "ri-chat-new-line",
        },
        {
          id: 4,
          name: "Help",
          title: "用户帮助",
          path: "/home/help",
          icon: "ri-question-line",
        },
      ],
    };
  },

  computed: {
    ...mapState("NormalModal", [
      "isLoginModalVisible",
      "isLogoutModalVisible",
      "isRegModalVisible",
      "isSearchModalVisible",
    ]),
    ...mapState("UserInfo", ["userInfo"]),
  },

  methods: {
    ...mapMutations("NormalModal", [
      "setLoginModalVisible",
      "setLogoutModalVisible",
      "setRegModalVisible",
      "setSearchModalVisible",
    ]),
    ...mapMutations("UserInfo", ["setUserInfo"]),
    checkWindowSize() {
      this.modalSize = window.innerWidth < 1150 ? "large" : "normal";
    },
  },

  mounted() {
    this.checkWindowSize();
    window.addEventListener("resize", this.checkWindowSize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.checkWindowSize);
  },
};
</script>

<style>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--body-color);
  z-index: var(--z-fixed);
  transition: box-shadow 0.4s, background-color 0.4s;
}

.router-link-exact-active {
  color: var(--first-color);
}

.nav {
  height: var(--header-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav__userinfo {
  position: absolute;
  height: var(--header-height);
  width: 20%px;
  display: flex;
  align-items: center;
  right: 130px;
  animation: fadeInFromRight 0.5s ease;
}

.nav__item {
  display: flex;
  padding: 0 10px 0 10px;
}

.nav__item:hover {
  color: var(--first-color);
}

.nav__logo {
  display: inline-flex;
  align-items: center;
  column-gap: 0.5rem;
  color: var(--first-color);
  font-weight: var(--font-medium);
}

.nav__logo i {
  font-size: 1.25rem;
}

@keyframes fadeInFromRight {
  from {
    opacity: 0;
    transform: translateX(50%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav__list {
  display: flex;
  justify-content: space-between;
}

.nav__link {
  color: var(--text-color);
  transition: color 0.4s;
}

.nav__link span {
  display: none;
  padding: 0 20px 0 0;
}

.nav__link:hover {
  color: var(--first-color);
}

.nav__link i {
  font-size: 1.25rem;
}

.nav__link.active-link {
  color: var(--first-color);
}

.nav__actions {
  display: flex;
  align-items: center;
  column-gap: 1rem;
}
.nav__actions i {
  font-size: 1.25rem;
  color: var(--title-color);
  cursor: pointer;
  transition: color 0.4s;
}

.nav__actions i:hover {
  color: var(--first-color);
}

@media screen and (min-width: 768px) {
  .nav__link span {
    display: inline;
  }
}

/* 移动端适配 */
@media screen and (max-width: 1150px) {
  .nav__menu {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: var(--container-color);
    box-shadow: 0 -8px 32px hsla(0, 0%, 0%, 0.1);
    padding: 1.25rem 4rem;
    transition: background-color 0.4s;
    overflow: auto;
  }

  .nav__userinfo {
    opacity: 0;
  }
}

@media screen and (min-width: 1150px) {
  .nav__menu {
    position: static;
    display: flex;
    background-color: transparent;
    box-shadow: none;
  }
}
</style>