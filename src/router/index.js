import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/login'
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
                component: () => import ("../views/Dashboard.vue")
            }, {
                path: "/userManager",
                name: "user",
                meta: {
                    title: '用户管理'
                },
                component: () => import ("../views/UserManager.vue")
            }, {
                path: "/tendencyManager",
                name: "tendency",
                meta: {
                    title: '动态管理'
                },
                component: () => import ("../views/TendencyManager.vue"),
            }, {
                path: "/socialManager",
                name: "social",
                meta: {
                    title: '平台管理'
                },
                component: () => import ("../views/SocialManager.vue")
            }, {
                path: "/groupManager",
                name: "group",
                meta: {
                    title: '兴趣小组管理'
                },
                component: () => import ("../views/GroupManager.vue")
            }, {
                path: "/activityManager",
                name: "activity",
                meta: {
                    title: '活动管理'
                },
                component: () => import ("../views/ActivityManager.vue")
            }, {
                path: "/activationCodeManager",
                name: "activationCode",
                meta: {
                    title: '激活码管理'
                },
                component: () => import ("../views/ActivationCodeManager.vue")
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import (
        "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`;
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