<template>
    <div class="login-container">
        <a-card class="login-card">
            <!-- 新增Tab切换 -->
            <a-tabs v-model:activeKey="activeTab" centered class="auth-tabs">
                <a-tab-pane key="login" tab="登录"></a-tab-pane>
                <a-tab-pane key="register" tab="注册"></a-tab-pane>
            </a-tabs>

            <!-- 登录表单保持不变 -->
            <a-form v-if="activeTab === 'login'" :model="form" :rules="rules" @finish="handleFinish">
                <!-- 原有登录表单内容 -->
                <a-form-item name="username">
                    <a-input
                        v-model:value="form.username"
                        placeholder="用户名"
                        size="large"
                        allow-clear
                    >
                        <template #prefix>
                            <UserOutlined class="input-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item name="password">
                    <a-input-password
                        v-model:value="form.password"
                        placeholder="密码"
                        size="large"
                        allow-clear
                    >
                        <template #prefix>
                            <LockOutlined class="input-icon" />
                        </template>
                    </a-input-password>
                </a-form-item>

                <!-- 登录按钮保持不变 -->
                <a-form-item>
                    <a-button
                        type="primary"
                        size="large"
                        block
                        html-type="submit"
                        :loading="loading"
                    >
                        立即登录
                    </a-button>
                </a-form-item>
            </a-form>

            <!-- 修改注册表单 -->
            <a-form v-else :model="formRegister" :rules="rulesRegister" @finish="handleFinish">
                <!-- 用户名 -->
                <a-form-item name="username">
                    <a-input
                        v-model:value="formRegister.username"
                        placeholder="用户名"
                        size="large"
                        allow-clear
                    >
                        <template #prefix>
                            <UserOutlined class="input-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <!-- 新增邮箱输入 -->
                <a-form-item name="email">
                    <a-input
                        v-model:value="formRegister.email"
                        placeholder="邮箱"
                        size="large"
                        allow-clear
                    >
                        <template #prefix>
                            <MailOutlined class="input-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <!-- 密码 -->
                <a-form-item name="password">
                    <a-input-password
                        v-model:value="formRegister.password"
                        placeholder="密码"
                        size="large"
                        allow-clear
                    >
                        <template #prefix>
                            <LockOutlined class="input-icon" />
                        </template>
                    </a-input-password>
                </a-form-item>

                <!-- 确认密码 -->
                <a-form-item name="confirmPassword">
                    <a-input-password
                        v-model:value="formRegister.confirmPassword"
                        placeholder="确认密码"
                        size="large"
                        allow-clear
                    >
                        <template #prefix>
                            <LockOutlined class="input-icon" />
                        </template>
                    </a-input-password>
                </a-form-item>

                <!-- 添加注册按钮 -->
                <a-form-item>
                    <a-button
                        type="primary"
                        size="large"
                        block
                        html-type="submit"
                        :loading="loading"
                    >
                        立即注册
                    </a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { login, register } from "@/api/user";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const activeTab = ref<'login' | 'register'>('login');

const form = ref({
    username: "",
    password: "",
});

// 修正注册表单数据（添加email字段）
const formRegister = ref({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
});

// 完善注册校验规则
const rulesRegister = ref({
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式不正确' }
    ],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    confirmPassword: [
        { required: true, message: "请确认密码", trigger: "blur" },
        { validator: (rule: any, value: string) => 
            value === formRegister.value.password ? Promise.resolve() : Promise.reject('两次密码输入不一致') 
        }
    ]
});

const rules = ref({
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const loading = ref(false);
// const rememberMe = ref(false);

import { message } from 'ant-design-vue';

const handleFinish = async () => {
    loading.value = true;
    try {
        if (activeTab.value === 'login') {
            // 保留原有登录逻辑
            const res = await login(form.value);
            if (res.code == 200) {
                localStorage.setItem("token", res.access);
                localStorage.setItem("is_staff", JSON.stringify(res.is_staff));
                router.replace("/");
            }
        } else {
            // 完整注册逻辑
            await register({
                username: formRegister.value.username,
                email: formRegister.value.email,
                password: formRegister.value.password,
                password2: formRegister.value.confirmPassword
            });
            message.success('注册成功，请登录');
            activeTab.value = 'login';
            // 重置表单时包含email字段
            formRegister.value = { username: '', email: '', password: '', confirmPassword: '' };
        }
    } catch (error) {
        message.error('注册失败，请检查输入信息');
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
/* 新增Tab样式 */
.auth-tabs {
    margin-bottom: 24px;
}

/* 隐藏Tab下划线 */
:deep(.ant-tabs-nav)::before {
    border-bottom: none !important;
}

/* 调整Tab标签间距 */
:deep(.ant-tabs-tab) {
    padding: 0 32px !important;
    font-size: 16px;
}

.login-container {
    min-height: 100vh;
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
        url("@/assets/login-bg.jpeg") center/cover no-repeat fixed;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.login-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    z-index: 0;
}

.login-card {
    position: relative;
    z-index: 1;
    background: rgba(255, 255, 255, 0.95);
    width: 100%;
    max-width: 420px;
    border-radius: 8px;
    box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.1),
        0 9px 28px 0 rgba(0, 0, 0, 0.05);
}

.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.title {
    font-size: 24px;
    color: #000;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 8px;
}

.sub-title {
    color: rgba(0, 0, 0, 0.8);
    font-size: 14px;
}

.input-icon {
    color: rgba(0, 0, 0, 0.25);
}

.action-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.forgot-password {
    font-size: 14px;
}

.third-login {
    margin-top: 24px;
}

.divider {
    position: relative;
    color: #666;
    text-align: center;
    margin: 16px 0;
}

.divider::before,
.divider::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background: #eee;
}

.divider::before {
    left: 0;
}

.divider::after {
    right: 0;
}

.icons {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.icon {
    font-size: 24px;
    cursor: pointer;
    transition: color 0.3s;
    color: rgba(255, 255, 255, 0.8);
}

.icon:hover {
    color: #1890ff;
}

.wechat:hover {
    color: #07c160;
}

.github:hover {
    color: #333;
}

.alipay:hover {
    color: #1677ff;
}

.ant-input {
    background: rgba(255, 255, 255, 0.9);
}
</style>
<!--  -->