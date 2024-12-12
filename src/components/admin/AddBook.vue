<template>
  <div class="add-book">
    <table>
      <thead>
        <tr>
          <th>字段</th>
          <th>输入</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>书名*</td>
          <td>
            <input v-model="newBook.name" type="text" placeholder="输入书名" />
          </td>
        </tr>
        <tr>
          <td>作者*</td>
          <td>
            <input
              v-model="newBook.author"
              type="text"
              placeholder="输入作者"
            />
          </td>
        </tr>
        <tr>
          <td>分类*</td>
          <td>
            <select v-model="newBook.menu">
              <option v-for="title in menuTitles" :key="title" :value="title">
                {{ title }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td>价格*</td>
          <td>
            <input
              v-model="newBook.price"
              type="number"
              placeholder="输入价格"
              :min="1"
            />
          </td>
        </tr>
        <tr>
          <td>出版社*</td>
          <td>
            <input
              v-model="newBook.press"
              type="text"
              placeholder="输入出版社"
            />
          </td>
        </tr>
        <tr>
          <td>库存数量*</td>
          <td>
            <input
              v-model="newBook.num"
              type="number"
              placeholder="输入库存数量"
              :min="1"
            />
          </td>
        </tr>
        <tr>
          <td>封面</td>
          <td class="image-upload-container">
            <input
              type="file"
              ref="imageInput"
              @change="handleImageChange"
              accept=".jpg, .jpeg, .png, .gif"
            />
            <span v-if="selectedImage" class="close-button" @click="clearImage"
              >&times;</span
            >
          </td>
        </tr>
        <tr>
          <td>更多信息</td>
          <td>
            <textarea
              v-model="newBook.info"
              type="text"
              placeholder="输入图书详情内容"
            />
          </td>
        </tr>
        <tr>
          <td>状态*</td>
          <td>
            <select v-model="newBook.state">
              <option value="1">正常</option>
              <option value="0">关闭</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            自动推送公告<i
              class="ri-question-line"
              style="
                margin-left: 5px;
                color: var(--first-color);
                font-size: 16px;
              "
              title="开启后在图书上线时自动推送公告，可在管理员仪表盘-公告管理中查看"
            ></i>
          </td>
          <td>
            <select v-model="isNoticeActive">
              <option :value="true">开启</option>
              <option :value="false">关闭</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>添加日期</td>
          <td>
            {{ new Date().toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="submitForm">提交</button>
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
  name: "AddBook",
  components: {
    AlertBox,
  },

  data() {
    return {
      newBook: {
        name: "",
        author: "",
        menu: "",
        price: "",
        press: "",
        num: "1",
        img: "",
        info: "",
        state: "1",
        adddate: "",
      },
      menuTitles: [],
      alertMsg: "",
      selectedImage: null, // 暂存选中的图片
      isNoticeActive: true, // 默认开启自动推送
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

  methods: {
    async fetchMenuTitles() {
      try {
        const response = await api.get(endpoints.menuTitles);
        this.menuTitles = response.data.titles;
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "获取分类信息失败";
      }
    },

    clearImage() {
      this.selectedImage = null;
      this.$refs.imageInput.value = ""; // 清空文件输入
    },

    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        // 检测文件类型
        const allowedFileList = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
        ];

        if (!allowedFileList.includes(file.type)) {
          this.alertMsg = "请上传图片格式文件（jpg, jpeg, png, gif）";
          this.selectedImage = null;
          event.target.value = "";
          return;
        }

        this.selectedImage = file;
      }
    },

    async uploadImage() {
      if (this.selectedImage) {
        const formData = new FormData();
        formData.append("file", this.selectedImage);

        try {
          const response = await api.post(endpoints.uploadImage, formData);
          this.newBook.img = response.data.fileName;
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          this.alertMsg = "图片上传失败";
        }
      }
    },

    async submitForm() {
      this.newBook.adddate = new Date().toISOString().split("T")[0];

      if (
        !this.newBook.name ||
        !this.newBook.author ||
        !this.newBook.menu ||
        !this.newBook.price ||
        !this.newBook.press ||
        !this.newBook.num ||
        !this.newBook.state
      ) {
        this.alertMsg = "图书信息不完整";
        return;
      }

      if (!this.newBook.info) {
        this.newBook.info = "暂无备注";
      }

      try {
        await this.uploadImage(); // 上传图片
        await api.post(endpoints.addBook, this.newBook);
        // 自动推送
        if (this.isNoticeActive) {
          const newNotice = {
            title: "【新书上架通知】" + this.newBook.name,
            info: this.newBook.info,
            top: 0, // 默认不置顶
            adduser: this.userInfo.username,
            adddate: new Date().toISOString().split("T")[0],
          };
          try {
            await api.post(endpoints.addNotice, newNotice);
            // 添加更新日志
            const adddate = new Date().toLocaleString("sv-SE", {
              timeZoneName: "short",
            });
            const newLog = {
              username: this.userInfo.username,
              userIP: this.userInfo.userIP,
              type: "新增",
              info: `新增图书：${this.newBook.name}`,
              creditCount: null,
              adddate: adddate,
            };
            await api.post(endpoints.addLog, newLog);
          } catch (error) {
            console.error(error.response?.data?.error || error.message);
            this.alertMsg = "公告添加失败";
          }
        }
        this.alertMsg = "图书添加成功";
        this.resetForm(); // 提交后重置表单
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "图书添加失败";
      }
    },

    resetForm() {
      this.newBook = {
        name: "",
        author: "",
        menu: "",
        price: "",
        press: "",
        num: "1",
        img: "",
        info: "",
        state: "1",
        adddate: "",
      };
      this.selectedImage = null; // 重置选中的图片
      this.$refs.imageInput.value = ""; // 重置文件输入
    },
  },
  mounted() {
    this.fetchMenuTitles();
  },
};
</script>

<style scoped>
.add-book {
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
  background-color: #f2f2f2;
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
  background-color: var(--white-color);
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
}

textarea[type="text"] {
  height: 100px;
  font-family: var(--body-font);
  font-size: 16px;
}

.image-upload-container {
  position: relative;
}

input[type="file"] {
  width: 100%;
  padding: 5px;
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