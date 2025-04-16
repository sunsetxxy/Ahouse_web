# 房源聚类分析接口文档

## 接口概述

该接口使用K-means算法对房屋数据进行聚类分析，根据指定的特征将房源分组，并返回每个聚类的中心点和代表性样本。适用于房源价格区间分析、区域房源特征分析等场景。

- **接口URL**: `/api/house/cluster-analysis/`
- **请求方式**: GET
- **认证要求**: JWT认证或会话认证
- **算法版本**: v1.2.0
- **数据来源**: 房源数据库

## 请求参数

| 参数名 | 类型 | 必填 | 描述 | 默认值 | 取值范围 |
| ------ | ---- | ---- | ---- | ------ | -------- |
| city_id | Integer | 否 | 城市ID，用于筛选特定城市的房源数据 | 无 | 正整数 |
| area_id | Integer | 否 | 区域ID，用于筛选特定区域的房源数据 | 无 | 正整数 |
| n_clusters | Integer | 否 | 聚类数量 | 3 | 2-10 |
| features | String | 否 | 用于聚类的特征，多个特征用逗号分隔 | "price,single_price,use_area" | price(价格),single_price(单价),use_area(使用面积),total_area(建筑面积),room_count(房间数),floor(楼层) |
| limit | Integer | 否 | 返回每个聚类的样本数量限制 | 10 | 1-100 |
| random_state | Integer | 否 | 随机种子，用于结果复现 | 无 | 任意整数 |

## 响应格式

### 成功响应

```json
{
  "code": "200",
  "info": "聚类分析成功",
  "data": {
    "clusters": [
      {
        "price": 450.0,
        "single_price": 4.5,
        "use_area": 100.0,
        "count": 120,
        "cluster_id": 0
      },
      {
        "price": 850.0,
        "single_price": 8.5,
        "use_area": 100.0,
        "count": 80,
        "cluster_id": 1
      },
      {
        "price": 1200.0,
        "single_price": 12.0,
        "use_area": 100.0,
        "count": 50,
        "cluster_id": 2
      }
    ],
    "samples": [
      {
        "id": 1001,
        "house_name": "示例房源1",
        "city_name": "北京",
        "area_name": "朝阳区",
        "cluster_id": 0,
        "price": 460.0,
        "single_price": 4.6,
        "use_area": 100.0
      }
    ],
    "visualization": [
      {
        "id": 1001,
        "x": 1.2,
        "y": -0.5,
        "cluster_id": 0
      }
    ]
  },
  "features": ["price", "single_price", "use_area"],
  "n_clusters": 3,
  "algorithm": "K-means",
  "elapsed_time": 0.45
}
```

### 错误响应

```json
{
  "code": "400",
  "info": "数据量不足，无法进行聚类分析",
  "data": [],
  "required_minimum": 6
}
```

```json
{
  "code": "500",
  "info": "服务器内部错误: 特征值包含非数值数据",
  "data": []
}
```

## 前端调用示例

### Vue 3 Composition API 示例

```javascript
import { ref } from 'vue';
import axios from 'axios';

const useClusterAnalysis = () => {
  const result = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const fetchAnalysis = async (params = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/api/house/cluster-analysis/', {
        params: {
          n_clusters: 3,
          features: 'price,single_price,use_area',
          limit: 10,
          ...params
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.data.code === '200') {
        result.value = response.data.data;
      } else {
        throw new Error(response.data.info);
      }
    } catch (err) {
      error.value = err.message;
      console.error('聚类分析错误:', err);
    } finally {
      loading.value = false;
    }
  };

  return { result, error, loading, fetchAnalysis };
};

export default useClusterAnalysis;
```

## 可视化建议

1. **散点图矩阵**: 展示特征间关系
2. **平行坐标图**: 比较不同聚类特征分布
3. **热力图**: 展示聚类中心特征值

## 性能指标

| 数据量 | 平均响应时间 |
| ------ | ----------- |
| 1000条 | 0.3s |
| 5000条 | 1.2s |
| 10000条 | 2.5s |

## 注意事项

1. 最小数据量要求: n_clusters * 2
2. 特征值必须为数值类型
3. 大数据量建议使用异步接口
4. 结果可能因随机种子不同而略有差异