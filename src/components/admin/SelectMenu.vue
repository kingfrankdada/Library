<template>
  <div class="select-menu">
    <table v-if="menus.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>分类*</th>
          <!-- <th>状态*</th> -->
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(menu, index) in menus" :key="index">
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
            <button class="del-btn" @click="delMenu(menu)">
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
  name: "SelectMenu",
  components: {
    InputTag,
    AlertBox,
  },

  data() {
    return {
      menus: [],
      alertMsg: "",
      boxMsg: "正在加载分类数据...",
    };
  },

  methods: {
    async selectMenus() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectMenu"
        );
        const menus = response.data.menus;
        this.menus = menus || [];

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
        this.alertMsg = "更新分类数据成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新分类数据失败";
      }
    },

    async delMenu(menu) {
      try {
        await axios.post(`http://localhost:3000/api/delMenu/${menu.id}`, menu);
        this.alertMsg = "删除分类成功";
      } catch (error) {
        this.alertMsg =
          "删除分类失败: " + (error.response?.data?.error || error.message);
      }
      this.selectMenus();
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
