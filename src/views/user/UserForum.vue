<template>
  <div class="user-forum">
    <div class="forum-box">
      <!-- <div class="forum-title">欢迎来到用户留言板！</div> -->
      <div class="message-list">
        <div v-if="messages.length > 0">
          <div
            class="message-item"
            v-for="message in messages"
            :key="message.id"
          >
            <div class="message-header">
              <strong>{{ message.title }}</strong>
            </div>
            <p class="message-info">{{ message.info }}</p>
            <div class="message-footer">
              <span class="message-details">
                {{ message.adduser }} 发表于 {{ message.adddate }}
                <i class="ri-eye-line"></i>
                {{ message.views }}
                <!-- 显示浏览量 -->
                <i class="ri-thumb-up-line" @click="likeMessage(message)"></i>
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
          placeholder="标题"
          class="input-title"
        />
        <textarea
          v-model="newMessage.info"
          placeholder="输入您的留言内容"
          class="input-info"
        ></textarea>
        <button @click="submitForm" class="submit-button">提交留言</button>
      </div>
      <div v-else>
        <i class="ri-alert-line">&nbsp;请先登录再进行留言</i>
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

export default {
  name: "UserForum",
  data() {
    return {
      newMessage: {
        title: "",
        info: "",
        adduser: "",
        adddate: "",
        views: 0,
        likes: 0,
      },
      messages: [],
      alertMsg: "",
      boxMsg: "正在加载论坛留言...",
    };
  },

  components: {
    AlertBox,
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

  mounted() {
    this.selectMessages();
  },

  methods: {
    async selectMessages() {
      try {
        const response = await api.get(endpoints.selectMessage);
        this.messages = response.data.message || [];

        if (this.messages.length === 0) {
          this.boxMsg = "未找到任何论坛留言记录";
        } else {
          this.messages.forEach((message) => {
            this.viewMessage(message);
          });
          this.messages.reverse();
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取论坛留言数据失败";
      }
    },

    // 浏览量
    viewMessage(message) {
      message.views++;
      this.updateMessage(message);
    },

    // 点赞功能
    likeMessage(message) {
      message.likes++;
      this.updateMessage(message);
    },

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
        this.alertMsg = "更新论坛留言数据失败";
      }
    },

    // 提交新留言
    async submitForm() {
      this.newMessage.adduser = this.userInfo.username;
      this.newMessage.adddate = new Date().toISOString().split("T")[0];
      this.newMessage.views = 0;
      this.newMessage.likes = 0;
      if (!this.newMessage.title || !this.newMessage.info) {
        this.alertMsg = "论坛标题或内容不完整";
        return;
      }
      try {
        await api.post(endpoints.addMessage, this.newMessage);
        this.resetForm();
        this.selectMessages();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "论坛留言添加失败";
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
        this.alertMsg = "删除论坛留言成功";
        this.selectMessages();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除论坛留言失败";
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
  padding: 20px;
  background: url("../../../public/assets/images/forum.png") no-repeat center
    center;
  background-attachment: fixed;
  background-size: cover;
}

.forum-box {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
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
  background-color: #f9f9f9;
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
  border-radius: 5px;
  resize: none;
  outline: none;
  box-sizing: border-box;
  overflow: auto;
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