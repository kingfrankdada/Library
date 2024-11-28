<template>
  <div class="select-borrow">
    <table v-if="filteredBorrows.length > 0">
      <thead>
        <tr>
          <th @click="sortBorrows('id')">
            ID
            <span :class="getSortIcon('id')"></span>
          </th>
          <th @click="sortBorrows('username')">
            用户*
            <span :class="getSortIcon('username')"></span>
          </th>
          <th @click="sortBorrows('bookname')">
            图书*
            <span :class="getSortIcon('bookname')"></span>
          </th>
          <th @click="sortBorrows('start_date')">
            借阅日期*
            <span :class="getSortIcon('start_date')"></span>
          </th>
          <th @click="sortBorrows('over_date')">
            预计归还日期*
            <span :class="getSortIcon('over_date')"></span>
          </th>
          <th @click="sortBorrows('days')">
            预计借阅天数*
            <span :class="getSortIcon('days')"></span>
          </th>
          <th @click="sortBorrows('return_date')">
            实际归还日期*
            <span :class="getSortIcon('return_date')"></span>
          </th>
          <th @click="sortBorrows('record_days')">
            实际借阅天数*
            <span :class="getSortIcon('record_days')"></span>
          </th>
          <th @click="sortBorrows('overtime')">
            逾期天数*
            <span :class="getSortIcon('overtime')"></span>
          </th>
          <th @click="sortBorrows('state')">
            状态*
            <span :class="getSortIcon('state')"></span>
          </th>
          <th @click="sortBorrows('credit_delta')">
            信誉分
            <span :class="getSortIcon('credit_delta')"></span>
          </th>
          <th @click="sortBorrows('adddate')">
            添加日期
            <span :class="getSortIcon('adddate')"></span>
          </th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(borrow, index) in sortedBorrows" :key="index">
          <td>{{ borrow.id }}</td>
          <td>
            <InputTag
              v-model="borrow.username"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.bookname"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.start_date"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.over_date"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.days"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.return_date"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.record_days"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.overtime"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <select v-model="borrow.state" @change="updateBorrow(borrow)">
              <option value="2">已逾期</option>
              <option value="1">借阅中</option>
              <option value="0">已归还</option>
            </select>
          </td>
          <td>{{ borrow.credit_delta || "-" }}</td>
          <td>{{ borrow.adddate }}</td>
          <td>
            <button class="del-btn" title="删除" @click="delBorrow(borrow)">
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>{{ boxMsg }}</p>
    <EditTag
      v-if="editMsg"
      :editMsg="editMsg"
      :editId="editId"
      :editName="editName"
      @update="updateBorrow"
      @close="editMsg = null"
    ></EditTag>
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
import AlertBox from "../AlertBox.vue";
import EditTag from "../EditTag.vue";
import { mapState } from "vuex";

export default {
  name: "SelectBorrow",
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
      borrows: [],
      menuTitles: [],
      alertMsg: "",
      editMsg: "",
      editName: "",
      editId: null,
      boxMsg: "暂无数据...",
      sortColumn: "",
      sortOrder: "asc", // 默认为升序asc
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    filteredBorrows() {
      const filterList = this.searchText.toLowerCase();
      return this.borrows.filter(
        (borrow) =>
          borrow.username.toLowerCase().includes(filterList) ||
          borrow.bookname.toLowerCase().includes(filterList)
      );
    },

    sortedBorrows() {
      const borrows = [...this.filteredBorrows];
      if (this.sortColumn) {
        borrows.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return borrows;
    },
  },

  mounted() {
    this.selectBorrows();
  },

  methods: {
    async selectBorrows() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectBorrow"
        );
        this.borrows = response.data.record || [];
        if (this.borrows.length === 0) {
          this.boxMsg = "未找到任何借阅记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取借阅数据失败";
      }
    },

    async updateBorrow(borrow) {
      try {
        await axios.post(
          `http://localhost:3000/api/updateBorrow/${borrow.id}`,
          borrow
        );
        // this.alertMsg = "更新借阅数据成功";
        this.selectBorrows();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新借阅数据失败";
      }

      // 添加更新日志
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      const newLog = {
        username: this.userInfo.username,
        userIP: this.userInfo.userIP,
        type: "更新",
        info: `更新用户${borrow.username}的借阅信息：${borrow.bookname}`,
        creditCount: 0,
        adddate: adddate,
      };

      await axios.post("http://localhost:3000/api/addLog", newLog);
    },

    async delBorrow(borrow) {
      try {
        await axios.post(
          `http://localhost:3000/api/delBorrow/${borrow.id}`,
          borrow
        );
        // this.alertMsg = "删除借阅成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除借阅失败";
      }

      // 添加删除日志
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      const newLog = {
        username: this.userInfo.username,
        userIP: this.userInfo.userIP,
        type: "删除",
        info: `删除用户${borrow.username}的借阅信息：${borrow.bookname}`,
        creditCount: 0,
        adddate: adddate,
      };

      await axios.post("http://localhost:3000/api/addLog", newLog);

      this.selectBorrows();
    },

    openEdit(borrow) {
      this.editMsg = borrow.info;
      this.editId = borrow.id;
      this.editName = borrow.name;
    },

    sortBorrows(column) {
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
  max-width: 150px;
  min-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: ltr;
}

.borrow-info {
  cursor: pointer;
}

th {
  background-color: #f2f2f2;
  cursor: pointer;
}

img {
  height: 50px;
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
