<template>
  <div class="user-forum">
    <div class="forum-box">
      <!-- <div class="forum-title">欢迎来到用户留言板！</div> -->
      <div class="message-list">
        <div v-if="filteredMessages.length > 0">
          <div
            class="message-item"
            v-for="message in filteredMessages"
            :key="message.id"
            :disabled="message.state === 0"
          >
            <div class="message-header">
              <strong>{{
                message.state === 0
                  ? $t("userForum.illegalTitle")
                  : message.title
              }}</strong>
            </div>
            <p class="message-info">
              <span v-if="message.state === 0" style="color: red">{{
                $t("userForum.illegalInfo")
              }}</span>
              <span v-else>{{ message.info }}</span>
            </p>
            <div class="message-footer">
              <span class="message-details">
                {{ formattedUser(message.adduser) }}
                &nbsp;
                {{ message.adddate }}
                <i class="ri-eye-line"></i>
                {{ message.views }}
                <!-- 显示浏览量 -->
                <i
                  class="ri-thumb-up-line"
                  :disabled="message.state === 0"
                  @click="likeMessage(message)"
                ></i>
                {{ message.likes }}
                <!-- 显示点赞量 -->
              </span>
              <!-- <button
                v-if="message.adduser === userInfo.username"
                @click="delMessage(message)"
                class="delete-button"
              >
                删除
              </button> -->
            </div>
          </div>
        </div>
        <p v-else style="margin-left: 20px">{{ boxMsg }}</p>
      </div>

      <div
        class="new-message-form"
        v-if="userInfo.username && userInfo.usertoken !== ''"
      >
        <input
          v-model="newMessage.title"
          type="text"
          :placeholder="$t('userForum.title')"
          class="input-title"
        />
        <textarea
          v-model="newMessage.info"
          :placeholder="$t('userForum.info')"
          class="input-info"
        ></textarea>
        <button @click="submitForm" class="submit-button">
          {{ $t("userForum.submit") }}
        </button>
        <div class="bottom">
          <div class="input-anonymous">
            <input type="checkbox" v-model="isAnonymous" />
            <label>{{ $t("userForum.isAnonymous") }}</label>
          </div>
          <div class="display-borrow">
            <input type="checkbox" v-model="isBorrowMsg" />
            <label>{{ $t("userForum.borrowMsg") }}</label>
          </div>
        </div>
      </div>
      <div v-else>
        <i class="ri-alert-line">&nbsp;{{ $t("userForum.loginFirst") }}</i>
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
import api from "@/api/api";
import { endpoints } from "@/api/endpoints";
import AlertBox from "@/components/AlertBox.vue";
import { mapState } from "vuex";
import debounce from "lodash/debounce";

export default {
  name: "UserForum",
  data() {
    return {
      newMessage: {
        title: "",
        info: "",
        adduser: "",
        adddate: "",
        book_id: null,
        views: 0,
        likes: 0,
      },
      messages: [],
      alertMsg: "",
      boxMsg: "",
      isAnonymous: false,
      isBorrowMsg: true, // 是否显示借阅留言
      likedMessages: new Set(),
    };
  },

  components: {
    AlertBox,
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 是否显示借阅留言
    filteredMessages() {
      if (!this.isBorrowMsg) {
        return this.messages.filter((message) => !message.book_id);
      } else {
        return this.messages;
      }
    },
  },

  mounted() {
    this.selectMessages();
    this.boxMsg = this.$t("userForum.defaultBoxMsg");
  },

  methods: {
    formattedUser(username) {
      if (username == "匿名用户") {
        return this.$t("userForum.anonymous");
      } else if (username == this.userInfo.username) {
        return this.$t("userForum.yourself");
      } else {
        return username;
      }
    },

    async selectMessages() {
      try {
        const response = await api.get(endpoints.selectMessage);
        this.messages = response.data.message || [];
        // 隔断处理，保留最新100条留言
        this.messages = this.messages.slice(-100);
        // 不显示屏蔽的留言
        // this.messages = this.messages.filter((message) => message.state == 1);

        if (this.messages.length === 0) {
          this.boxMsg = this.$t("userForum.emptyBoxMsg");
        } else {
          this.messages.forEach((message) => {
            this.viewMessage(message);
          });
          this.messages.reverse();
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = this.$t("userForum.errorBoxMsg");
      }
    },

    // 浏览量
    viewMessage(message) {
      if (message.state !== 0) {
        message.views++;
        this.updateMessage(message);
      }
    },

    // 点赞功能
    likeMessage: debounce(function (message) {
      if (message.state !== 0 && !this.likedMessages.has(message.id)) {
        message.likes++;
        this.updateMessage(message);
        this.likedMessages.add(message.id);
        setTimeout(() => {
          this.likedMessages.delete(message.id);
        }, 5000);
      }
    }),

    // 更新留言到服务器
    async updateMessage(message) {
      try {
        await api.post(endpoints.updateMessage(message.id), {
          title: message.title,
          info: message.info,
          views: message.views,
          likes: message.likes,
        });
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("userForum.updateError");
      }
    },

    // 提交新留言
    async submitForm() {
      if (this.isAnonymous) {
        this.newMessage.adduser = "匿名用户";
      } else {
        this.newMessage.adduser = this.userInfo.username;
      }
      this.newMessage.adddate = new Date().toISOString().split("T")[0];
      this.newMessage.views = 0;
      this.newMessage.likes = 0;
      if (!this.newMessage.title || !this.newMessage.info) {
        this.alertMsg = this.$t("userForum.emptyError");
        return;
      }
      try {
        await api.post(endpoints.addMessage, this.newMessage);
        this.resetForm();
        this.selectMessages();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("userForum.addError");
      }
    },

    // 重置表单
    resetForm() {
      this.newMessage = {
        title: "",
        info: "",
        adduser: "",
        adddate: "",
        views: 0,
        likes: 0,
      };
    },

    // 删除留言
    async delMessage(message) {
      try {
        await api.post(endpoints.delMessage(message.id), message);
        this.alertMsg = this.$t("userForum.delSuccess");
        this.selectMessages();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("userForum.delError");
      }
    },
  },
};
</script>

<style scoped>
.user-forum {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.forum-box {
  position: absolute;
  width: 100%;
  height: calc(100% - var(--header-height));
  background: var(--background-color);
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.forum-title {
  position: relative;
  color: var(--first-color);
  font-weight: var(--font-medium);
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.message-list {
  flex: 1;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.message-list::-webkit-scrollbar {
  display: none;
}

.message-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin: 5px 0;
  background-color: var(--card-color);
}

.message-item[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.message-header {
  display: flex;
  justify-content: space-between;
}

.message-info {
  margin: 5px 0;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.message-details i[disabled] {
  cursor: not-allowed;
}

.message-date {
  font-size: 12px;
  color: #999;
}

.ri-eye-line {
  margin-left: 5px;
}

.ri-thumb-up-line {
  margin-left: 5px;
}

.ri-thumb-up-line:hover {
  cursor: pointer;
  color: var(--first-color);
}

.delete-button {
  padding: 5px 10px;
  border: 1px solid red;
  border-radius: 5px;
  background-color: var(--white-color);
  color: red;
  font-weight: var(--font-medium);
}

.delete-button:hover {
  cursor: pointer;
  background: red;
  color: var(--white-color);
  transition: 0.4s;
}

.new-message-form {
  margin-top: 20px;
}

.input-title,
.input-info {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  background-color: var(--background-color);
  color: var(--text-color);
  border-radius: 5px;
  resize: none;
  outline: none;
  box-sizing: border-box;
  overflow: auto;
}

.input-title:focus,
.input-info:focus {
  border: 1px solid var(--first-color);
  transition: 0.4s;
}

.bottom {
  display: flex;
  gap: 20px;
  justify-content: right;
}

.submit-button {
  background-color: var(--first-color);
  color: var(--white-color);
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  cursor: pointer;
}
</style>