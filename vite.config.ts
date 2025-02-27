import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": "/src",
            "ant-design-vue": "/node_modules/ant-design-vue", // 添加别名配置
        },
    },
});
