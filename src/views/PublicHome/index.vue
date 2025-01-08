<template>
  <div class="app">
    <div class="header">
      <HeaderGuide></HeaderGuide>
    </div>
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
              'fade-in': currentIndex === index,
              'fade-out': currentIndex !== index,
            }"
          >
            <h1 class="title">{{ slide.title }}</h1>
            <h4 class="subtitle">{{ slide.subtitle }}</h4>
            <button v-if="index === 0" @click="swiperNext">
              Learn More<i class="ri-arrow-right-double-line"></i>
            </button>
            <button v-if="index === 1" @click="goBook">
              开始使用<i class="ri-arrow-right-double-line"></i>
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
import HeaderGuide from "@/components/HeaderGuide.vue";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";

export default {
  name: "PublicHome",
  components: {
    HeaderGuide,
    Swiper,
    SwiperSlide,
  },

  data() {
    return {
      currentIndex: 0,
      swiperOption: {
        notNextTick: false,
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
        },
        {
          title: "图书中心",
          subtitle:
            "提供了丰富的在线书库，方便快速浏览和查找各类图书资源。即时借阅功能让图书获取变得轻松高效，全站搜索支持模糊匹配，帮助精准定位感兴趣的书籍，极大提升借阅体验。",
        },
        {
          title: "论坛中心",
          subtitle:
            "提供了站内交流平台，致力于促进图书和学习资源的共享与讨论。参与各类话题讨论，发布和回复帖子，分享经验与见解，共同推动学术交流与思维碰撞。",
        },
        {
          title: "用户中心",
          subtitle: "用户管理：支持用户信息管理、权限控制...",
        },
        {
          title: "项目介绍与支持",
          subtitle: "本项目采用 Vue.js + Vuex + Vue Router + Remix Icon...",
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
    this.$nextTick(() => {
      this.swiper.swiperInstance.slideTo(0, false);
    });
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
    swiperNext() {
      this.swiper.swiperInstance.slideNext();
    },

    onSlideChange() {
      this.currentIndex = this.swiper.swiperInstance.realIndex;
    },

    goBook() {
      this.$nextTick(() => {
        this.$router.push("/home/book");
      });
    },
  },
};
</script>

<style scoped>
@import "./index.less";
</style>
