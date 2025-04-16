import request from "../utils/request";

export function login(data: any) {
    return request({
        url: "/user/login",
        method: "post",
        data,
    });
}


export function register(data: any) {
    return request({
        url: "/user/register",
        method: "post",
        data,
    });
}


export function userList(data: any) {
    return request({
        url: "/user/userlist",
        method: "get",
        params:data,
    });
}

// 获取当前用户信息
export function getUserInfo() {
    return request({
        url: "/user/userinfo",
        method: "get",
    });
}

// 修改用户信息
export function updateUserInfo(data: any) {
    return request({
        url: "/user/userinfo",
        method: "patch",
        data,
    });
}

// 修改密码
export function updatePassword(data: any) {
    return request({
        url: "/user/userinfo",
        method: "put",
        data,
    });
}

// 管理员更新用户信息
export function adminUpdateUserInfo(userId: number, data: any) {
    return request({
        url: `/user/admininfo/${userId}`,
        method: "put",
        data,
    });
}