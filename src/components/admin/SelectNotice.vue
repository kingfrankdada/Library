<template>
  <div class="select-notice">
    <table v-if="filteredNotices.length > 0">
      <thead>
        <tr>
          <th @click="sortNotices('id')">
            ID
            <span :class="getSortIcon('id')"></span>
          </th>
          <th @click="sortNotices('title')">
            公告*
            <span :class="getSortIcon('title')"></span>
          </th>
          <th @click="sortNotices('info')">
            详情内容*
            <span :class="getSortIcon('info')"></span>
          </th>
          <th @click="sortNotices('top')">
            是否置顶
            <span :class="getSortIcon('top')"></span>
          </th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(notice, index) in sortedNotices" :key="index">
          <td>{{ notice.id }}</td>
          <td>
            <InputTag
              v-model="notice.title"
              @input="updateNotice(notice)"
            ></InputTag>
          </td>
          <td
            class="notice-info"
            title="双击可进入编辑模式"
            @dblclick="openEdit(notice)"
          >
            {{ notice.info }}
          </td>
          <td>
            <select v-model="notice.top" @change="updateNotice(notice)">
              <option value="1">置顶</option>
              <option value="0">正常</option>
            </select>
          </td>
          <td>
            <button class="del-btn" title="删除" @click="delNotice(notice)">
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>{{ boxMsg }}</p>
    <!-- 编辑公告模态框 -->
    <EditTag
      v-if="editMsg"
      :editMsg="editMsg"
      :editId="editId"
      @update="updateNotice"
      @close="editMsg = null"
    ></EditTag>
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
import InputTag from "../InputTag.vue";
import EditTag from "../EditTag.vue";
import AlertBox from "../AlertBox.vue";
// import { mapState, mapMutations } from "vuex";

export default {
  name: "SelectNotice",
  components: {
    InputTag,
    AlertBox,
    EditTag,
  },

  props: {
    searchText: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      notices: [],
      alertMsg: "",
      editMsg: "", // 编辑公告传入数据
      editId: null, // 存储编辑的公告 ID
      boxMsg: "暂无数据...",
      sortColumn: "",
      sortOrder: "asc", // 默认为升序asc
    };
  },

  computed: {
    // ...mapState("NormalModal", ["isEditNoticeModalVisible"]),
    filteredNotices() {
      const filterList = this.searchText.toLowerCase();
      return this.notices.filter(
        (notice) =>
          notice.title.toLowerCase().includes(filterList) ||
          notice.info.toLowerCase().includes(filterList)
      );
    },

    sortedNotices() {
      const notices = [...this.filteredNotices];
      if (this.sortColumn) {
        notices.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return notices;
    },
  },

  mounted() {
    this.selectNotices();
    // this.setEditNoticeModalVisible(true);
  },

  methods: {
    // ...mapMutations("NormalModal", ["setEditNoticeModalVisible"]),

    async selectNotices() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectNotice"
        );
        this.notices = response.data.notice || [];
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
        // this.alertMsg = "更新公告数据成功";
        this.selectNotices();
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
        // this.alertMsg = "删除公告成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除公告失败";
      }
      this.selectNotices();
    },

    openEdit(notice) {
      this.editMsg = notice.info; // 设置要编辑的公告内容
      this.editId = notice.id; // 设置当前公告ID
    },

    sortNotices(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column;
        this.sortOrder = "asc";
      }
    },

    getSortIcon(column) {
      if (this.sortColumn === column) {
        return this.sortOrder === "asc" ? "sort-asc-icon" : "sort-desc-icon";
      }
      return "sort-icon";
    },
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

.notice-info {
  cursor: pointer;
}

th {
  background-color: #f2f2f2;
  cursor: pointer;
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

.sort-icon {
  margin-left: 5px;
}
.sort-asc-icon::after {
  content: "▲";
}
.sort-desc-icon::after {
  content: "▼";
}
</style>
