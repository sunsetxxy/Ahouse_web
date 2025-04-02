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

// 获取地区房源单价统计
export const singlePriceStatistics = (params: any) => {
    return request({
        url: "/house/single-price-statistics/",
        method: "get",
        params,
    });
};

// 获取地区房源金额统计
export const priceStatistics = (params: any) => {
    return request({
        url: "/house/price-statistics/",
        method: "get",
        params,
    });
};

// 获取房源属性统计
export const attributeStatistics = (params: any) => {
    return request({
        url: "/house/attribute-statistics/",
        method: "get",
        params,
    });
};