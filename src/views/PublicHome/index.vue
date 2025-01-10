<template>
  <div class="app">
    <div v-if="this.$route.path === '/home'" class="body">
      <swiper
        id="swiperBox"
        :options="swiperOption"
        ref="mySwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide
          v-for="(slide, index) in slides"
          :key="index"
          :class="`swiper-slide slide-${index + 1}`"
        >
          <div
            class="page"
            :class="{
              'fade-in': currentIndex == index,
              'fade-out': currentIndex != index,
            }"
          >
            <h1 class="title">{{ slide.title }}</h1>
            <h4 class="subtitle">{{ slide.subtitle }}</h4>
            <button
              :style="slide.btnStyle"
              v-if="slide.btnText"
              @click="slide.btnMethod"
            >
              {{ slide.btnText }}
              <i class="ri-arrow-right-double-line"></i>
            </button>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";

export default {
  name: "PublicHome",
  components: {
    Swiper,
    SwiperSlide,
  },

  data() {
    return {
      currentIndex: 0,
      swiperOption: {
        notNextTick: true,
        direction: "vertical",
        grabCursor: false,
        setWrapperSize: true,
        autoHeight: false,
        slidesPerView: 1,
        mousewheel: true,
        mousewheelControl: true,
        height: window.innerHeight,
        resistanceRatio: 10,
        observeParents: true,
      },
      slides: [
        {
          title: "Smart Organizational Library Assistant Resource",
          subtitle:
            "基于 Vue2 和 Node.js 开发的现代化图书管理平台，旨在为高校提供数字化一站式在线图书管理方案，推动高校图书管理迈向更高效、更现代的数字化时代。",
          btnText: "了解更多",
          btnMethod: this.swiperNext,
        },

        {
          title: "图书中心",
          subtitle:
            "丰富的在线书库，方便快速浏览和查找各类图书资源。即时借阅功能让图书获取变得轻松高效，全站搜索支持模糊匹配，帮助精准定位感兴趣的书籍，极大提升借阅体验。",
          btnText: "即刻借阅",
          btnMethod: this.goBook,
        },
        {
          title: "论坛中心",
          subtitle:
            "即时通信站内交流平台，致力于促进图书和学习资源的共享与讨论。参与各类话题讨论，发布和回复帖子，分享经验与见解，共同推动学术交流与思维碰撞。",
          btnText: "前往查看",
          btnMethod: this.goForum,
        },
        {
          title: "用户中心",
          subtitle:
            "汇聚个人安全设置、信誉分管理、借阅记录与收藏功能，提供全面的账户信息维护与优化。掌控账户隐私与安全，实时查看信誉评分，了解借阅历史与偏好，尽享智能化图书管理体验。",
          btnText: "前往设置",
          btnMethod: this.goSetting,
        },
        {
          title: "项目介绍与支持",
          subtitle:
            "我们为此项目提供持续的技术支持和维护，确保平台在使用过程中能得到及时更新与优化，以应对不断变化的需求。本项目采用MIT开源协议，您可以在GitHub中提供反馈或者寻求帮助与解答。",
          btnText: "View On GitHub",
          btnMethod: () => {
            window.open("https://github.com/kingfrankdada/Library");
          },
          btnStyle: {
            background: "#383838",
            color: "#fff",
          },
        },
      ],
    };
  },

  computed: {
    swiper() {
      return this.$refs.mySwiper;
    },
  },

  mounted() {
    // 读取siwper的当前索引，载入时候从上次缓存中读取
    // const swiperIndex = localStorage.getItem("swiperIndex") || 0;
    // this.$nextTick(() => {
    //   this.swiper.swiperInstance.slideTo(swiperIndex, false);
    // });
  },

  watch: {
    // 如果currentIndex为undefined，刷新窗口
    currentIndex() {
      if (this.currentIndex === undefined) {
        window.location.reload();
      }
    },
  },
  methods: {
    onSlideChange() {
      this.currentIndex = this.swiper.swiperInstance.realIndex;
    },

    swiperNext() {
      this.swiper.swiperInstance.slideNext();
    },

    goBook() {
      this.$nextTick(() => {
        this.$router.push("/book");
      });
    },

    goForum() {
      this.$nextTick(() => {
        this.$router.push("/forum");
      });
    },

    goSetting() {
      this.$nextTick(() => {
        this.$router.push("/user");
      });
    },
  },

  // 离开时候缓存当前索引
  // beforeRouteLeave(to, from, next) {
  //   localStorage.setItem("swiperIndex", this.currentIndex);
  //   next();
  // },
};
</script>

<style scoped>
@import "./index.less";
</style>
