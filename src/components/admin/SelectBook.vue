<template>
  <div class="select-book">
    <table v-if="filteredBooks.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>书名*</th>
          <th>作者*</th>
          <th>分类*</th>
          <th>价格*</th>
          <th>出版社*</th>
          <th>库存数量*</th>
          <th>封面</th>
          <th>更多信息*</th>
          <th>状态*</th>
          <th>添加日期</th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(book, index) in filteredBooks" :key="index">
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
          <td>
            <InputTag v-model="book.more" @input="updateBook(book)"></InputTag>
          </td>
          <td>
            <select v-model="book.state" @change="updateBook(book)">
              <option value="1">正常</option>
              <option value="0">关闭</option>
            </select>
          </td>
          <td>{{ book.adddate }}</td>
          <td>
            <button class="del-btn" @click="delBook(book)">
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
      @close="alertMsg = null"
    ></AlertBox>
  </div>
</template>

<script>
import axios from "axios";
import InputTag from "../InputTag.vue";
import AlertBox from "../AlertBox.vue";

export default {
  name: "SelectBook",
  components: {
    InputTag,
    AlertBox,
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
      boxMsg: "暂无数据...",
    };
  },

  computed: {
    filteredBooks() {
      const filterList = this.searchText.toLowerCase();
      return this.books.filter(
        (book) =>
          book.name.toLowerCase().includes(filterList) ||
          book.author.toLowerCase().includes(filterList) ||
          book.menu.toLowerCase().includes(filterList)
      );
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
        this.alertMsg = "更新图书数据成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新图书数据失败";
      }
    },

    async delBook(book) {
      try {
        await axios.post(`http://localhost:3000/api/delBook/${book.id}`, book);
        this.alertMsg = "删除图书成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除图书失败";
      }
      this.selectBooks();
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
}

th {
  background-color: #f2f2f2;
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
</style>
