<template>
  <div class="select-message">
    <table v-if="messages.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>论坛留言*</th>
          <th>详情内容*</th>
          <th>浏览数</th>
          <th>点赞数</th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(message, index) in messages" :key="index">
          <td>{{ message.id }}</td>
          <td>
            <InputTag
              v-model="message.title"
              @input="updateMessage(message)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="message.info"
              @input="updateMessage(message)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="message.views"
              @input="updateMessage(message)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="message.likes"
              @input="updateMessage(message)"
            ></InputTag>
          </td>
          <td>
            <button class="del-btn" @click="delMessage(message)">
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>{{ boxMsg }}</p>
    <!-- 自定义弹窗捕获 -->
    <AlertBox
      v-if="alertMsg"
      :message="alertMsg"
      @close="alertMsg = ''"
    ></AlertBox>
  </div>
</template>

<script>
import axios from "axios";
import InputTag from "../InputTag.vue";
import AlertBox from "../AlertBox.vue";

export default {
  name: "SelectMessage",
  components: {
    InputTag,
    AlertBox,
  },

  data() {
    return {
      messages: [],
      alertMsg: "",
      boxMsg: "正在加载论坛留言数据...",
    };
  },

  methods: {
    async selectMessages() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectMessage"
        );
        const messages = response.data.message;
        this.messages = messages || [];

        if (this.messages.length === 0) {
          this.boxMsg = "未找到任何论坛留言记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取论坛留言数据失败";
      }
    },

    async updateMessage(message) {
      try {
        await axios.post(
          `http://localhost:3000/api/updateMessage/${message.id}`,
          {
            title: message.title,
            info: message.info,
            views: message.views,
            likes: message.likes,
          }
        );
        this.alertMsg = "更新论坛留言数据成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新论坛留言数据失败";
      }
    },

    async delMessage(message) {
      try {
        await axios.post(
          `http://localhost:3000/api/delMessage/${message.id}`,
          message
        );
        this.alertMsg = "删除论坛留言成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除论坛留言失败";
      }
      this.selectMessages();
    },
  },

  mounted() {
    this.selectMessages();
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border-top: 1px solid #ddd;
  border-bottom: 1px dashed #ddd;
  padding: 8px;
  text-align: left;
  align-content: center;
  text-align: center;
  justify-content: center;
  justify-items: center;
  max-width: 200px;
  min-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

th {
  background-color: #f2f2f2;
}

img {
  height: 75px;
  width: auto;
}

button {
  cursor: pointer;
  width: 30px;
  height: 30px;
  border: 1px solid var(--first-color);
  border-radius: 5px;
  background-color: var(--white-color);
  color: var(--first-color);
  font-weight: var(--font-medium);
}

button:hover {
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
}

select {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
}
</style>
