<template>
  <div class="select-menu">
    <table v-if="filteredMenus.length > 0">
      <thead>
        <tr>
          <th @click="sortMenus('id')">
            ID
            <span :class="getSortIcon('id')"></span>
          </th>
          <th @click="sortMenus('title')">
            分类*
            <span :class="getSortIcon('title')"></span>
          </th>
          <!-- <th>状态*</th> -->
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(menu, index) in sortedMenus" :key="index">
          <td>{{ menu.id }}</td>
          <td>
            <InputTag v-model="menu.title" @input="updateMenu(menu)"></InputTag>
          </td>
          <!-- <td>
            <select v-model="menu.state" @change="updateMenu(menu)">
              <option value="1">正常</option>
              <option value="0">关闭</option>
            </select>
          </td> -->
          <td>
            <button class="del-btn" title="删除" @click="delMenu(menu)">
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
  name: "SelectMenu",
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
      menus: [],
      alertMsg: "",
      boxMsg: "暂无数据...",
      sortColumn: "",
      sortOrder: "asc", // 默认为升序asc
    };
  },

  computed: {
    filteredMenus() {
      const filterList = this.searchText.toLowerCase();
      return this.menus.filter((menu) =>
        menu.title.toLowerCase().includes(filterList)
      );
    },

    sortedMenus() {
      const menus = [...this.filteredMenus];
      if (this.sortColumn) {
        menus.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return menus;
    },
  },

  methods: {
    async selectMenus() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectMenu"
        );
        this.menus = response.data.menus || [];
        if (this.menus.length === 0) {
          this.boxMsg = "未找到任何分类记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取分类数据失败";
      }
    },

    async updateMenu(menu) {
      try {
        await axios.post(
          `http://localhost:3000/api/updateMenu/${menu.id}`,
          menu
        );
        // this.alertMsg = "更新分类数据成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新分类数据失败";
      }
    },

    async delMenu(menu) {
      try {
        await axios.post(`http://localhost:3000/api/delMenu/${menu.id}`, menu);
        // this.alertMsg = "删除分类成功";
      } catch (error) {
        this.alertMsg =
          "删除分类失败: " + (error.response?.data?.error || error.message);
      }
      this.selectMenus();
    },

    sortMenus(column) {
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
    this.selectMenus();
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
  cursor: pointer;
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
