import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from '@/views/NotFound'
// import PublicLogin from '@/components/PublicLogin'
// import PublicReg from '@/components/PublicReg'
import PublicHome from '@/views/PublicHome'

import UserBook from '@/views/user/UserBook'
import UserForum from '@/views/user/UserForum'
// import Usernotice from '@/views/user/UserNotice'
import UserSetting from '@/views/user/UserSetting'
import AdminHome from '@/views/admin/AdminHome'

// 管理员二级路由
import AdminBook from '@/views/admin/AdminBook'
import AdminBorrow from '@/views/admin/AdminBorrow'
import AdminMenu from '@/views/admin/AdminMenu'
import AdminForum from '@/views/admin/AdminForum'
import Adminnotice from '@/views/admin/AdminNotice'
import AdminUser from '@/views/admin/AdminUser'
import AdminLog from '@/views/admin/AdminLog'

// 用户三级路由
import UserCollection from '@/views/user/UserCollection'
import UserBorrow from '@/views/user/UserBorrow'
import UserComment from '@/views/user/UserComment'
import UserCredit from '@/views/user/UserCredit'

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
    }, {
      path: '/book',
      name: 'userBook',
      component: UserBook
    },
    {
      path: '/forum',
      name: 'userForum',
      component: UserForum
    },
    {
      path: '/user',
      name: 'userSetting',
      component: UserSetting,
      children: [{
          path: 'collection',
          name: 'userSettingCollection',
          component: UserCollection
        }, {
          path: 'borrow',
          name: 'userSettingBorrow',
          component: UserBorrow
        },
        {
          path: 'comment',
          name: 'userSettingComment',
          component: UserComment
        },
        {
          path: 'credit',
          name: 'userSettingCredit',
          component: UserCredit
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
        },
        {
          path: 'log',
          name: 'adminLog',
          component: AdminLog
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