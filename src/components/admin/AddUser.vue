<template>
  <div class="add-user">
    <table>
      <thead>
        <tr>
          <th>字段</th>
          <th>输入</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>名称*</td>
          <td>
            <input
              v-model="newUser.title"
              type="text"
              placeholder="输入用户名称"
            />
          </td>
        </tr>
        <!-- <tr>
          <td>状态*</td>
          <td>
            <select v-model="newUser.state">
              <option value="1">正常</option>
              <option value="0">关闭</option>
            </select>
          </td>
        </tr> -->
      </tbody>
    </table>
    <button @click="submitForm">提交</button>
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
import AlertBox from "../AlertBox.vue";

export default {
  name: "AddUser",
  components: {
    AlertBox,
  },

  data() {
    return {
      newUser: {
        title: "",
        state: 1,
      },
      alertMsg: "",
    };
  },
  methods: {
    async submitForm() {
      if (!this.newUser.title) {
        this.alertMsg = "用户信息不完整";
        return;
      }
      try {
        await axios.post("http://localhost:3000/api/addUser", this.newUser);
        this.alertMsg = "用户添加成功";
        this.resetForm(); // 提交后重置表单
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "用户添加失败";
      }
    },

    resetForm() {
      this.newUser = {
        title: "",
        state: 1,
      };
    },
  },
  mounted() {},
};
</script>

<style scoped>
.add-user {
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
select {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
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