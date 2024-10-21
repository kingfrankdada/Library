<template>
  <div class="select-notice">
    <table v-if="notices.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>公告*</th>
          <th>详情内容*</th>
          <th>是否置顶</th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(notice, index) in notices" :key="index">
          <td>{{ notice.id }}</td>
          <td>
            <InputTag
              v-model="notice.title"
              @input="updateNotice(notice)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="notice.info"
              @input="updateNotice(notice)"
            ></InputTag>
          </td>
          <td>
            <select v-model="notice.top" @change="updateNotice(notice)">
              <option value="1">置顶</option>
              <option value="0">正常</option>
            </select>
          </td>
          <td>
            <button class="del-btn" @click="delNotice(notice)">
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
  name: "SelectNotice",
  components: {
    InputTag,
    AlertBox,
  },

  data() {
    return {
      notices: [],
      alertMsg: "",
      boxMsg: "正在加载公告数据...",
    };
  },

  methods: {
    async selectNotices() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectNotice"
        );
        const notices = response.data.notice;
        this.notices = notices || [];

        if (this.notices.length === 0) {
          this.boxMsg = "未找到任何公告记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取公告数据失败";
      }
    },

    async updateNotice(notice) {
      try {
        await axios.post(
          `http://localhost:3000/api/updateNotice/${notice.id}`,
          {
            title: notice.title,
            info: notice.info,
            top: notice.top,
          }
        );
        this.alertMsg = "更新公告数据成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新公告数据失败";
      }
    },

    async delNotice(notice) {
      try {
        await axios.post(
          `http://localhost:3000/api/delNotice/${notice.id}`,
          notice
        );
        this.alertMsg = "删除公告成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除公告失败";
      }
      this.selectNotices();
    },
  },

  mounted() {
    this.selectNotices();
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
