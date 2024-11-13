<template>
  <div class="user-comment">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        placeholder="搜索留言标题或内容"
      />
    </div>
    <!-- 评论列表 -->
    <div class="comment-list">
      <div
        v-for="message in filteredMessages"
        :key="message.id"
        class="comment-item"
      >
        <div class="comment-header">
          <span class="title">{{ message.title }}</span>
          <span class="timestamp">{{ formatDate(message.adddate) }}</span>
        </div>
        <div class="comment-body">{{ message.info }}</div>
        <div class="comment-footer">
          <i class="ri-eye-line"></i>
          {{ message.views }}
          <!-- 显示浏览量 -->
          <i class="ri-thumb-up-line" @click="likeMessage(message)"></i>
          {{ message.likes }}
          <!-- 显示点赞量 -->
          <button class="delete-btn" @click="delComment(message.id)">
            删除
          </button>
        </div>
        <hr class="comment-separator" />
      </div>
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
import axios from "axios";
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
        const response = await axios.get(
          `http://localhost:3000/api/selectMessage/${this.userInfo.username}`
        );
        this.messages = response.data.message || [];
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "获取论坛留言数据失败";
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
        await axios.post(`http://localhost:3000/api/delMessage/${messageId}`);
        this.alertMsg = "评论删除成功";
        this.selectMessageByUserName();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除评论失败";
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
  overflow-y: scroll;
  background: var(--white-color);
  padding: 0 20px 20px 20px;
}

.search-box {
  position: sticky;
  top: 0; 
  background-color: var(--white-color); 
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #ddd;
  z-index: 1;
  padding: 10px;
}

.search-box input {
  width: 60%;
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
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 10px;
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
