import request from "../utils/request";

// 获取房源聚类分析数据
export const getClusterAnalysis = (params: any) => {
    return request({
        url: "/house/cluster-analysis/",
        method: "get",
        params,
    });
};

// 获取区域列表
export const getAreaList = (cityId: number) => {
    return request({
        url: "/house/areas/",
        method: "get",
        params: { city_id: cityId },
    });
};