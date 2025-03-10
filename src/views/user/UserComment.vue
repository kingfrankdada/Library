<template>
  <div class="user-comment">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        :placeholder="$t('userComment.searchPlaceholder')"
      />
    </div>
    <!-- 评论列表 -->
    <div v-if="filteredMessages.length > 0" class="comment-list">
      <div
        v-for="message in filteredMessages"
        :key="message.id"
        class="comment-item"
        :disabled="message.state === 0"
      >
        <div class="comment-header">
          <span class="title">{{
            message.state === 0 ? $t("userComment.illegalTitle") : message.title
          }}</span>
          <span class="timestamp">{{ formatDate(message.adddate) }}</span>
        </div>
        <div class="comment-body">
          <span v-if="message.state === 0" style="color: red">
            {{ $t("userComment.illegalInfo") }}
          </span>
          <span v-else>{{ message.info }}</span>
        </div>
        <div class="comment-footer">
          <i class="ri-eye-line"></i>
          {{ message.views }}
          <!-- 显示浏览量 -->
          <i class="ri-thumb-up-line" @click="likeMessage(message)"></i>
          {{ message.likes }}
          <!-- 显示点赞量 -->
          <button class="delete-btn" @click="delComment(message.id)">
            {{ $t("userComment.delBtn") }}
          </button>
        </div>
        <hr class="comment-separator" />
      </div>
    </div>

    <div v-else style="text-align: center">
      {{ $t("userComment.emptyMsg") }}
    </div>

    <!-- 自定义弹窗捕获 -->
    <AlertBox
      v-if="alertMsg"
      :message="alertMsg"
      @close="alertMsg = null"
    ></AlertBox>
  </div>
</template>

<script>
import api from "@/api/api";
import { endpoints } from "@/api/endpoints";
import { mapState } from "vuex";
import AlertBox from "@/components/AlertBox.vue";

export default {
  name: "UserComment",
  components: {
    AlertBox,
  },
  computed: {
    ...mapState("UserInfo", ["userInfo"]),
    filteredMessages() {
      const searchQuery = this.searchText.toLowerCase();
      return this.messages
        .filter(
          (message) =>
            message.info.toLowerCase().includes(searchQuery) ||
            message.title.toLowerCase().includes(searchQuery)
        )
        .sort((a, b) => new Date(b.adddate) - new Date(a.adddate));
    },
  },

  data() {
    return {
      alertMsg: "",
      messages: [],
      searchText: "",
    };
  },

  mounted() {
    this.selectMessageByUserName();
  },

  methods: {
    async selectMessageByUserName() {
      try {
        const response = await api.get(
          endpoints.selectMessageByUsername(this.userInfo.username)
        );
        this.messages = response.data.message || [];
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("userComment.selectMessageByUserName.error");
      }
    },

    // 日期格式化
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    // 删除评论
    async delComment(messageId) {
      try {
        await api.post(endpoints.delMessage(messageId));
        this.alertMsg = this.$t("userComment.delComment.success");
        this.selectMessageByUserName();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("userComment.delComment.fail");
      }
    },
  },
};
</script>

<style scoped>
.user-comment {
  height: 100%;
  width: 85%;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow-y: auto;
  background: var(--background-color);
  padding: 0 20px 20px 20px;
}

.search-box {
  position: sticky;
  top: 0;
  background-color: var(--background-color);
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #ddd;
  z-index: 1;
  padding: 10px;
}

.search-box input {
  width: 60%;
  background-color: var(--card-color);
  color: var(--text-color);
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.comment-list {
  margin-top: 20px;
  margin-bottom: 40px;
}

.comment-item {
  position: relative;
  padding: 15px;
  margin-bottom: 5px;
}

.comment-item[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.title {
  font-weight: bold;
  color: var(--first-color);
}

.timestamp {
  font-size: 13px;
  color: #888;
}

.comment-body {
  font-size: 14px;
  color: var(--text-color);
}

.comment-footer {
  margin-top: 10px;
  text-align: right;
}

.delete-btn {
  height: 40px;
  width: 40px;
  font-size: 14px;
  color: red;
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: underline;
  position: absolute;
  left: 10px;
  bottom: 15px;
}

.comment-separator {
  border: 0;
  border-top: 1px solid #ddd;
  margin-top: 10px;
}

.alert-box {
  background-color: #f8d7da;
  padding: 15px;
  margin-top: 20px;
  border-radius: 5px;
}
</style>
