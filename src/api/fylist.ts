import request from "@/utils/request";

// 获取房源列表
export const getFylist = (params: any) => {
    return request({
        url: "/house/citylist",
        method: "get",
        params,
    });
};
