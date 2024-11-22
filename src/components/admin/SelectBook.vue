<template>
  <div class="select-book">
    <table v-if="filteredBooks.length > 0">
      <thead>
        <tr>
          <th @click="sortBooks('id')">
            ID
            <span :class="getSortIcon('id')"></span>
          </th>
          <th @click="sortBooks('name')">
            书名*
            <span :class="getSortIcon('name')"></span>
          </th>
          <th @click="sortBooks('author')">
            作者*
            <span :class="getSortIcon('author')"></span>
          </th>
          <th @click="sortBooks('menu')">
            分类*
            <span :class="getSortIcon('menu')"></span>
          </th>
          <th @click="sortBooks('price')">
            价格*
            <span :class="getSortIcon('price')"></span>
          </th>
          <th @click="sortBooks('press')">
            出版社*
            <span :class="getSortIcon('press')"></span>
          </th>
          <th @click="sortBooks('num')">
            库存数量*
            <span :class="getSortIcon('num')"></span>
          </th>
          <th>封面</th>
          <th>更多信息*</th>
          <th @click="sortBooks('state')">
            状态*
            <span :class="getSortIcon('state')"></span>
          </th>
          <th @click="sortBooks('adddate')">
            添加日期
            <span :class="getSortIcon('adddate')"></span>
          </th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(book, index) in sortedBooks" :key="index">
          <td>{{ book.id }}</td>
          <td>
            <InputTag v-model="book.name" @input="updateBook(book)"></InputTag>
          </td>
          <td>
            <InputTag
              v-model="book.author"
              @input="updateBook(book)"
            ></InputTag>
          </td>
          <td>
            <select v-model="book.menu" @change="updateBook(book)">
              <option v-for="title in menuTitles" :key="title" :value="title">
                {{ title }}
              </option>
            </select>
          </td>
          <td>
            <InputTag v-model="book.price" @input="updateBook(book)"></InputTag>
          </td>
          <td>
            <InputTag v-model="book.press" @input="updateBook(book)"></InputTag>
          </td>
          <td>
            <InputTag v-model="book.num" @input="updateBook(book)"></InputTag>
          </td>
          <td>
            <img
              :src="
                book.img
                  ? `/assets/img/${book.img}`
                  : '/assets/img/image-add-fill.png'
              "
              alt="封面"
            />
          </td>
          <td
            class="book-info"
            title="双击可进入编辑模式"
            @dblclick="openEdit(book)"
          >
            {{ book.info }}
          </td>
          <td>
            <select v-model="book.state" @change="updateBook(book)">
              <option value="1">正常</option>
              <option value="0">关闭</option>
            </select>
          </td>
          <td>{{ book.adddate }}</td>
          <td>
            <button class="del-btn" title="删除" @click="delBook(book)">
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
      @update="updateBook"
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
  name: "SelectBook",
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
      books: [],
      menuTitles: [],
      alertMsg: "",
      editMsg: "",
      editId: null,
      boxMsg: "暂无数据...",
      sortColumn: "",
      sortOrder: "asc", // 默认为升序asc
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    filteredBooks() {
      const filterList = this.searchText.toLowerCase();
      return this.books.filter(
        (book) =>
          book.name.toLowerCase().includes(filterList) ||
          book.author.toLowerCase().includes(filterList) ||
          book.menu.toLowerCase().includes(filterList)
      );
    },

    sortedBooks() {
      const books = [...this.filteredBooks];
      if (this.sortColumn) {
        books.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return books;
    },
  },

  methods: {
    async selectBooks() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectBook"
        );
        this.books = response.data.books || [];
        if (this.books.length === 0) {
          this.boxMsg = "未找到任何图书记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取图书数据失败";
      }
    },

    async selectMenuTitles() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/menuTitles"
        );
        this.menuTitles = response.data.titles;
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取分类信息数据失败";
      }
    },

    async updateBook(book) {
      try {
        await axios.post(
          `http://localhost:3000/api/updateBook/${book.id}`,
          book
        );
        // this.alertMsg = "更新图书数据成功";
        this.selectBooks();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新图书数据失败";
      }

      // 添加更新日志
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      const newLog = {
        username: this.userInfo.username,
        userIP: this.userInfo.userIP,
        type: "更新",
        info: `更新图书：${book.name}`,
        creditCount: 0,
        adddate: adddate,
      };

      await axios.post("http://localhost:3000/api/addLog", newLog);
    },

    async delBook(book) {
      try {
        await axios.post(`http://localhost:3000/api/delBook/${book.id}`, book);
        // this.alertMsg = "删除图书成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除图书失败";
      }
      // 删除收藏表
      try {
        await axios.post(
          `http://localhost:3000/api/delFavoriteByBookName/${book.name}`
        );
        // this.alertMsg = "取消收藏成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除收藏失败";
      }

      // 添加删除日志
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      const newLog = {
        username: this.userInfo.username,
        userIP: this.userInfo.userIP,
        type: "删除",
        info: `删除图书：${book.name}`,
        creditCount: 0,
        adddate: adddate,
      };

      await axios.post("http://localhost:3000/api/addLog", newLog);

      this.selectBooks();
    },

    openEdit(book) {
      this.editMsg = book.info;
      this.editId = book.id;
    },

    sortBooks(column) {
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

  mounted() {
    this.selectBooks();
    this.selectMenuTitles();
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

.book-info {
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
