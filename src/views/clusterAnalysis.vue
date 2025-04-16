<template>
  <div class="cluster-analysis-container">
    <p class="title">房源聚类分析</p>
    <a-card class="filter-card" :bordered="false">
      <div class="card-title">
        <cluster-outlined />
        <span>聚类参数设置</span>
      </div>
      <a-form layout="inline">
        <a-form-item label="城市">
          <a-select v-model:value="queryParams.city_id" placeholder="选择城市" style="width: 120px">
            <a-select-option :value="1">北京</a-select-option>
            <a-select-option :value="2">上海</a-select-option>
            <a-select-option :value="3">重庆</a-select-option>
            <a-select-option :value="4">杭州</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="区域">
          <a-select v-model:value="queryParams.area_id" placeholder="选择区域" style="width: 120px">
            <a-select-option :value="null">全部</a-select-option>
            <!-- 区域选项将根据选择的城市动态加载 -->
          </a-select>
        </a-form-item>
        <a-form-item label="聚类数量">
          <a-slider
            v-model:value="queryParams.n_clusters"
            :min="2"
            :max="10"
            :step="1"
            style="width: 120px"
          />
        </a-form-item>
        <a-form-item label="特征选择">
          <a-checkbox-group v-model:value="selectedFeatures">
            <a-checkbox value="price">价格</a-checkbox>
            <a-checkbox value="single_price">单价</a-checkbox>
            <a-checkbox value="use_area">使用面积</a-checkbox>
            <a-checkbox value="room_count">房间数</a-checkbox>
            <a-checkbox value="floor">楼层</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="样本数量">
          <a-input-number
            v-model:value="queryParams.limit"
            :min="1"
            :max="100"
            style="width: 100px"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="fetchClusterData">分析</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-spin :spinning="loading">
      <!-- 聚类结果展示 -->
      <div v-if="clusterData" class="result-container">
        <p class="title">聚类分析结果</p>
        <a-tabs v-model:activeKey="activeTabKey">
          <a-tab-pane key="scatter" tab="散点图">
            <a-row :gutter="16" class="chart-row">
              <a-col :span="24">
                <div class="chart-container">
                  <p class="chart-title">房源聚类散点图</p>
                  <div ref="scatterChart" class="chart"></div>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="radar" tab="雷达图">
            <a-row :gutter="16" class="chart-row">
              <a-col :span="24">
                <div class="chart-container">
                  <p class="chart-title">聚类中心特征雷达图</p>
                  <div ref="radarChart" class="chart"></div>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="bar" tab="柱状图">
            <a-row :gutter="16" class="chart-row">
              <a-col :span="24">
                <div class="chart-container">
                  <p class="chart-title">聚类样本数量分布</p>
                  <div ref="barChart" class="chart"></div>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="table" tab="数据表格">
            <a-row :gutter="16" class="chart-row">
              <a-col :span="24">
                <div class="chart-container">
                  <p class="chart-title">聚类数据</p>
                  <a-table
                    :columns="clusterColumns"
                    :data-source="clusterTableData"
                    :pagination="false"
                    class="cluster-table"
                  />
                </div>
              </a-col>
            </a-row>
            <a-row :gutter="16" class="chart-row">
              <a-col :span="24">
                <div class="chart-container">
                  <p class="chart-title">代表性样本</p>
                  <a-table
                    :columns="sampleColumns"
                    :data-source="sampleTableData"
                    :pagination="{ pageSize: 10 }"
                    class="sample-table"
                  />
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- 无数据提示 -->
      <a-empty v-else description="暂无聚类数据，请选择参数进行分析或调整参数后重试" />
      <template v-if="error">
        <div style="color: red; text-align: center; margin-top: 16px;">{{ error }}</div>
      </template>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import * as echarts from 'echarts'
import { ClusterOutlined } from '@ant-design/icons-vue'
import axios from 'axios'

// 查询参数
const queryParams = ref({
  city_id: 1,
  area_id: null,
  n_clusters: 3,
  features: 'price,single_price,use_area',
  limit: 10,
  random_state: undefined
})

// 特征选择
const selectedFeatures = ref(['price', 'single_price', 'use_area'])

// 监听特征选择变化，更新查询参数
watch(selectedFeatures, (newVal) => {
  if (newVal.length > 0) {
    queryParams.value.features = newVal.join(',')
  } else {
    // 至少选择一个特征
    selectedFeatures.value = ['price']
    queryParams.value.features = 'price'
  }
})

// 数据和加载状态
const clusterData = ref(null)
const loading = ref(false)
const error = ref(null)
const activeTabKey = ref('scatter')

// 图表引用
const scatterChart = ref(null)
const radarChart = ref(null)
const barChart = ref(null)

// 表格列定义
const clusterColumns = computed(() => {
  const baseColumns = [
    {
      title: '聚类ID',
      dataIndex: 'cluster_id',
      key: 'cluster_id',
    },
    {
      title: '样本数量',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count,
    }
  ]
  // 根据选择的特征动态添加列
  const titleMap = {
    price: '价格(万元)',
    single_price: '单价(万元/平方米)',
    use_area: '使用面积(平方米)',
    total_area: '建筑面积(平方米)',
    room_count: '房间数',
    floor: '楼层'
  }
  const featureColumns = selectedFeatures.value.map(feature => ({
    title: titleMap[feature] || feature,
    dataIndex: feature,
    key: feature,
    sorter: (a, b) => a[feature] - b[feature],
  }))
  return [...baseColumns, ...featureColumns]
})

const sampleColumns = computed(() => {
  const baseColumns = [
    {
      title: '房源ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '房源名称',
      dataIndex: 'house_name',
      key: 'house_name',
    },
    {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
    },
    {
      title: '区域',
      dataIndex: 'area_name',
      key: 'area_name',
    },
    {
      title: '聚类ID',
      dataIndex: 'cluster_id',
      key: 'cluster_id',
    }
  ]
  const titleMap = {
    price: '价格(万元)',
    single_price: '单价(万元/平方米)',
    use_area: '使用面积(平方米)',
    total_area: '建筑面积(平方米)',
    room_count: '房间数',
    floor: '楼层'
  }
  const featureColumns = selectedFeatures.value.map(feature => ({
    title: titleMap[feature] || feature,
    dataIndex: feature,
    key: feature,
  }))
  return [...baseColumns, ...featureColumns]
})

// 表格数据
const clusterTableData = computed(() => {
  if (!clusterData.value) return []
  return clusterData.value.clusters.map((cluster, index) => ({
    ...cluster,
    key: index
  }))
})

const sampleTableData = computed(() => {
  if (!clusterData.value) return []
  return clusterData.value.samples.map((sample, index) => ({
    ...sample,
    key: index
  }))
})

// 获取聚类分析数据
const fetchClusterData = async () => {
  loading.value = true
  error.value = null
  try {
    // 构建请求参数，去除空字符串和null
    const params = {}
    // 必须参数
    params.features = queryParams.value.features || 'price,single_price,use_area'
    params.city_id = queryParams.value.city_id
    params.n_clusters = queryParams.value.n_clusters
    params.limit = queryParams.value.limit
    // 可选参数 area_id
    if (queryParams.value.area_id !== null && queryParams.value.area_id !== undefined && queryParams.value.area_id !== '' && queryParams.value.area_id !== 'null') {
      params.area_id = queryParams.value.area_id
    }
    // 可选参数 random_state
    if (queryParams.value.random_state !== null && queryParams.value.random_state !== undefined && queryParams.value.random_state !== '') {
      params.random_state = queryParams.value.random_state
    }
    const token = localStorage.getItem('access_token')
    console.log('[聚类分析] 请求参数:', params)
    const response = await axios.get('/house/cluster-analysis/', {
      params,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
    console.log('[聚类分析] 接口响应:', response)
    let respData = null
    if (response && response.data) {
      if (response.data.code === 200 || response.data.code === '200') {
        respData = response.data.data
      } else if (response.data.code === 400 || response.data.code === '400') {
        throw new Error(response.data.info || '数据量不足，无法进行聚类分析')
      } else if (response.data.code === 500 || response.data.code === '500') {
        throw new Error(response.data.info || '服务器内部错误')
      } else {
        throw new Error(response.data.info || '聚类分析失败')
      }
    } else {
      throw new Error('无响应数据')
    }
    if (!respData || !respData.clusters) {
      throw new Error('暂无聚类数据，请调整参数后重试')
    }
    clusterData.value = respData
    message.success('聚类分析成功')
    setTimeout(() => {
      initCharts()
    }, 100)
  } catch (err) {
    error.value = err.message || '网络错误'
    message.error(`聚类分析请求失败: ${error.value}`)
    clusterData.value = null
  } finally {
    loading.value = false
  }
}

// 初始化所有图表
const initCharts = () => {
  if (!clusterData.value) return
  
  // 根据当前激活的标签页初始化对应图表
  if (activeTabKey.value === 'scatter') {
    initScatterChart()
  } else if (activeTabKey.value === 'radar') {
    initRadarChart()
  } else if (activeTabKey.value === 'bar') {
    initBarChart()
  }
}

// 监听标签页切换，初始化对应图表
watch(activeTabKey, (newVal) => {
  if (clusterData.value) {
    if (newVal === 'scatter') {
      initScatterChart()
    } else if (newVal === 'radar') {
      initRadarChart()
    } else if (newVal === 'bar') {
      initBarChart()
    }
  }
})

// 初始化散点图
const initScatterChart = () => {
  if (!scatterChart.value) return
  
  const chart = echarts.init(scatterChart.value)
  
  // 准备数据
  const visualizationData = clusterData.value.visualization || []
  const clusters = clusterData.value.clusters || []
  
  // 按聚类分组数据
  const seriesData = []
  const clusterMap = {}
  
  // 创建聚类映射
  clusters.forEach(cluster => {
    clusterMap[cluster.cluster_id] = cluster
  })
  
  // 为每个聚类创建一个系列
  Object.keys(clusterMap).forEach(clusterId => {
    const clusterPoints = visualizationData.filter(point => point.cluster_id.toString() === clusterId)
    
    seriesData.push({
      name: `聚类 ${clusterId}`,
      type: 'scatter',
      data: clusterPoints.map(point => [point.x, point.y]),
      symbolSize: 10,
    })
  })
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const pointIndex = params.dataIndex
        const clusterId = Object.keys(clusterMap)[params.seriesIndex]
        const clusterPoints = visualizationData.filter(point => point.cluster_id.toString() === clusterId)
        const point = clusterPoints[pointIndex]
        
        if (!point) return ''
        
        return `ID: ${point.id}<br/>聚类: ${clusterId}`
      }
    },
    legend: {
      data: Object.keys(clusterMap).map(id => `聚类 ${id}`),
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    xAxis: {},
    yAxis: {},
    series: seriesData
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化雷达图
const initRadarChart = () => {
  if (!radarChart.value) return
  
  const chart = echarts.init(radarChart.value)
  
  // 准备数据
  const clusters = clusterData.value.clusters || []
  const features = selectedFeatures.value
  
  // 计算每个特征的最大值，用于雷达图刻度
  const maxValues = {}
  features.forEach(feature => {
    maxValues[feature] = Math.max(...clusters.map(cluster => cluster[feature]))
  })
  
  // 雷达图指示器
  const indicator = features.map(feature => {
    const nameMap = {
      price: '价格',
      single_price: '单价',
      use_area: '使用面积'
    }
    
    return {
      name: nameMap[feature],
      max: maxValues[feature] * 1.2 // 最大值增加20%，使图表更美观
    }
  })
  
  // 准备系列数据
  const seriesData = clusters.map(cluster => ({
    value: features.map(feature => cluster[feature]),
    name: `聚类 ${cluster.cluster_id}`
  }))
  
  const option = {
    tooltip: {},
    legend: {
      data: clusters.map(cluster => `聚类 ${cluster.cluster_id}`),
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    radar: {
      indicator: indicator
    },
    series: [{
      type: 'radar',
      data: seriesData
    }]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化柱状图
const initBarChart = () => {
  if (!barChart.value) return
  
  const chart = echarts.init(barChart.value)
  
  // 准备数据
  const clusters = clusterData.value.clusters || []
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: clusters.map(cluster => `聚类 ${cluster.cluster_id}`)
    },
    yAxis: {
      type: 'value',
      name: '样本数量'
    },
    series: [{
      data: clusters.map(cluster => cluster.count),
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      },
      itemStyle: {
        color: function(params) {
          // 为不同聚类设置不同颜色
          const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#4e7c9a']
          return colorList[params.dataIndex % colorList.length]
        }
      },
      label: {
        show: true,
        position: 'top'
      }
    }]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 组件挂载时初始化
onMounted(() => {
  // 默认不自动加载数据，等用户点击分析按钮
})
</script>

<style scoped>
.cluster-analysis-container {
  padding: 0;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 3px solid #1890ff;
}

.filter-card {
  margin-bottom: 20px;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.12), 0 3px 6px 0 rgba(0, 0, 0, 0.08), 0 5px 12px 4px rgba(0, 0, 0, 0.05);
}

.card-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
}

.card-title span {
  margin-left: 8px;
}

.result-container {
  margin-top: 20px;
}

.chart-container {
  width: 100%;
  height: 400px;
  margin-top: 20px;
  background: #fff;
  border-radius: 2px;
  padding: 16px;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.12), 0 3px 6px 0 rgba(0, 0, 0, 0.08), 0 5px 12px 4px rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
  padding-left: 8px;
  border-left: 3px solid #1890ff;
}

.chart {
  width: 100%;
  height: 100%;
}

.cluster-table,
.sample-table {
  margin-top: 20px;
  background: #fff;
  border-radius: 2px;
  padding: 16px;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.12), 0 3px 6px 0 rgba(0, 0, 0, 0.08), 0 5px 12px 4px rgba(0, 0, 0, 0.05);
}

.chart-row {
  margin-bottom: 16px;
}
</style>