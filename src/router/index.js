import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from '@/views/NotFound.vue'
// import PublicLogin from '@/components/PublicLogin.vue'
// import PublicReg from '@/components/PublicReg.vue'
import PublicHome from '@/views/PublicHome.vue'

import UserBook from '@/views/user/UserBook.vue'
import UserForum from '@/views/user/UserForum.vue'
// import Usernotice from '@/views/user/UserNotice.vue'
import UserSetting from '@/views/user/UserSetting.vue'
import AdminHome from '@/views/admin/AdminHome.vue'

import AdminBook from '@/views/admin/AdminBook.vue'
import AdminBorrow from '@/views/admin/AdminBorrow.vue'
import AdminMenu from '@/views/admin/AdminMenu.vue'
import AdminForum from '@/views/admin/AdminForum.vue'
import Adminnotice from '@/views/admin/AdminNotice.vue'
import AdminUser from '@/views/admin/AdminUser.vue'

Vue.use(VueRouter)

// 创建路由对象
const router = new VueRouter({
  mode: 'history',
  // mode: 'hash',
  routes: [{
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: PublicHome,
      children: [{
          path: 'book',
          name: 'userBook',
          component: UserBook
        },
        {
          path: 'forum',
          name: 'userForum',
          component: UserForum
        },
        // {
        //   path: 'notice',
        //   name: 'usernotice',
        //   component: Usernotice
        // },
        {
          path: 'setting',
          name: 'userSetting',
          component: UserSetting
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminHome,
      children: [{
          path: 'book',
          name: 'adminBook',
          component: AdminBook
        },
        {
          path: 'borrow',
          name: 'adminBorrow',
          component: AdminBorrow
        },
        {
          path: 'menu',
          name: 'adminMenu',
          component: AdminMenu
        },
        {
          path: 'forum',
          name: 'adminForum',
          component: AdminForum
        },
        {
          path: 'notice',
          name: 'adminnotice',
          component: Adminnotice
        },
        {
          path: 'user',
          name: 'adminUser',
          component: AdminUser
        }
      ]
    },
    {
      path: '*',
      component: NotFound
    }
  ],
})

export default router