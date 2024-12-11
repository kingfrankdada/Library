<template>
  <div class="guide">
    <div v-if="isLeftGuideVisible" class="left-guide">
      <!-- <div class="left-guide"> -->
      <div class="guide-title" @click="handleAdmin">
        <span>管理员控制台</span>
        <div class="line"></div>
      </div>
      <div v-for="item in filteredMenuList" :key="item.id" class="guide-list">
        <div class="guide-item">
          <router-link :title="item.title" class="guide-link" :to="item.path">
            <i :class="item.icon"></i>
            {{ item.title }}
          </router-link>
        </div>
      </div>
    </div>
    <!-- <div class="hide-btn" @click="toggleGuide">
      <i class="ri-list-check"></i>
    </div> -->
    <!-- <div class="right-box"></div> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "AdminLeftGuide",

  data() {
    return {
      menuList: [
        {
          id: 1,
          name: "book",
          title: "图书管理",
          path: "/admin/book",
          icon: "ri-book-3-line",
        },
        {
          id: 2,
          name: "menu",
          title: "分类管理",
          path: "/admin/menu",
          icon: "ri-list-check",
        },
        {
          id: 3,
          name: "borrow",
          title: "借阅管理",
          path: "/admin/borrow",
          icon: "ri-book-open-line",
        },
        {
          id: 4,
          name: "notice",
          title: "公告管理",
          path: "/admin/notice",
          icon: "ri-mail-line",
        },
        {
          id: 5,
          name: "forum",
          title: "论坛管理",
          path: "/admin/forum",
          icon: "ri-chat-new-line",
        },
        {
          id: 6,
          name: "user",
          title: "用户管理",
          path: "/admin/user",
          icon: "ri-user-line",
        },
        {
          id: 7,
          name: "log",
          title: "日志管理",
          path: "/admin/log",
          icon: "ri-history-line",
        },
      ],
    };
  },

  computed: {
    ...mapState("AdminLeftGuide", ["isLeftGuideVisible"]),
    ...mapState("UserInfo", ["userInfo"]),

    // 权限过滤，管理员不能查看系统日志，只有超管拥有全部权限
    filteredMenuList() {
      // if (this.userInfo.role == 1) {
      //   return this.menuList.filter(
      //     // (item) => item.name !== "user" && item.name !== "log"
      //     (item) => item.name !== "log"
      //   );
      // }
      return this.menuList;
    },
  },

  created() {
    this.setLeftGuideVisible(true);
  },

  methods: {
    ...mapMutations("AdminLeftGuide", ["setLeftGuideVisible"]),
    ...mapMutations("NormalModal", ["setSelectModalVisible"]),

    toggleGuide() {
      this.setLeftGuideVisible(!this.isLeftGuideVisible);
      const hideBtn = document.querySelector(".hide-btn");
      if (this.isLeftGuideVisible) {
        hideBtn.style.left = "15%";
      } else {
        hideBtn.style.left = "0";
      }
    },

    handleAdmin() {
      if (this.$route.path !== "/admin") {
        this.$router.push("/admin");
      }
    },
  },

  beforeDestroy() {
    this.setSelectModalVisible(false);
  },
};
</script>

<style scoped>
.left-guide {
  position: relative;
  height: var(--body-height);
  width: 15%;
  background-color: var(--body-color);
  animation: fade-in 0.5s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.guide-title {
  cursor: pointer;
  position: relative;
  display: flex;
  height: 7.5%;
  width: 100%;
  margin: 5% 0 5% 0;
  padding-left: 10%;
  text-align: center;
  align-items: center;
  justify-content: left;
  font-size: 15px;
  font-weight: var(--font-medium);
}

.line {
  position: absolute;
  display: flex;
  height: 1.5px;
  width: 90%;
  left: 5%;
  right: 5%;
  bottom: 0;
  background-color: #ddd;
  z-index: 1;
}

.guide-list {
  position: relative;
  display: flex;
  height: 7.5%;
  width: 90%;
  left: 5%;
  align-items: center;
  font-size: 14px;
  color: var(--border-color);
  font-weight: var(--font-regular);
  padding-left: 5%;
}

.guide-item {
  width: 100%;
}

.guide-link {
  display: block;
  width: 100%;
  height: 100%;
  padding: 5% 0;
  text-align: left;
  color: var(--text-color);
}

.router-link-active {
  color: var(--first-color);
}

.guide-list:hover {
  background-color: var(--border-color);
  border-radius: 5px;
  animation: fade-in 0.5s;
}

.hide-btn {
  cursor: pointer;
  position: fixed;
  height: 75px;
  width: 25px;
  left: 15%;
  top: 50%;
  border-radius: 0 10px 10px 0;
  background-color: var(--grey-color);
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-50%);
  transition: left 0.3s ease;
  animation: fade-in 0.5s;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
