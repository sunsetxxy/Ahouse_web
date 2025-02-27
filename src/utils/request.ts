import { message } from "ant-design-vue"; // 如果使用其他UI库需替换
import type {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();
// 创建axios实例
const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASEURL, // 从环境变量获取
    timeout: 10000,
    withCredentials: true,
});

// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 请求前处理（如添加token）
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 开启loading（如果需要）

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        const { status } = response;
        const res = response.data;

        // 处理HTTP状态码
        switch (status) {
            case 401:
                message.error("登录已过期，请重新登录");
                router.replace("/login");
                return Promise.reject(new Error("未授权"));
            case 403:
                message.error("没有操作权限");
                return Promise.reject(new Error("禁止访问"));
            case 404:
                message.error("请求资源不存在");
                return Promise.reject(new Error("资源未找到"));
            case 500:
                message.error("服务器错误");
                return Promise.reject(new Error("服务器内部错误"));
        }

        // 处理业务状态码
        if (res.code != 200) {
            const errorMsg = res.message || "请求失败，请稍后重试";
            message.error(errorMsg);
            return Promise.reject(new Error(errorMsg));
        }

        return res;
    },
    (error) => {
        // 关闭loading
        if (error.config.loading) {
            error.config.loading.close();
        }
        console.log(error);

        // 处理HTTP错误状态码
        let message = "";
        switch (error.response?.status) {
            case 401:
                message = "身份验证失败，请重新登录";
                // 跳转登录页示例
                // router.replace('/login')
                break;
            case 403:
                message = "拒绝访问";
                break;
            case 404:
                message = "请求资源不存在";
                break;
            case 500:
                message = "服务器错误";
                break;
            default:
                message = "网络连接异常";
        }
        message.error(message);
        return Promise.reject(error);
    }
);

export default service;
