// src/router/index.ts import { createRouter, createWebHistory } from
import { createRouter, createWebHistory } from "vue-router";
import Layout from "../layouts/layout.vue";
import About from "../views/about.vue";
import Home from "../views/home.vue";
import Login from "../views/login.vue";
const routes = [
    {
        path: "/",
        component: Layout,
        redirect: "/home",
        children: [
            { path: "/home", name: "Home", component: Home },
            { path: "/about", name: "About", component: About },
        ],
    },
    { path: "/login", name: "Login", component: Login },
];
const router = createRouter({ history: createWebHistory(), routes });

// 添加全局前置路由守卫
router.beforeEach((to, from, next) => {
    // 这里可以添加导航控制逻辑，例如：
    // console.log(`Navigating from ${from.path} to ${to.path}`);
    // 必须调用next()继续导航
    next();
});

export default router;
