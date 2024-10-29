<template>
  <div class="guide">
    <div class="left-guide">
      <div class="guide-title" @click="handleUser">
        <span>用户中心</span>
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
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "UserLeftGuide",

  data() {
    return {
      menuList: [
        { id: 1, name: "collection", title: "我的收藏", path: "/home/user/collection" },
        { id: 2, name: "borrow", title: "我的借阅", path: "/home/user/borrow" },
      ],
    };
  },

  computed: {
    ...mapState("NormalModal", ["isModalVisible"]),
  },

  created() {},

  methods: {
    ...mapMutations("NormalModal", ["setSelectModalVisible"]),

    handleUser() {
      if (this.$route.path !== "/home/user") {
        this.$router.push("/home/user");
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
  position: absolute;
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
  align-items: ledft;
  justify-content: left;
  font-size: var(--h3-font-size);
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
}

.router-link-active {
  color: var(--first-color);
}

.guide-list:hover {
  background-color: var(--border-color);
  border-radius: 5px;
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
