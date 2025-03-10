<template>
  <div class="add-notice">
    <table>
      <thead>
        <tr>
          <th>{{ $t("addNotice.field") }}</th>
          <th>{{ $t("addNotice.input") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t("addNotice.title") }}*</td>
          <td>
            <input
              v-model="newNotice.title"
              type="text"
              :placeholder="$t('addNotice.titlePlaceholder')"
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t("addNotice.info") }}*</td>
          <td>
            <textarea
              v-model="newNotice.info"
              type="text"
              :placeholder="$t('addNotice.infoPlaceholder')"
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t("addNotice.isTop") }}*</td>
          <td>
            <select v-model="newNotice.top">
              <option value="" disabled>
                {{ $t("addNotice.isTopPlaceholder") }}
              </option>
              <option value="1">{{ $t("addNotice.top") }}</option>
              <option value="0">{{ $t("addNotice.normal") }}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>{{ $t("addNotice.adduser") }}</td>
          <td>
            {{ userInfo.username }}
          </td>
        </tr>
        <tr>
          <td>{{ $t("addNotice.adddate") }}</td>
          <td>
            {{ new Date().toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="submitForm">{{ $t("addNotice.submit") }}</button>
    <!-- 自定义弹窗捕获 -->
    <AlertBox
      v-if="alertMsg"
      :message="alertMsg"
      @close="alertMsg = null"
    ></AlertBox>
    <MessageBox
      v-if="message"
      :message="message"
      @close="message = null"
    ></MessageBox>
  </div>
</template>

<script>
import api from "@/api/api";
import { endpoints } from "@/api/endpoints";
import AlertBox from "../AlertBox.vue";
import MessageBox from "../MessageBox.vue";
import { mapState } from "vuex";

export default {
  name: "AddNotice",

  components: {
    AlertBox,
    MessageBox,
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

  data() {
    return {
      newNotice: {
        title: "",
        info: "",
        top: "",
        adduser: "",
        adddate: "",
      },
      alertMsg: "",
      message: "",
    };
  },
  methods: {
    async submitForm() {
      this.newNotice.adduser = this.userInfo.username;
      this.newNotice.adddate = new Date().toISOString().split("T")[0];
      if (
        !this.newNotice.title ||
        !this.newNotice.info ||
        !this.newNotice.top
      ) {
        this.alertMsg = this.$t("addNotice.submitForm.empty");
        return;
      }
      try {
        await api.post(endpoints.addNotice, this.newNotice);
        this.message = this.$t("addNotice.submitForm.success");
        this.resetForm(); // 提交后重置表单
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("addNotice.submitForm.fail");
      }
    },

    resetForm() {
      this.newNotice = {};
    },
  },
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
  background-color: var(--card-color);
  color: var(--text-color);
}

textarea[type="text"] {
  height: 100px;
  font-family: var(--body-font);
  font-size: 16px;
}

input:focus,
textarea:focus,
select:focus {
  border: 1px solid var(--first-color);
  transition: 0.4s;
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