import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import (
                /* webpackChunkName: "dashboard" */
                "../views/Dashboard.vue")
            }, {
                path: "/userManager",
                name: "user",
                meta: {
                    title: '用户管理'
                },
                component: () => import (
                /* webpackChunkName: "table" */
                "../views/UserManager.vue")
            }, {
                path: "/tendencyManager",
                name: "tendency",
                meta: {
                    title: '动态管理'
                },
                component: () => import (
                /* webpackChunkName: "charts" */
                "../views/TendencyManager.vue")
            }, {
                path: "/socailManager",
                name: "social",
                meta: {
                    title: '平台管理'
                },
                component: () => import (
                /* webpackChunkName: "form" */
                "../views/SocailManager.vue")
            }, {
                path: "/groupManager",
                name: "group",
                meta: {
                    title: '兴趣小组管理'
                },
                component: () => import (
                /* webpackChunkName: "tabs" */
                "../views/GroupManager.vue")
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import (
        /* webpackChunkName: "login" */
        "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;