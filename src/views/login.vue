<template>
    <div class="login-container">
        <!-- 登录卡片 -->
        <a-card class="login-card">
            <!-- 标题 -->
            <div class="login-header">
                <h2 class="title">欢迎登录</h2>
                <div class="sub-title">Vue3 Admin System</div>
            </div>

            <!-- 表单 -->
            <a-form :model="form" :rules="rules" @finish="handleFinish">
                <!-- 用户名 -->
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

                <!-- 密码 -->
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

                <!-- 操作区 -->
                <a-form-item>
                    <div class="action-row">
                        <span></span>
                        <a href="#" class="forgot-password">立即注册</a>
                    </div>
                </a-form-item>

                <!-- 登录按钮 -->
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
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { login } from "@/api/user";
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const form = ref({
    username: "",
    password: "",
});

const rules = ref({
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const loading = ref(false);
// const rememberMe = ref(false);

const handleFinish = async () => {
    loading.value = true;
    try {
        login(form.value).then((res: any) => {
            console.log(res);
            if (res.code == 200) {
                localStorage.setItem("token", res.access); // 新增的token存储
                router.replace("/");
            }
        });
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
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
