<template>
  <div class="notice">
    <!-- 公告按钮，点击后显示公告框 -->
    <!-- <i
      class="ri-mail-line"
      id="notice-button"
      @click="setNoticeModalVisible(true)"
    ></i> -->

    <!-- 公告内容区域 -->
    <div class="notice-content">
      <NormalModal size="large" v-if="isNoticeModalVisible">
        <!-- 公告标题 -->
        <div class="notice-form">{{ $t("publicNotice.title") }}</div>

        <!-- 公告列表 -->
        <div class="g-container">
          <!-- 置顶公告列表 -->
          <ul class="notice-list">
            <li
              v-for="notice in pinnedNotices"
              :key="notice.id"
              class="notice-item"
              @click="openNotice(notice)"
            >
              <span class="top-notice">{{ $t("publicNotice.top") }}</span>
              {{ notice.title }} - {{ notice.adddate }}
            </li>
          </ul>

          <!-- 普通公告列表 -->
          <ul class="notice-list">
            <li
              v-for="notice in regularNotices"
              :key="notice.id"
              class="notice-item"
              @click="openNotice(notice)"
            >
              {{ notice.title }} - {{ notice.adddate }}
            </li>
          </ul>
        </div>

        <!-- 公告详情展示区域 -->
        <NoticeBox
          v-if="selectedNotice"
          :notice="selectedNotice"
          @close="selectedNotice = null"
        ></NoticeBox>
      </NormalModal>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import { endpoints } from "@/api/endpoints";
import { mapState, mapMutations } from "vuex";
import NormalModal from "@/components/NormalModal";
import NoticeBox from "@/components/NoticeBox.vue";

export default {
  name: "PublicNotice",

  components: {
    NormalModal,
    NoticeBox,
  },

  data() {
    return {
      notices: [], // 存储公告数据
      selectedNotice: null, // 存储当前选中的公告
    };
  },

  mounted() {
    this.selectNotice();
  },

  computed: {
    ...mapState("NormalModal", ["isNoticeModalVisible"]),

    // 置顶公告
    pinnedNotices() {
      return this.notices.filter((notice) => notice.top);
    },

    // 普通公告
    regularNotices() {
      return this.notices.filter((notice) => !notice.top);
    },
  },

  methods: {
    ...mapMutations("NormalModal", ["setNoticeModalVisible"]),

    // 选择公告时，传递数据给 NoticeBox 组件
    openNotice(notice) {
      this.selectedNotice = notice;
    },

    // 获取公告数据
    async selectNotice() {
      try {
        const response = await api.get(endpoints.selectNotice);
        this.notices = response.data.notice || [];
        this.notices.sort((a, b) => new Date(b.adddate) - new Date(a.adddate));
        if (this.notices.length === 0) {
          this.selectedNotice = { info: this.$t("publicNotice.empty") };
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.selectedNotice = { info: this.$t("publicNotice.error") };
      }
    },
  },
};
</script>

<style scoped>
.notice-form {
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 30px;
  color: var(--first-color);
  font-weight: var(--font-medium);
  top: 20px;
  z-index: 0;
}

.g-container {
  margin-top: 60px;
  padding: 20px;
  width: 100%;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.notice-list {
  list-style: none;
  padding: 0;
}

.notice-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  z-index: 1;
}

.notice-item:hover {
  background-color: var(--background-color);
}

.top-notice {
  color: red;
  font-weight: bold;
  margin-right: 5px;
}
</style>
