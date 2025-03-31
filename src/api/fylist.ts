import request from "@/utils/request";

// 获取房源列表
export const getFylist = (params: any) => {
    return request({
        url: "/house/citylist",
        method: "get",
        params,
    });
};


export const communityStatistics = (params: any) => {
    return request({
        url: "/house/community-statistics/",
        method: "get",
        params,
    });
};


export const statistics = (params: any) => {
    return request({
        url: "/house/statistics/",
        method: "get",
        params,
    });
};