<template>
  <div class="guide">
    <div class="left-guide">
      <div class="guide-title" @click="handleTitle">
        <span>{{ guideTitle }}</span>
        <div class="line"></div>
      </div>
      <div v-for="item in guideList" :key="item.id" class="guide-list">
        <div class="guide-item">
          <!-- 如果存在.path，则启用路径 -->
          <router-link
            v-if="item.path"
            :title="item.title"
            class="guide-link"
            :to="item.path"
          >
            <i :class="item.icon"></i>
            {{ item.title }}
          </router-link>
          <!-- 展示为普通导航 -->
          <span v-else class="guide-link" @click="handleInfo(item)">{{
            item.title
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "UserLeftGuide",

  props: {
    guideList: {
      type: Array,
      default: () => [],
    },
    guideTitle: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      // guideList: [
      //   { id: 1, name: "collection", title: "我的收藏", path: "/user/collection" },
      //   { id: 2, name: "borrow", title: "我的借阅", path: "/user/borrow" },
      // ],
    };
  },

  computed: {
    ...mapState("NormalModal", ["isModalVisible"]),
  },

  created() {},

  methods: {
    ...mapMutations("NormalModal", ["setSelectModalVisible"]),

    handleTitle() {
      this.$emit("handleTitle");
      // if (this.$route.path !== "/user") {
      //   this.$router.push("/user");
      // }
    },

    handleInfo(item) {
      this.$emit("handleInfo", item);
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
  overflow: auto;
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
  cursor: pointer;
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

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
