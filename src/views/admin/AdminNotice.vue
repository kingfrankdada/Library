<template>
  <div class="admin-notice">
    <!-- 搜索框 -->
    <!-- <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        :placeholder="$t('adminNotice.searchPlaceholder')"
      />
    </div> -->
    <SearchForm
      :searchConfig="searchConfig"
      @search="search"
      @reSelect="reSelect"
    />

    <!-- 工具栏 -->
    <div class="toolbar">
      <label @click="isAddModalVisible = true">
        <i class="ri-mail-add-line"></i>
        {{ $t("adminNotice.add") }}
      </label>
      <label>
        <input
          type="checkbox"
          v-model="showRecentDays"
          @change="filterByRecentDays"
        />
        {{ $t("adminNotice.showRecentDays") }}
      </label>
      <label>
        <input type="checkbox" v-model="enableSelection" />
        {{ $t("adminNotice.enableSelection") }}
      </label>
      <!-- 全选 -->
      <label v-show="enableSelection">
        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
        {{ $t("adminNotice.selectAll") }}
      </label>
      <label v-show="enableSelection" @click="topSelectedNotices">
        <i class="ri-expand-up-down-fill"></i>
        {{ $t("adminNotice.top") }}
      </label>
      <label v-show="enableSelection" @click="untopSelectedNotices">
        <i class="ri-contract-up-down-fill"></i>
        {{ $t("adminNotice.untop") }}
      </label>
      <label v-show="enableSelection" @click="deleteSelectedNotices">
        <i class="ri-delete-bin-5-fill"></i>
        {{ $t("adminNotice.delete") }}
      </label>
    </div>

    <!-- 公告表格 -->
    <table v-if="paginatedNotices.length > 0">
      <thead>
        <tr>
          <th v-if="enableSelection">
            <input
              type="checkbox"
              v-model="selectPage"
              @change="toggleSelectPage"
            />
          </th>
          <th @click="sortNotices('id')">
            ID
            <span :class="getSortIcon('id')"></span>
          </th>
          <th @click="sortNotices('title')">
            {{ $t("adminNotice.title") }}*
            <span :class="getSortIcon('title')"></span>
          </th>
          <th @click="sortNotices('info')">
            {{ $t("adminNotice.info") }}*
            <span :class="getSortIcon('info')"></span>
          </th>
          <th @click="sortNotices('top')">
            {{ $t("adminNotice.isTop") }}
            <span :class="getSortIcon('top')"></span>
          </th>
          <th>{{ $t("adminNotice.delete") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(notice, index) in paginatedNotices" :key="index">
          <td v-if="enableSelection" @click="toggleCheckbox(notice.id)">
            <input
              type="checkbox"
              :value="notice.id"
              v-model="selectedNotices"
            />
          </td>
          <td>{{ notice.id }}</td>
          <td>
            <InputTag
              v-model="notice.title"
              @input="updateNotice(notice)"
            ></InputTag>
          </td>
          <td
            class="notice-info"
            :title="$t('adminNotice.infoTip')"
            @dblclick="openEdit(notice)"
          >
            {{ notice.info }}
          </td>
          <td>
            <select
              :title="
                notice.top === 1
                  ? $t('adminNotice.top')
                  : $t('adminNotice.normal')
              "
              :style="{ color: notice.top === 1 ? 'red' : 'green' }"
              v-model="notice.top"
              @change="updateNotice(notice)"
            >
              <option style="color: red" value="1">
                {{ $t("adminNotice.top") }}
              </option>
              <option style="color: green" value="0">
                {{ $t("adminNotice.normal") }}
              </option>
            </select>
          </td>
          <td>
            <button
              class="del-btn"
              :title="$t('adminNotice.delete')"
              @click="delNotice(notice)"
            >
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else style="margin-left: 20px">{{ $t("adminNotice.noNotice") }}</p>

    <!-- 编辑公告模态框 -->
    <EditTag
      v-if="editMsg"
      class="select-modal"
      :editMsg="editMsg"
      :editId="editId"
      :editName="editName"
      @update="updateNotice"
      @close="editMsg = null"
    ></EditTag>

    <!-- 公告添加模态框 -->
    <NormalModal
      v-if="isAddModalVisible"
      class="select-modal"
      @close="closeModal"
      size="large"
    >
      <div class="select-text">{{ $t("adminNotice.add") }}</div>
      <AddNotice></AddNotice>
    </NormalModal>

    <!-- 分页控制 -->
    <div class="pagination">
      <span>{{ $t("adminNotice.pageSize") }}</span>
      <select v-model="pageSize" @change="handlePageSizeChange">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <button @click="firstPage">{{ $t("adminNotice.firstPage") }}</button>
      <button @click="prevPage" :disabled="currentPage === 1">
        {{ $t("adminNotice.prevPage") }}
      </button>
      <span>
        {{
          $t("adminNotice.pageInfo", {
            currentPage,
            totalPages: totalPages || 1,
          })
        }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        {{ $t("adminNotice.nextPage") }}
      </button>
      <button @click="lastPage">{{ $t("adminNotice.lastPage") }}</button>
    </div>

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
import { eventBus } from "@/utils/eventBus";
import SearchForm from "@/components/SearchForm.vue";
import AlertBox from "@/components/AlertBox.vue";
import MessageBox from "@/components/MessageBox.vue";
import InputTag from "@/components/InputTag.vue";
import AddNotice from "@/components/admin/AddNotice.vue";
import EditTag from "@/components/EditTag.vue";
import NormalModal from "@/components/NormalModal.vue";
import { mapState } from "vuex";

export default {
  name: "AdminNotice",

  components: {
    AddNotice,
    AlertBox,
    MessageBox,
    InputTag,
    EditTag,
    NormalModal,
    SearchForm,
  },

  data() {
    return {
      alertMsg: "",
      message: "",
      boxMsg: "",
      editMsg: "", // 编辑公告传入数据
      editId: null, // 存储编辑的公告 ID
      editName: "",
      notices: [],
      // searchText: "",
      sortColumn: null,
      sortOrder: "asc",
      pageSize: 10, // 每页显示的条数
      currentPage: 1, // 当前页
      showRecentDays: false,
      enableSelection: false, // 是否启用复选框
      selectAll: false, // 全选
      selectPage: false, // 当页全选
      selectedNotices: [], // 选中
      isAddModalVisible: false,

      // 搜索配置
      activeSearch: false,
      searchConfig: [],
      searchForm: {},
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 筛选后的公告
    filteredNotices() {
      let notices = [...this.notices];

      // 启用最近七天筛选
      if (this.showRecentDays) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        notices = notices.filter(
          (notice) => new Date(notice.adddate) >= sevenDaysAgo
        );
      }

      if (this.activeSearch) {
        notices = notices.filter((notice) => {
          const titleMatch = notice.title
            .toLowerCase()
            .includes(this.searchForm.title.toLowerCase());

          const infoMatch = notice.info
            .toLowerCase()
            .includes(this.searchForm.info.toLowerCase());

          const topMatch =
            this.searchForm.top === "" || // 如果 top 为空，匹配所有
            notice.top == this.searchForm.top;

          return titleMatch && infoMatch && topMatch;
        });
      }

      // 根据搜索框内容筛选
      return (
        notices
          // .filter(
          //   (notice) =>
          //     notice.title.toLowerCase().includes(filterList) ||
          //     notice.info.toLowerCase().includes(filterList)
          // )
          .sort((a, b) => new Date(b.id) - new Date(a.id))
      );
    },

    // 排序后的公告
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

    // 当前页显示的公告
    paginatedNotices() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedNotices.slice(start, end);
    },

    // 总页数
    totalPages() {
      return Math.ceil(this.filteredNotices.length / this.pageSize || 1);
    },
  },

  mounted() {
    eventBus.$on("language-changed", this.setConfig);

    this.selectNotices().then(() => {
      this.setConfig();
      this.boxMsg = this.$t("adminNotice.defaultBoxMsg");
    });
  },

  watch: {
    selectedNotices: {
      handler() {
        // 更新全页全选状态
        const allIds = this.filteredNotices.map((notice) => notice.id);
        this.selectAll = allIds.every((id) =>
          this.selectedNotices.includes(id)
        );

        // 更新当页全选状态
        const currentPageIds = this.paginatedNotices.map((notice) => notice.id);
        this.selectPage = currentPageIds.every((id) =>
          this.selectedNotices.includes(id)
        );
      },
      deep: true,
    },

    currentPage() {
      const currentPageIds = this.paginatedNotices.map((notice) => notice.id);
      this.selectPage = currentPageIds.every((id) =>
        this.selectedNotices.includes(id)
      );
    },

    searchText() {
      this.currentPage = 1;
      this.resetSelection();
    },
  },

  methods: {
    setConfig() {
      this.searchConfig = [
        {
          key: "title",
          label: this.$t("adminNotice.title"),
          type: "input",
          placeholder: this.$t("adminNotice.searchForm.title"),
        },
        {
          key: "info",
          label: this.$t("adminNotice.info"),
          type: "input",
          placeholder: this.$t("adminNotice.searchForm.info"),
        },
        {
          key: "top",
          label: this.$t("adminNotice.top"),
          type: "select",
          options: [
            {
              value: "1",
              label: this.$t("adminNotice.top"),
              color: "red",
            },
            {
              value: "0",
              label: this.$t("adminNotice.normal"),
              color: "green",
            },
          ],
          placeholder: this.$t("adminNotice.searchForm.top"),
        },
      ];
    },

    // 点击单元格切换复选框
    toggleCheckbox(noticeId) {
      if (this.selectedNotices.includes(noticeId)) {
        this.selectedNotices = this.selectedNotices.filter(
          (id) => id !== noticeId
        );
      } else {
        this.selectedNotices.push(noticeId);
      }
    },

    // 日期格式化
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    // 打开编辑模态框
    openEdit(notice) {
      this.editName = notice.title;
      this.editMsg = notice.info;
      this.editId = notice.id;
    },

    // 筛选最近七天
    filterByRecentDays() {
      this.currentPage = 1;
      this.resetSelection();
    },

    // 全页全选
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedNotices = this.filteredNotices.map((notice) => notice.id);
      } else {
        this.selectedNotices = [];
      }
    },

    // 当页全选
    toggleSelectPage() {
      const currentPageIds = this.paginatedNotices.map((notice) => notice.id);
      if (this.selectPage) {
        this.selectedNotices = Array.from(
          new Set([...this.selectedNotices, ...currentPageIds])
        );
      } else {
        this.selectedNotices = this.selectedNotices.filter(
          (id) => !currentPageIds.includes(id)
        );
      }
    },

    // 还原复选框状态
    resetSelection() {
      this.selectedNotices = [];
      this.selectAll = false;
      this.selectPage = false;
    },

    // 关闭模态框
    closeModal() {
      this.isAddModalVisible = false;
      this.selectNotices();
      this.currentPage = 1;
    },

    async selectNotices() {
      try {
        const response = await api.get(endpoints.selectNotice);
        this.notices = response.data.notice || [];
        if (this.notices.length === 0) {
          this.boxMsg = this.$t("adminNotice.selectNotices.empty");
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = this.$t("adminNotice.selectNotices.fail");
      }
    },

    // 删除公告
    async delNotice(notice) {
      try {
        await api.post(endpoints.delNotice(notice.id), notice);
        // this.alertMsg = "删除公告成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminNotice.delNotice.fail");
      }

      // 添加删除日志
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      const newLog = {
        username: this.userInfo.username,
        userIP: this.userInfo.userIP,
        type: "删除",
        info: `删除公告：${notice.title}`,
        adddate: adddate,
      };

      try {
        await api.post(endpoints.addLog, newLog);
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        // this.alertMsg = "添加日志失败";
      }

      this.selectNotices();
    },

    // 删除选中的公告
    async deleteSelectedNotices() {
      if (this.selectedNotices.length === 0) {
        this.alertMsg = this.$t("adminNotice.deleteSelectedNotices.empty");
        return;
      }

      const deletedTitles = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        for (const noticeId of this.selectedNotices) {
          const notice = this.notices.find((n) => n.id === noticeId);
          if (notice) {
            deletedTitles.push(notice.title);
            await api.post(endpoints.delNotice(noticeId));
          }
        }

        // 添加批量删除日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "删除",
          info: `批量删除公告：${deletedTitles.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedNotices = [];
        this.selectNotices();
        this.resetSelection();
        this.currentPage = 1;
        this.message = this.$t("adminNotice.deleteSelectedNotices.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminNotice.deleteSelectedNotices.fail");
      }
    },

    // 置顶选中的公告
    async topSelectedNotices() {
      if (this.selectedNotices.length === 0) {
        this.alertMsg = this.$t("adminNotice.topSelectedNotices.empty");
        return;
      }

      const toppedTitles = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        for (const noticeId of this.selectedNotices) {
          const notice = this.notices.find((n) => n.id === noticeId);
          if (notice) {
            toppedTitles.push(notice.title);
            await api.post(endpoints.updateNotice(noticeId), {
              ...notice,
              top: true,
            });
          }
        }

        // 添加置顶日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `批量置顶公告：${toppedTitles.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedNotices = [];
        this.selectNotices();
        this.resetSelection();
        this.currentPage = 1;
        this.message = this.$t("adminNotice.topSelectedNotices.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminNotice.topSelectedNotices.fail");
      }
    },

    // 取消置顶选中的公告
    async untopSelectedNotices() {
      if (this.selectedNotices.length === 0) {
        this.alertMsg = this.$t("adminNotice.untopSelectedNotices.empty");
        return;
      }

      const untoppedTitles = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        for (const noticeId of this.selectedNotices) {
          const notice = this.notices.find((n) => n.id === noticeId);
          if (notice) {
            untoppedTitles.push(notice.title);
            await api.post(endpoints.updateNotice(noticeId), {
              ...notice,
              top: false,
            });
          }
        }

        // 添加取消置顶日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `批量取消置顶公告：${untoppedTitles.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedNotices = [];
        this.selectNotices();
        this.resetSelection();
        this.currentPage = 1;
        this.message = this.$t("adminNotice.untopSelectedNotices.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminNotice.untopSelectedNotices.fail");
      }
    },

    async updateNotice(notice) {
      try {
        await api.post(endpoints.updateNotice(notice.id), {
          title: notice.title,
          info: notice.info,
          top: notice.top,
        });
        // 添加更新日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });

        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `更新公告：${notice.title || notice.name}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);
        this.selectNotices();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminNotice.updateNotice.fail");
      }
    },

    // 接收搜索组件传值，搜索
    search(searchForm) {
      this.reSelect();
      this.searchForm = searchForm;
      this.activeSearch = true;
    },

    reSelect() {
      this.currentPage = 1;
      this.activeSearch = false;
      this.sortColumn = null;
      this.selectNotices();
      this.selectedNotices = [];
    },

    // 排序公告
    sortNotices(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column;
        this.sortOrder = "asc";
      }
    },

    // 获取排序图标
    getSortIcon(column) {
      if (this.sortColumn === column) {
        return this.sortOrder === "asc" ? "sort-asc-icon" : "sort-desc-icon";
      }
      return "sort-icon";
    },

    // 首页
    firstPage() {
      this.currentPage = 1;
    },

    // 上一页
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    // 下一页
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    // 尾页
    lastPage() {
      this.currentPage = this.totalPages;
    },

    handlePageSizeChange() {
      this.currentPage = 1;
      this.resetSelection();
      this.selectNotices();
    },
  },

  beforeDestroy() {
    eventBus.$off("language-changed", this.setConfig);
  },
};
</script>

<style scoped>
.admin-notice {
  height: 100%;
  width: 85%;
  background: var(--background-color);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.admin-notice::-webkit-scrollbar {
  display: none;
}

.search-box {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.search-box input {
  width: 60%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: var(--text-color);
  background-color: var(--card-color);
  font-size: 16px;
}

.toolbar {
  display: flex;
  justify-content: left;
  align-items: center;
  margin: 0 0 10px 20px;
}

.toolbar label {
  font-size: 14px;
  color: var(--text-color);
  cursor: pointer;
  margin-right: 10px;
}

.toolbar label:last-child:hover {
  color: red;
}

table {
  margin-left: 20px;
  width: calc(100% - 40px);
  border-collapse: collapse;
  margin-top: 5px;
  margin-bottom: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

th {
  background-color: var(--first-color);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
}

td {
  font-size: 14px;
  background-color: var(--card-color);
}

td:hover {
  background-color: var(--background-color);
  transition: background-color 0.3s;
}

td:last-child:hover {
  background-color: var(--card-color);
}

.notice-type-icon {
  margin-left: 5px;
}

button {
  cursor: pointer;
  width: 30px;
  height: 30px;
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

select {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: var(--card-color);
  color: var(--text-color);
}

.select-modal {
  position: fixed;
  z-index: 9999;
  left: 7.5%;
}

.select-text {
  display: flex;
  align-items: center;
  left: 20px;
  width: 100%;
  height: 50px;
  font-size: 20px;
  font-weight: var(--font-semi-bold);
  color: var(--first-color);
  margin-top: 20px;
  margin-left: 20px;
}

.notice-info {
  cursor: pointer;
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

.pagination {
  position: sticky;
  height: 12.5%;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 40px;
  gap: 20px;
  z-index: 1;
  background: var(--background-color);
}

.pagination span {
  margin-right: 10px;
  font-size: 14px;
}

.pagination button {
  padding: 5px 10px;
  width: auto;
  align-items: center;
  justify-content: center;
  justify-items: center;
}

.pagination select {
  width: 100px;
  padding: 5px;
  border-radius: 4px;
  background-color: var(--card-color);
  color: var(--text-color);
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
