<!-- src/layouts/DefaultLayout.vue -->
<template>
    <a-layout
        style="
            min-height: 100vh;
            width: 100vw;
            overflow: hidden;
            background: white;
        "
    >
        <a-layout-sider
            v-model:collapsed="collapsed"
            collapsible
            :style="{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                background: '#fff',
            }"
        >
            <div class="logo" />
            <a-menu
                v-model:selectedKeys="selectedKeys"
                theme="light"
                @click="handleMenuClick"
                mode="inline"
                style="background: #fff; border-right: none"
            >
                <a-menu-item key="home">
                    <span>房源列表</span>
                </a-menu-item>
                <a-menu-item key="about">
                    <span>用户列表</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout :style="{ marginLeft: collapsed ? '80px' : '200px' }">
            <a-layout-header
                style="
                    background: #fff;
                    padding: 0 24px;
                    box-shadow: 0 2px 8px #f0f1f2;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                "
            >
                <a-dropdown>
                    <a-avatar
                        style="cursor: pointer"
                        :size="32"
                        src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                    />
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="profile" @click="showProfile">
                                <user-outlined />
                                <span>个人信息</span>
                            </a-menu-item>
                            <a-menu-item key="logout" @click="handleLogout">
                                <logout-outlined />
                                <span>退出登录</span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </a-layout-header>
            <a-layout-content style="margin: 24px 16px 0; overflow: initial">
                <div
                    :style="{
                        padding: '24px',
                        background: '#fff',
                        minHeight: 'calc(100vh - 112px)',
                    }"
                >
                    <router-view />
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center; padding: 12px">
                Ant Design ©2023 Created by Ant UED
            </a-layout-footer>
        </a-layout>

        <!-- 个人信息弹窗 -->
        <a-modal
            v-model:visible="profileVisible"
            title="个人信息"
            :footer="null"
            width="400px"
        >
            <a-descriptions bordered :column="1">
                <a-descriptions-item label="用户名">
                    {{ userInfo.name || "未设置" }}
                </a-descriptions-item>
                <a-descriptions-item label="手机号">
                    {{ userInfo.phone || "未设置" }}
                </a-descriptions-item>
                <a-descriptions-item label="角色">
                    {{ userInfo.role || "普通用户" }}
                </a-descriptions-item>
            </a-descriptions>
        </a-modal>
    </a-layout>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons-vue";

const router = useRouter();
const route = useRoute();
const selectedKeys = ref<string[]>([]);
const collapsed = ref<boolean>(false);
const profileVisible = ref(false);
const userInfo = ref({
    name: "张三",
    phone: "13800138000",
    role: "管理员",
});

// 根据当前路由设置选中的菜单项
watch(
    () => route.path,
    (path) => {
        selectedKeys.value = [path === "/" ? "home" : "about"];
    },
    { immediate: true }
);

const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
        case "home":
            router.push("/home");
            break;
        case "about":
            router.push("/about");
            break;
        default:
            break;
    }
};

const handleLogout = () => {
    // 清除token
    localStorage.removeItem("token");
    // 跳转到登录页
    router.push("/login");
};

const showProfile = () => {
    profileVisible.value = true;
    // 这里可以添加获取用户信息的接口调用
    // getUserInfo().then(res => {
    //     userInfo.value = res.data;
    // });
};
</script>

<style scoped>
.logo {
    height: 32px;
    margin: 16px;
    background: rgba(0, 0, 0, 0.3);
}

.site-layout .site-layout-background {
    background: #fff;
}

.ant-menu-item-selected {
    background-color: #e6f7ff !important;
    color: #1890ff !important;
}

.ant-menu-item:hover {
    background-color: #f5f5f5;
    color: #1890ff;
}

:deep(.ant-layout-sider-trigger) {
    background: #f5f5f5;
    color: black;
}
</style>
