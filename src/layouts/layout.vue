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
                    <span>房源信息</span>
                </a-menu-item>
                <a-menu-item key="fychart">
                    <span>城市对比</span>
                </a-menu-item>
                <a-menu-item key="fyzhanbi">
                    <span>区域对比</span>
                </a-menu-item>
                <a-menu-item key="clusterAnalysis">
                    <span>聚类分析</span>
                </a-menu-item>
                <a-menu-item key="about" v-if="is_staff">
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
                    {{ userInfo.username || "未设置" }}
                </a-descriptions-item>
                <a-descriptions-item label="邮箱">
                    {{ userInfo.email || "未设置" }}
                </a-descriptions-item>
                <a-descriptions-item label="角色">
                    {{ userInfo.is_staff ? "管理员" : "普通用户" }}
                </a-descriptions-item>
            </a-descriptions>

            <!-- 添加修改密码入口 -->
            <div style="margin-top: 24px; border-top: 1px solid #f0f0f0; padding-top: 16px;">
                <a-button type="link" @click="showChangePassword = true" block>
                    修改密码
                </a-button>
            </div>
        </a-modal>
        
        <!-- 新增修改密码弹窗 -->
        <a-modal
            v-model:visible="showChangePassword"
            title="修改密码"
            :footer="null"
            width="400px"
        >
            <a-form :model="passwordForm" :rules="passwordRules" @finish="handleChangePassword">
                <a-form-item name="oldPassword">
                    <a-input-password
                        v-model:value="passwordForm.oldPassword"
                        placeholder="旧密码"
                        size="large"
                    />
                </a-form-item>
                
                <a-form-item name="newPassword">
                    <a-input-password
                        v-model:value="passwordForm.newPassword"
                        placeholder="新密码（至少6位）"
                        size="large"
                    />
                </a-form-item>
                
                <a-form-item name="confirmPassword">
                    <a-input-password
                        v-model:value="passwordForm.confirmPassword"
                        placeholder="确认密码"
                        size="large"
                    />
                </a-form-item>
        
                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        block
                        :loading="changingPassword"
                    >
                        提交修改
                    </a-button>
                </a-form-item>
            </a-form>
        </a-modal>
    </a-layout>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { getUserInfo, updatePassword } from "@/api/user";

const is_staff = JSON.parse(localStorage.getItem("is_staff") || "false");
const router = useRouter();
const route = useRoute();
const selectedKeys = ref<string[]>([]);
const collapsed = ref<boolean>(false);
const profileVisible = ref(false);
const userInfo = ref<any>({
});

// 根据当前路由设置选中的菜单项
watch(
    () => route.path,
    (path) => {
        selectedKeys.value = [path.split("/")[1]];
    },
    { immediate: true }
);

const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
        case "home":
            selectedKeys.value = ["home"];
            collapsed.value = false;
            router.push("/home");
            break;
        case "about":
            selectedKeys.value = ["about"];
            collapsed.value = false;
            router.push("/about");
            break;
        case "fychart":
            selectedKeys.value = ["fyChart"];
            collapsed.value = false;
            router.push("/fychart");
            break;
        case "fyzhanbi":
            selectedKeys.value = ["fyzhanbi"];
            collapsed.value = false;
            router.push("/fyzhanbi");
            break;
        case "clusterAnalysis":
            selectedKeys.value = ["clusterAnalysis"];
            collapsed.value = false;
            router.push("/clusterAnalysis");
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
    getUserInfo().then((res:any) => {
        userInfo.value = res.data;
    });
};

// 添加新的响应式变量
const showChangePassword = ref(false);
const changingPassword = ref(false);
const passwordForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});

// 添加密码验证规则
const passwordRules = {
    oldPassword: [{ required: true, message: '请输入旧密码' }],
    newPassword: [
        { required: true, message: '请输入新密码' },
        { min: 6, message: '密码至少6位' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码' },
        { validator: (_, value) => 
            value === passwordForm.value.newPassword ? 
            Promise.resolve() : Promise.reject('两次密码不一致')
        }
    ]
};

// 添加修改密码方法
const handleChangePassword = async () => {
    try {
        changingPassword.value = true;
        const { oldPassword, newPassword, confirmPassword } = passwordForm.value;
        const res:any = await updatePassword({
            "old_password": oldPassword,
        "new_password": newPassword,
        "new_password2": confirmPassword
        });
        if (res.code !== 200)  throw new Error(res.message);
        message.success('密码修改成功');
        showChangePassword.value = false;
        passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
    } catch (error) {
        message.error('密码修改失败');
    } finally {
        changingPassword.value = false;
    }
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
