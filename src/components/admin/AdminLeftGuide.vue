<template>
  <div class="guide">
    <div v-if="isLeftGuideVisible" class="left-guide">
      <!-- <div class="left-guide"> -->
      <div class="guide-title" @click="handleAdmin">
        <span>管理员控制台</span>
        <div class="line"></div>
      </div>
      <div v-for="item in menuList" :key="item.id" class="guide-list">
        <div class="guide-item">
          <router-link :title="item.title" class="guide-link" :to="item.path">
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
        { id: 1, name: "book", title: "图书管理", path: "/admin/book" },
        { id: 2, name: "menu", title: "分类管理", path: "/admin/menu" },
        { id: 3, name: "borrow", title: "借阅管理", path: "/admin/borrow" },
        { id: 4, name: "notice", title: "公告管理", path: "/admin/notice" },
        { id: 5, name: "forum", title: "论坛管理", path: "/admin/forum" },
        { id: 6, name: "user", title: "用户管理", path: "/admin/user" },
      ],
    };
  },

  computed: {
    ...mapState("AdminLeftGuide", ["isLeftGuideVisible"]),
    ...mapState("NormalModal", ["isModalVisible"]),
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
  font-size: 20px;
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
  font-size: 17.5px;
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
