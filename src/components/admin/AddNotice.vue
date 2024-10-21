<template>
  <div class="add-notice">
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
              v-model="newNotice.title"
              type="text"
              placeholder="输入公告标题"
            />
          </td>
        </tr>
        <tr>
          <td>详情内容*</td>
          <td>
            <input
              v-model="newNotice.info"
              type="text"
              placeholder="输入公告内容"
            />
          </td>
        </tr>
        <tr>
          <td>是否置顶*</td>
          <td>
            <select v-model="newNotice.top">
              <option value="1">置顶</option>
              <option value="0">正常</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>添加用户</td>
          <td>
            {{ userInfo.userName }}
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
      @close="alertMsg = ''"
    ></AlertBox>
  </div>
</template>

<script>
import axios from "axios";
import AlertBox from "../AlertBox.vue";
import { mapState } from "vuex";

export default {
  name: "AddNotice",

  components: {
    AlertBox,
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

  data() {
    return {
      newNotice: {
        title: "",
        info: "",
        adduser: "",
        adddate: "",
      },
      alertMsg: "",
    };
  },
  methods: {
    async submitForm() {
      this.newNotice.adduser = this.userInfo.userName;
      this.newNotice.adddate = new Date().toISOString().split("T")[0];
      if (!this.newNotice.title || !this.newNotice.info || !this.newNotice.top) {
        this.alertMsg = "公告信息不完整";
        return;
      }
      try {
        await axios.post("http://localhost:3000/api/addNotice", this.newNotice);
        // this.alertMsg = "公告添加成功";
        this.alertMsg = "公告添加成功，请前往公告管理查看";
        this.resetForm(); // 提交后重置表单
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "公告添加失败";
      }
    },

    resetForm() {
      this.newNotice = {
        title: "",
        info: "",
        adduser: "",
        adddate: "",
        top: 0, // 默认不置顶
      };
    },
  },
  mounted() {},
};
</script>

<style scoped>
.add-notice {
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