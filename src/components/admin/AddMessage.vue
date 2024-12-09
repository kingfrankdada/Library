<template>
  <div class="add-message">
    <table>
      <thead>
        <tr>
          <th>字段</th>
          <th>输入</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>标题*</td>
          <td>
            <input
              v-model="newMessage.title"
              type="text"
              placeholder="输入论坛留言标题"
            />
          </td>
        </tr>
        <tr>
          <td>详情内容*</td>
          <td>
            <textarea
              v-model="newMessage.info"
              type="text"
              placeholder="输入论坛留言内容"
            />
          </td>
        </tr>
        <tr>
          <td>添加用户</td>
          <td>
            {{ userInfo.username }}
          </td>
        </tr>
        <tr>
          <td>添加日期</td>
          <td>
            {{ new Date().toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="submitForm">提交</button>
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
import AlertBox from "../AlertBox.vue";
import { mapState } from "vuex";

export default {
  name: "AddMessage",

  components: {
    AlertBox,
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

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
      alertMsg: "",
    };
  },
  methods: {
    async submitForm() {
      this.newMessage.adduser = this.userInfo.username;
      this.newMessage.adddate = new Date().toISOString().split("T")[0];
      this.newMessage.views = 0;
      this.newMessage.likes = 0;
      if (!this.newMessage.title || !this.newMessage.info) {
        this.alertMsg = "论坛留言信息不完整";
        return;
      }
      try {
        await api.post(endpoints.addMessage, this.newMessage);
        // this.alertMsg = "论坛留言添加成功";
        this.alertMsg = "论坛留言添加成功，请前往论坛留言管理查看";
        this.resetForm(); // 提交后重置表单
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "论坛留言添加失败";
      }
    },

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
  },
  mounted() {},
};
</script>

<style scoped>
.add-message {
  height: 100%;
  width: 100%;
  margin-bottom: 20px;
  overflow-y: scroll;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border-top: 1px solid #ddd;
  border-bottom: 1px dashed #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 40%;
  width: 20%;
  height: 7.5%;
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

input[type="text"],
input[type="number"],
textarea[type="text"],
select {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  outline: none;
  box-sizing: border-box;
  overflow: auto;
}

textarea[type="text"] {
  height: 100px;
  font-family: var(--body-font);
  font-size: 16px;
}

.close-button {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s;
}

.close-button:hover {
  color: #000;
}
</style>