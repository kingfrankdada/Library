<template>
  <div class="notice-system">
    <!-- 置顶公告 -->
    <section class="header-notice">
      <div class="notice top" @click="openUserNotice">用户须知</div>
      <div class="notice top" @click="openBorrowNotice">借阅须知</div>
    </section>

    <!-- 其他公告 -->
    <section class="other-Notice">
      <div
        class="notice"
        v-for="(item, index) in notices"
        :key="index"
        @click="openNotice(item)"
      >
        {{ item.title }}
      </div>
    </section>

    <!-- 模态框 -->
    <NormalModal v-if="isNoticeModalVisible" class="notice-modal" size="large">
      <div class="notice-modal-title">公告详情</div>
      <pre class="notice-modal-text">{{ boxMsg }}</pre>
    </NormalModal>
  </div>
</template>

<script>
import axios from "axios";
import NormalModal from "@/components/NormalModal";
import { mapState, mapMutations } from "vuex";

export default {
  name: "UserNotice",

  components: {
    NormalModal,
  },

  computed: {
    ...mapState("NormalModal", ["isNoticeModalVisible"]),
  },

  mounted() {
    this.selectNotice();
  },

  data() {
    return {
      notices: [],
      boxMsg: "正在加载公告数据...",
    };
  },

  methods: {
    ...mapMutations("NormalModal", ["setNoticeModalVisible"]),

    openUserNotice() {
      this.setNoticeModalVisible(true);
      this.boxMsg = `欢迎使用本图书管理系统！为了维护良好的使用环境，确保系统的安全与稳定，请您在使用过程中遵守以下规则：

    1. 注册与登录
    请确保使用真实信息进行注册。用户须对自己的账户和密码安全负责，避免将登录信息透露给他人。若发现账户异常使用，请及时更改密码并联系管理员。

    2. 合法使用
    用户在使用本系统时，必须遵守相关法律法规。严禁上传、发布、传播任何非法、虚假或具有侵犯他人权利的内容，禁止恶意攻击系统或以任何形式破坏系统的正常运行。

    3. 图书借阅
    请合理利用图书资源，遵守图书借阅规则。若图书逾期归还，系统将根据相关规定进行提醒或罚款，确保其他用户能够公平使用资源。

    4. 数据安全与隐私保护
    系统会保护您的个人信息，但用户也需自觉维护数据安全。请勿尝试获取系统权限以外的数据信息，违者将被严肃处理。

    5. 论坛互动
    论坛板块为用户提供交流和讨论的平台，用户应文明发言，尊重他人，不发布涉及人身攻击、广告或不符合平台规定的内容。

    6. 违规处理
    对于违反上述规定的行为，系统管理员有权采取措施，包括但不限于警告、暂停使用权限、永久封号等。

    请仔细阅读并严格遵守，您的理解与配合将为所有用户营造一个安全、高效的图书管理平台。`;
    },

    openBorrowNotice() {
      this.setNoticeModalVisible(true);
      this.boxMsg = `借阅须知：

    1. 借阅流程：
    用户可以通过图书管理系统查询并借阅图书。请确认图书库存情况，并根据系统提示完成借阅操作。

    2. 借阅期限：
    每本图书的借阅期限为30天。若需延长借阅时间，请在到期前通过系统进行续借。每本图书最多可续借一次。

    3. 逾期处理：
    若图书未按时归还，将产生逾期费用。逾期费用按照每日0.5元计算，直到归还图书为止。请及时归还借阅的图书，以免产生额外费用。

    4. 图书损坏与赔偿：
    借阅期间，请爱护所借图书。如图书损坏或丢失，用户需按照图书的原价进行赔偿。

    5. 借阅限制：
    每位用户最多可同时借阅5本图书。超过借阅限制时，需归还部分图书后才能继续借阅。

    请遵守以上借阅规则，确保每位用户都能享有良好的借阅体验。`;
    },

    openNotice(item) {
      this.setNoticeModalVisible(true);
      this.boxMsg = item.info;
    },

    async selectNotice() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectNotice"
        );
        console.log(response);
        this.notices = response.data.notice || [];

        if (this.notices.length === 0) {
          this.boxMsg = "未找到任何公告记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取公告数据失败";
      }
    },
  },
};
</script>

<style scoped>
.notice-system {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background-color);
  padding: 20px;
  padding-top: var(--header-height);
  box-sizing: border-box;
  overflow: hidden;
}

.title {
  font-size: 2.5em;
  font-weight: bold;
  margin: 0;
}

.header-notice {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notice {
  width: 100%;
  max-width: 1200px;
  align-items: center;
  display: flex;
  padding: 20px;
  margin-bottom: 20px;
  background-color: var(--white-color);
  border-radius: 10px;
  font-size: 1.2em;
  color: #333;
  border: 1px solid #90caf9;
}

.top {
  background-color: #1976d2;
  color: var(--white-color);
  font-weight: bold;
  border: 1px solid #1565c0;
  transition: background-color 0.3s;
}

.top:hover {
  background-color: #1565c0;
}

.other-Notice {
  flex: 1;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  max-height: calc(100vh - var(--header-height) - 60px);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.other-Notice::-webkit-scrollbar {
  display: none;
}

.other-Notice .notice {
  background-color: #e3f2fd;
  border: 1px solid #64b5f6;
  transition: background-color 0.3s;
}

.other-Notice .notice:hover {
  background-color: #bbdefb;
}

.notice-modal-title {
  left: 20px;
  width: 100%;
  height: 10%;
  text-align: left;
  font-size: 20px;
  font-weight: var(--font-semi-bold);
  color: var(--first-color);
  margin-top: 20px;
  margin-left: 50px;
}

.notice-modal-text {
  left: 20px;
  width: 100%;
  height: 90%;
  text-align: left;
  font-size: 20px;
  color: black;
  padding: 20px;
  white-space: pre-wrap;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .header-notice {
    flex-direction: column;
  }

  .notice {
    font-size: 1em;
    padding: 15px;
  }

  .title {
    font-size: 2em;
  }
}
</style>
