<template>
  <div class="admin">
    <div class="header">
      <HeaderGuide></HeaderGuide>
    </div>
    <div v-show="this.$route.path === '/admin'" class="home-body">
      <div class="dashboard">
        <!-- 实时数据卡片 -->
        <div class="card real-time-data">
          <div class="card-title">实时数据</div>
          <div class="card-body">
            <div class="card-form-item">
              <h4>在线用户数</h4>
              <span class="card-form-count">{{ onlineUserCount }}</span>
            </div>
            <div class="card-form-item">
              <h4>收录图书数</h4>
              <span class="card-form-count">{{ books.length }}</span>
            </div>
          </div>
        </div>
        <!-- CPU数据卡片 -->
        <div class="card cpu-data">
          <div class="card-title">服务器处理器数据</div>
          <div class="card-body">
            <div class="card-form-item">
              <span class="card-form-text">
                CPU型号:
                <br />
                {{ systemInfo.cpuUsage.brand }}
                <br />
                CPU频率(GHz):
                <br />
                {{ systemInfo.cpuUsage.speed.toFixed(2) }}
              </span>
              <div class="sys-chart-container" ref="cpuChartContainer"></div>
            </div>
          </div>
        </div>
        <!-- 内存数据卡片 -->
        <div class="card book-data">
          <div class="card-title">服务器内存数据</div>
          <div class="card-body">
            <div class="card-form-item">
              <span class="card-form-text">
                内存总大小:
                <br />
                {{ formatSpeed(systemInfo.memoryUsage.totalMemory) }}
                <br />
                已使用内存:
                <br />
                {{ formatSpeed(systemInfo.memoryUsage.usedMemory) }}
              </span>
              <div class="sys-chart-container" ref="memChartContainer"></div>
            </div>
          </div>
        </div>
        <!-- 账号活跃情况卡片 -->
        <div class="card account-activity">
          <div class="card-title">历史在线记录</div>
          <div class="card-body">
            <div
              class="history-count-chart-container"
              ref="historyCountChartContainer"
            ></div>
          </div>
        </div>
        <!-- 图书类型占比卡片 -->
        <!-- <div class="card book-type-ratio">
          <div class="card-title">图书类型占比</div>
          <div class="card-body">
            <div
              class="menu-chart-container"
              ref="bookTypeChartContainer"
            ></div>
          </div>
        </div> -->
        <!-- 公告卡片 -->
        <div class="card notice-ratio">
          <div class="card-title">站内公告</div>
          <div class="card-body">
            <div class="notice-chart-container">
              <ul class="notice-list">
                <li
                  v-for="notice in pinnedNotices"
                  :key="notice.id"
                  class="notice-item"
                  @click="openNotice(notice)"
                >
                  <span class="top-notice">[置顶]</span>
                  {{ notice.title }} - {{ notice.adddate }}
                </li>
              </ul>

              <!-- 普通公告列表 -->
              <ul class="notice-list">
                <li
                  v-for="notice in regularNotices"
                  :key="notice.id"
                  class="notice-item"
                  @click="openNotice(notice)"
                >
                  {{ notice.title }} - {{ notice.adddate }}
                </li>
              </ul>
            </div>

            <!-- 公告详情展示区域 -->
            <NoticeBox
              class="notice-box"
              v-if="selectedNotice"
              :notice="selectedNotice"
              @close="selectedNotice = null"
            ></NoticeBox>
          </div>
        </div>
      </div>
    </div>
    <router-view class="admin-body"></router-view>
    <AdminLeftGuide class="left-guide-model"></AdminLeftGuide>
    <!-- 自定义弹窗捕获 -->
    <AlertBox
      v-if="alertMsg"
      :message="alertMsg"
      @close="alertMsg = null"
    ></AlertBox>
  </div>
</template>

<script>
import HeaderGuide from "@/components/HeaderGuide";
import AdminLeftGuide from "@/components/admin/AdminLeftGuide";
import AlertBox from "@/components/AlertBox.vue";
import * as echarts from "echarts";
import { mapState, mapMutations } from "vuex";
import NoticeBox from "@/components/NoticeBox.vue";
import axios from "axios";

export default {
  name: "AdminHome",

  data() {
    return {
      systemInfo: {
        cpuUsage: {
          brand: "获取中...",
          speed: 0,
          usedPercentage: 0,
        },
        memoryUsage: {
          totalMemory: 0,
          usedMemory: 0,
          usedPercentage: 0,
        },
      },
      books: [],
      menuTitles: [],
      dailyUser: [],
      notices: [], // 存储公告数据
      selectedNotice: null, // 存储当前选中的公告
      typeCount: {},
      alertMsg: "",
      pollingInterval: null,
      cpuChart: null,
      memChart: null,
      historyCountChart: null,
    };
  },

  components: {
    HeaderGuide,
    AdminLeftGuide,
    AlertBox,
    NoticeBox,
  },

  created() {
    if (!this.userInfo.isAdmin) {
      this.$router.push("/home");
    }
    this.getSystemInfo();
  },

  mounted() {
    this.initCpuChart();
    this.initMemChart();
    this.getDailyUser();
    this.selectBooks();
    this.selectNotice();

    window.addEventListener("resize", this.resizeCharts);

    this.pollingInterval = setInterval(() => {
      this.getSystemInfo();
      this.$nextTick(() => {
        this.updateMemChart();
        this.updateCpuChart();
        // this.updateBookMenusChart();
      });
    }, 2000);
  },

  beforeDestroy() {
    // 防止内存泄漏
    window.removeEventListener("resize", this.resizeCharts);
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    if (this.cpuChart || this.memChart || this.historyCountChart) {
      this.cpuChart.dispose();
      this.memChart.dispose();
      this.historyCountChart.dispose();
    }
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
    ...mapState("AdminLeftGuide", ["isLeftGuideVisible"]),
    ...mapState("SysInfo", ["onlineUserCount"]),
    ...mapState("NormalModal", ["isNoticeModalVisible"]),

    // 置顶公告
    pinnedNotices() {
      return this.notices.filter((notice) => notice.top);
    },

    // 普通公告
    regularNotices() {
      return this.notices.filter((notice) => !notice.top);
    },
  },

  watch: {
    $route() {
      this.$nextTick(() => {
        this.resizeCharts();
      });
    },
  },

  methods: {
    ...mapMutations("NormalModal", ["setNoticeModalVisible"]),

    // 选择公告时，传递数据给 NoticeBox 组件
    openNotice(notice) {
      this.selectedNotice = notice;
    },

    // 获取公告数据
    async selectNotice() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectNotice"
        );
        this.notices = response.data.notice || [];

        if (this.notices.length === 0) {
          this.selectedNotice = { info: "未找到任何公告记录" };
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.selectedNotice = { info: "获取公告数据失败" };
      }
    },

    // 动态调整图表
    resizeCharts() {
      if (this.cpuChart) this.cpuChart.resize();
      if (this.memChart) this.memChart.resize();
      if (this.historyCountChart) this.historyCountChart.resize();
    },

    // 获取系统信息
    async getSystemInfo() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/systemInfo"
        );
        this.systemInfo = response.data;
      } catch (error) {
        console.error("获取系统信息失败:", error);
      }
    },

    // 获取历史在线用户
    async getDailyUser() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectDailyUser"
        );
        // console.log(response);
        const dailyUser = response.data.dailyUser;

        this.dailyUser = (dailyUser || []).sort((a, b) => {
          return new Date(a.sys_date) - new Date(b.sys_date);
        });

        if (this.dailyUser.length === 0) {
          this.alertMsg = "未找到任何在线用户记录";
        } else {
          // 获取数据后，历史在线表
          this.$nextTick(() => {
            this.initHistoryCountChart();
          });
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "获取历史在线数据失败";
      }
    },

    // 获取所有图书
    async selectBooks() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectBook"
        );
        const books = response.data.books;
        this.books = books || [];

        if (this.books.length === 0) {
          this.alertMsg = "未找到任何图书记录";
        } else {
          // 获取数据后，更新分类占比表
          this.$nextTick(() => {
            // this.initBookMenusChart();
          });
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "获取图书数据失败";
      }
    },

    // 格式化速度
    formatSpeed(speed) {
      if (isNaN(speed) || speed === undefined || speed === null || speed < 0) {
        return "获取中...";
      }
      if (speed < 1024 * 1024) {
        return `${(speed / 1024).toFixed(2)} Kb`;
      } else if (speed < 1024) {
        return `${(speed / 1024 / 1024).toFixed(2)} MB`;
      } else {
        return `${(speed / 1024 / 1024 / 1024).toFixed(2)} GB`;
      }
    },

    // 初始化历史用户登录统计图表
    initHistoryCountChart() {
      const chartContainer = this.$refs.historyCountChartContainer;
      this.historyCountChart = echarts.init(chartContainer);
      const data = this.dailyUser.map((item) => [
        new Date(item.sys_date),
        Number(item.user_count),
      ]);

      const option = {
        tooltip: {
          trigger: "axis",
          confine: true,
          position(pt) {
            return [pt[0], "10%"];
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.map((item) => {
            const date = new Date(item[0]);
            return `${date.getFullYear()}-${
              date.getMonth() + 1
            }-${date.getDate()}`;
          }),
          axisLabel: {
            formatter(value) {
              return value;
            },
          },
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          minInterval: 1,
        },
        series: [
          {
            name: "用户数量",
            type: "line",
            // smooth: true,
            symbol: "none",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(84, 112, 198)",
                },
                {
                  offset: 1,
                  color: "rgb(1, 191, 236)",
                },
              ]),
            },
            data: data.map((item) => item[1]),
          },
        ],
      };

      this.historyCountChart.setOption(option);
    },

    // // 初始化图书分类占比图表
    // initBookMenusChart() {
    //   const chartContainer = this.$refs.bookTypeChartContainer;
    //   this.bookTypeChart = echarts.init(chartContainer);

    //   const bookTypes = this.getBookMenus();
    //   const totalBooks = bookTypes.reduce((sum, item) => sum + item.value, 0);

    //   const data = bookTypes.map((item) => ({
    //     name: item.name,
    //     value: (item.value / totalBooks) * 100, // 计算占比
    //   }));

    //   const option = {
    //     series: [
    //       {
    //         name: "图书分类",
    //         type: "pie",
    //         radius: ["50%", "70%"], // 设置环形图的内外半径
    //         avoidLabelOverlap: false,
    //         itemStyle: {
    //           borderRadius: 10,
    //           borderColor: "#fff",
    //           borderWidth: 2,
    //         },
    //         label: {
    //           show: true,
    //           position: "outside",
    //         },
    //         data: data,
    //       },
    //     ],
    //   };

    //   this.bookTypeChart.setOption(option);
    // },

    // // 更新图书分类占比图表
    // updateBookMenusChart() {
    //   const bookTypes = this.getBookMenus();
    //   const totalBooks = bookTypes.reduce((sum, item) => sum + item.value, 0);

    //   const data = bookTypes.map((item) => ({
    //     name: item.name,
    //     value: (item.value / totalBooks) * 100, // 计算占比
    //   }));

    //   const option = {
    //     series: [
    //       {
    //         name: "图书分类",
    //         type: "pie",
    //         radius: ["50%", "70%"], // 设置环形图的内外半径
    //         avoidLabelOverlap: false,
    //         itemStyle: {
    //           borderRadius: 10,
    //           borderColor: "#fff",
    //           borderWidth: 2,
    //         },
    //         label: {
    //           show: true,
    //           position: "outside",
    //         },
    //         data: data, // 更新数据
    //       },
    //     ],
    //   };

    //   this.bookTypeChart.setOption(option);
    // },

    // // 统计每种分类的图书数量
    // getBookMenus() {
    //   this.typeCount = {}; // 重置分类计数
    //   this.books.forEach((book) => {
    //     if (this.typeCount[book.menu]) {
    //       this.typeCount[book.menu]++;
    //     } else {
    //       this.typeCount[book.menu] = 1;
    //     }
    //   });

    //   return Object.entries(this.typeCount).map(([name, value]) => ({
    //     name,
    //     value,
    //   }));
    // },

    // 初始化CPU图表
    initCpuChart() {
      const chartContainer = this.$refs.cpuChartContainer;
      this.cpuChart = echarts.init(chartContainer);

      const gaugeData = [
        {
          value: this.systemInfo.cpuUsage.usedPercentage,
          name: "CPU",
          title: {
            show: true,
            fontSize: 15,
          },
          detail: {
            show: true,
          },
        },
      ];

      const option = {
        series: [
          {
            type: "gauge",
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false,
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 1,
                borderColor: "#464646",
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(84, 112, 198)",
                  },
                  {
                    offset: 1,
                    color: "rgb(1, 191, 236)",
                  },
                ]),
              },
            },
            axisLine: {
              lineStyle: {
                width: 20,
              },
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 10,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
              distance: 50,
            },
            data: gaugeData,
            title: {
              show: true,
              fontSize: 20,
            },
            detail: {
              width: 40,
              height: 14,
              fontSize: 20,
              color: "#464646",
              formatter: "{value}%",
              offsetCenter: ["0%", "0%"],
            },
          },
        ],
      };

      this.cpuChart.setOption(option);
    },

    // 更新CPU图表
    updateCpuChart() {
      this.cpuChart.setOption({
        series: [
          {
            data: [
              {
                value: this.systemInfo.cpuUsage.usedPercentage,
                name: "CPU",
                title: {
                  show: true,
                  fontSize: 15,
                },
                detail: {
                  show: true,
                },
              },
            ],
          },
        ],
      });
    },

    // 初始化内存图表
    initMemChart() {
      const chartContainer = this.$refs.memChartContainer;
      this.memChart = echarts.init(chartContainer);

      const gaugeData = [
        {
          value: this.systemInfo.memoryUsage.usedPercentage,
          name: "MEM",
          title: {
            show: true,
            fontSize: 15,
          },
          detail: {
            show: true,
          },
        },
      ];

      const option = {
        series: [
          {
            type: "gauge",
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false,
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 1,
                borderColor: "#464646",
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(84, 112, 198)",
                  },
                  {
                    offset: 1,
                    color: "rgb(1, 191, 236)",
                  },
                ]),
              },
            },
            axisLine: {
              lineStyle: {
                width: 20,
              },
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 10,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
              distance: 50,
            },
            data: gaugeData,
            title: {
              show: true,
              fontSize: 20,
            },
            detail: {
              width: 40,
              height: 14,
              fontSize: 20,
              color: "#464646",
              formatter: "{value}%",
              offsetCenter: ["0%", "0%"],
            },
          },
        ],
      };

      this.memChart.setOption(option);
    },
    // 更新内存图表
    updateMemChart() {
      this.memChart.setOption({
        series: [
          {
            data: [
              {
                value: this.systemInfo.memoryUsage.usedPercentage,
                name: "MEM",
                title: {
                  show: true,
                  fontSize: 15,
                },
                detail: {
                  show: true,
                },
              },
            ],
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
.admin {
  height: 100%;
  width: 100%;
  z-index: 0;
  background: var(--background-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-body {
  position: fixed;
  height: 100%;
  width: 85%;
  left: 15%;
  transition: left 0.3s ease;
}

.home-body {
  position: fixed;
  left: 15%;
  height: 100%;
  width: 85%;
  padding: 20px;
  overflow-y: auto;
}

.dashboard {
  display: grid;
  grid-template-columns: 50% 23% 23%;
  grid-template-rows: 20% 40% 25%;
  gap: 20px;
  height: 100%;
}

.card {
  background-color: var(--body-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.card-title {
  display: flex;
  font-weight: var(--font-semi-bold);
  font-size: 20px;
  padding: 0 0 5px 0;
}

.card-body {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  padding: 0 5px 5px 0;
  width: 100%;
}

.card-body > * {
  margin-right: auto;
}

.card-form-item {
  width: 100%;
}

.card-form-count {
  font-weight: var(--font-semi-bold);
  position: sticky;
  font-size: 20px;
  color: var(--text-color);
  padding: 0 5px 5px 0;
}

.card-form-text {
  position: absolute;
  padding: 0 5px 5px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 200px;
}

.sys-chart-container {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 450px;
  overflow: visible;
}

.history-count-chart-container {
  top: -30px;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 270px;
  overflow: visible;
}

/* .menu-chart-container {
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  overflow: visible;
} */

.notice-chart-container {
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.notice-box {
  margin-left: 7.5%;
}

.notice-chart-container::-webkit-scrollbar {
  display: none;
}

.real-time-data {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.cpu-data {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
}

.book-data {
  grid-column: 3 / 4;
  grid-row: 1 / 3;
}

/* .book-type-ratio {
  grid-column: 1 / 4;
  grid-row: 3 / 4;
} */

.notice-ratio {
  grid-column: 1 / 4;
  grid-row: 3 / 4;
}

.account-activity {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}

.notice-form {
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 30px;
  color: var(--first-color);
  font-weight: var(--font-medium);
  top: 20px;
  z-index: 0;
}

.notice-list {
  list-style: none;
  padding: 0;
}

.notice-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  z-index: 1;
}

.notice-item:hover {
  background-color: #f0f0f0;
}

.top-notice {
  color: red;
  font-weight: bold;
  margin-right: 5px;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
