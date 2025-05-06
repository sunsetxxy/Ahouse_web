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
    timeout: 30000,
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
        
        console.log('API响应状态:', status);
        console.log('API响应数据:', res);

        // 处理HTTP状态码
        switch (status) {
            case 401:
                message.error("登录已过期，请重新登录");
                router.replace("/login");
                return Promise.reject(new Error("未授权"));
            case 403:
                message.error("没有操作权限");
                router.replace("/login");
                return Promise.reject(new Error("禁止访问"));
            case 404:
                message.error("请求资源不存在");
                return Promise.reject(new Error("资源未找到"));
            case 500:
                message.error("服务器错误");
                return Promise.reject(new Error("服务器内部错误"));
        }

        // 处理业务状态码
        // 转换响应码为字符串进行比较，确保兼容性
        const codeStr = String(res.code);
        if (codeStr !== "200" && codeStr !== "201") {
            const errorMsg = res.message || res.info || "请求失败，请稍后重试";
            message.error(errorMsg);
            return Promise.reject(new Error(errorMsg));
        }

        return res;
    },
    (error) => {
        // 关闭loading
        if (error.config?.loading) {
            error.config.loading.close();
        }
        console.log('请求错误:', error);

        // 处理HTTP错误状态码
        let errorMsg = ""; // 将变量名从 message 改为 errorMsg，避免与导入的 message 组件冲突
        
        if (!error.response) {
            // 网络连接异常或请求被取消
            if (error.code === 'ECONNABORTED') {
                errorMsg = "请求超时，请检查网络连接";
            } else if (axios.isCancel(error)) {
                errorMsg = "请求已取消";
                // 取消的请求不显示错误信息
                return Promise.reject(error);
            } else {
                errorMsg = "网络连接异常，请检查网络设置";
            }
        } else {
            // 有响应但状态码异常
            switch (error.response.status) {
                case 400:
                    errorMsg = error.response.data?.message || error.response.data?.info || "参数错误，请检查输入";
                    break;
                case 401:
                    errorMsg = "身份验证失败，请重新登录";
                    // 跳转登录页示例
                    router.replace('/login')
                    break;
                case 403:
                    errorMsg = "拒绝访问";
                    router.replace('/login')
                    break;
                case 404:
                    errorMsg = "请求资源不存在";
                    break;
                case 500:
                    errorMsg = "服务器错误";
                    break;
                default:
                    errorMsg = `请求失败(${error.response.status})：${error.response.data?.message || error.response.data?.info || '未知错误'}`;
            }
        }
        
        // 显示错误信息
        if (errorMsg) {
            message.error(errorMsg);
        }
        
        return Promise.reject(error);
    }
);

export default service;
