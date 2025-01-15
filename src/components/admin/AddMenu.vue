<template>
  <div class="add-menu">
    <table>
      <thead>
        <tr>
          <th>{{ $t("addMenu.title") }}</th>
          <th>{{ $t("addMenu.input") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t("addMenu.name") }}*</td>
          <td>
            <input
              v-model="newMenu.title"
              type="text"
              :placeholder="$t('addMenu.namePlaceholder')"
            />
          </td>
        </tr>
        <!-- <tr>
          <td>状态*</td>
          <td>
            <select v-model="newMenu.state">
              <option value="1">正常</option>
              <option value="0">关闭</option>
            </select>
          </td>
        </tr> -->
      </tbody>
    </table>
    <button @click="submitForm">{{ $t("addMenu.submit") }}</button>
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
  name: "AddMenu",
  components: {
    AlertBox,
  },

  data() {
    return {
      newMenu: {
        title: "",
        state: 1,
      },
      alertMsg: "",
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

  methods: {
    async submitForm() {
      if (!this.newMenu.title) {
        this.alertMsg = this.$t("addMenu.submitForm.empty");
        return;
      }
      try {
        await api.post(endpoints.addMenu, this.newMenu);
        this.alertMsg = this.$t("addMenu.submitForm.success");

        // 添加更新日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "新增",
          info: `新增分类：${this.newMenu.title}`,
          creditCount: null,
          adddate: adddate,
        };
        await api.post(endpoints.addLog, newLog);

        this.resetForm(); // 提交后重置表单
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("addMenu.submitForm.fail");
      }
    },

    resetForm() {
      this.newMenu = {
        title: "",
        state: 1,
      };
    },
  },
  mounted() {},
};
</script>

<style scoped>
.add-menu {
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
  background-color: var(--background-color);
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
  background-color: var(--card-color);
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
  background-color: var(--card-color);
  color: var(--text-color);
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