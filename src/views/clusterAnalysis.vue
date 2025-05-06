<template>
  <div class="cluster-analysis-container">
    <div class="params-panel">
      <a-row :gutter="16" align="middle">
        <a-col :span="4">
          <a-select v-model:value="params.city" placeholder="城市" style="width: 100%" @change="onCityChange">
            <a-select-option v-for="city in cityList" :key="city.value" :value="city.value">{{ city.label }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select v-model:value="params.region" placeholder="区域" style="width: 100%">
            <a-select-option v-for="region in regionList" :key="region.value" :value="region.value">{{ region.label }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select v-model:value="params.algorithm" placeholder="聚类算法" style="width: 100%">
            <a-select-option value="kmeans">K-means</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-input-number v-model:value="params.n_clusters" :min="2" :max="10" placeholder="聚类数" style="width: 100%" />
        </a-col>
        <a-col :span="4">
          <a-input-number v-model:value="params.limit" :min="1" :max="10" placeholder="样本数" style="width: 100%" />
        </a-col>
        <a-col :span="4">
          <a-button type="primary" @click="handleAnalyze">分析</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="16" style="margin-top: 16px;">
        <a-col :span="24">
          <span>特征选择：</span>
          <a-checkbox-group v-model:value="params.features">
            <a-checkbox v-for="f in featureOptions" :key="f.value" :value="f.value">{{ f.label }}</a-checkbox>
          </a-checkbox-group>
        </a-col>
      </a-row>
    </div>
    <div v-if="loading" class="loading-panel"><a-spin /></div>
    <div v-else-if="result && Array.isArray(result.clusters) && Array.isArray(result.samples)" class="result-panel">
      <a-row :gutter="16" style="margin-bottom: 24px;">
        <a-col :span="24">
          <div class="chart-container">
            <p class="chart-title">聚类分布散点图</p>
            <div ref="scatterChart" class="chart"></div>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="16" style="margin-bottom: 24px;">
        <a-col :span="24">
          <div class="chart-container">
            <p class="chart-title">聚类特征雷达图</p>
            <div ref="radarChart" class="chart"></div>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="16" style="margin-bottom: 24px;">
        <a-col :span="24">
          <div class="chart-container">
            <p class="chart-title">聚类数量饼图</p>
            <div ref="pieChart" class="chart"></div>
          </div>
        </a-col>
      </a-row>
      <a-row style="margin-top: 24px;">
        <a-col :span="24">
          <a-table :columns="tableColumns" :data-source="result.samples" row-key="id" bordered :pagination="false" />
        </a-col>
      </a-row>
    </div>
    <div v-else class="empty-panel">
      <a-empty description="暂无聚类数据，请选择参数后点击分析" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import { getClusterAnalysis, getAreaList } from '@/api/cluster';
import * as echarts from 'echarts';
import { message } from 'ant-design-vue';

const cityList = [
  { label: '全部', value: ''  },
  { label: '北京', value: 1 },
  { label: '上海', value: 2 },
  { label: '重庆', value: 3 },
  { label: '杭州', value: 4 }
];
const regionList = ref([]);
const featureOptions = [
  { label: '总价', value: 'price' },
  { label: '单价', value: 'single_price' },
  { label: '使用面积', value: 'use_area' },
  { label: '房间数', value: 'type_name' },
  { label: '楼层', value: 'floor' }
];

// 楼层分类映射函数
function mapFloorToCategory(floor) {
  if (!floor) return 0;
  switch(floor) {
    case '底层': return 1;
    case '低层': return 2;
    case '中层': return 3;
    case '高层': return 4;
    case '顶层': return 5;
    default: return 0;
  }
}

// 楼层分类名称映射
const floorCategoryMap = {
  0: '未知',
  1: '底层',
  2: '低层',
  3: '中层',
  4: '高层',
  5: '顶层'
};
const params = reactive({
  city: '',
  region: '',
  algorithm: 'kmeans',
  n_clusters: 4,
  features: ['price', 'single_price', 'use_area', 'floor', 'type_name'],
  limit: 1
});
const loading = ref(false);
const result = ref(null);
const scatterChart = ref(null);
const radarChart = ref(null);
const pieChart = ref(null);
const histChart = ref(null);

const tableColumns = ref([
  { title: '房源ID', dataIndex: 'id', key: 'id' },
  { title: '聚类', dataIndex: 'cluster', key: 'cluster' },
  { title: '总格', dataIndex: 'price', key: 'price' },
  { title: '单价', dataIndex: 'single_price', key: 'single_price' },
  { title: '使用面积', dataIndex: 'use_area', key: 'area' },
  { title: '房间数', dataIndex: 'type_name', key: 'room_count' },
  { title: '楼层(数值)', dataIndex: 'floor_category', key: 'floor_category' },
]);

const columnTitleMap = {
  id: '房源ID',
  house_name: '小区名',
  city_name: '城市',
  localhost: '地区',
  cluster_id: '聚类分类',
  cluster: '聚类',
  price: '价格',
  single_price: '单价',
  use_area: '使用面积',
  area: '使用面积',
  room_count: '房间数',
  floor: '楼层',
  type_name: '房屋格局'
};

function onCityChange(val) {
  regionList.value = [{ label: '全部', value: '' }];
  if (!val) return;
  getAreaList(val).then(res => {
    if (res && res.code === '200' && Array.isArray(res.data)) {
      regionList.value = [{ label: '全部', value: '' }, ...res.data.map(area => ({ label: area.name, value: area.id }))];
    } else {
      regionList.value = [{ label: '全部', value: '' }];
    }
  }).catch(() => {
    regionList.value = [{ label: '全部', value: '' }];
  });
}

function handleAnalyze() {
  loading.value = true;
  // 组装参数，处理 area_id
  const reqParams = {
    city_id: params.city,
    n_clusters: params.n_clusters,
    algorithm: params.algorithm,
    limit: params.limit,
    features: params.features.join(",")
  };
  // 仅当区域不是"全部
  if (params.region !== '' && params.region !== 0 && params.region !== '0') {
    reqParams.area_id = Number(params.region);
  }
  getClusterAnalysis(reqParams).then(res => {
    loading.value = false;
    if (res.code === '200') {
      // 处理楼层数据，将文本转换为数值分类
      if (res.data && Array.isArray(res.data.samples)) {
        res.data.samples.forEach(sample => {
          // 保存原始楼层文本
          sample.floor_text = sample.floor;
          // 转换为数值分类
          sample.floor_category = mapFloorToCategory(sample.floor);
        });
      }
      // 对clusters中的楼层字段也进行数值映射
      if (res.data && Array.isArray(res.data.clusters)) {
        res.data.clusters.forEach(cluster => {
          cluster.floor_text = cluster.floor;
          cluster.floor_category = mapFloorToCategory(cluster.floor);
        });
      }
      result.value = res.data;
      nextTick(() => {
        renderCharts();
      });
    } else {
      message.error(res.info || '分析失败');
    }
  }).catch(() => {
    loading.value = false;
    message.error('请求失败');
  });
}

function renderCharts() {
  if (!result.value) return;
  // 散点图
  if (scatterChart.value && Array.isArray(result.value.clusters)) {
    // 新增判断 visualization 字段
    if (Array.isArray(result.value.visualization) && result.value.visualization.length > 0) {
      const chart = echarts.init(scatterChart.value);
      // 按cluster_id分组数据
      const clusterGroups = {};
      result.value.visualization.forEach(item => {
        const clusterId = item.cluster_id !== undefined ? item.cluster_id : 0;
        if (!clusterGroups[clusterId]) {
          clusterGroups[clusterId] = [];
        }
        clusterGroups[clusterId].push([item.x, item.y]);
      });
      // 构建echarts所需的series数据
      const series = Object.keys(clusterGroups).map(clusterId => ({
        name: `Cluster ${clusterId}`,
        type: 'scatter',
        data: clusterGroups[clusterId],
        symbolSize: 10
      }));
      chart.setOption({
        tooltip: {
          formatter: function(params) {
            return `Cluster ${params.seriesName}<br/>x: ${params.value[0].toFixed(4)}<br/>y: ${params.value[1].toFixed(4)}`;
          }
        },
        legend: { data: series.map(s => s.name) },
        xAxis: { name: '经度标准化值', type: 'value' },
        yAxis: { name: '纬度标准化值', type: 'value' },
        series
      });
    } else {
      // visualization 为空，清空图表并提示
      const chart = echarts.init(scatterChart.value);
      chart.clear();
      chart.setOption({
        title: { text: '暂无可视化数据', left: 'center', top: 'center', textStyle: { color: '#aaa', fontSize: 18 } }
      });
    }
  }
  // 雷达图
  if (radarChart.value && Array.isArray(result.value.clusters)) {
    const chart = echarts.init(radarChart.value);
    // 动态根据 params.features 生成特征列表，确保包含楼层特征
    const features = featureOptions.filter(f => params.features.includes(f.value));
    // 检查clusters数据是否包含特征值
    if (result.value.clusters.length > 0) {
      // 创建雷达图指标
      const indicators = features.map(f => ({
        name: f.label,
        max: Math.max(...result.value.clusters.map(c => {
          // 楼层特殊处理
          if (f.value === 'floor') {
            return parseFloat(c['floor_category'] || c['floor'] || 0) || 0;
          }
          return parseFloat(c[f.value] || 0) || 0;
        })) * 1.2 || 1
      }));
      // 为每个聚类创建数据
      const data = result.value.clusters.map(cluster => ({
        value: features.map(f => {
          // 楼层特殊处理
          if (f.value === 'floor') {
            return parseFloat(cluster['floor_category'] || cluster['floor'] || 0) || 0;
          }
          return parseFloat(cluster[f.value]) || 0;
        }),
        name: `Cluster ${cluster.cluster_id !== undefined ? cluster.cluster_id : (cluster.cluster !== undefined ? cluster.cluster : 0)}`
      }));
      chart.setOption({
        tooltip: {},
        legend: { data: data.map(d => d.name) },
        radar: { indicator: indicators },
        series: [{ type: 'radar', data }]
      });
    } else {
      // 无数据时显示提示
      chart.clear();
      chart.setOption({
        title: { text: '暂无聚类特征数据', left: 'center', top: 'center', textStyle: { color: '#aaa', fontSize: 18 } }
      });
    }
  }
  // 饼图
  if (pieChart.value && Array.isArray(result.value.clusters)) {
    const chart = echarts.init(pieChart.value);
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { top: '5%', left: 'center' },
      series: [{
        name: '聚类数量',
        type: 'pie',
        radius: '50%',
        data: result.value.clusters.map(c => ({ value: c.count, name: `Cluster ${c.cluster_id ?? c.cluster}` }))
      }]
    });
  }
  // 直方图
  if (histChart.value) {
    const chart = echarts.init(histChart.value);
    
    // 检查是否有直方图数据，如果没有则基于samples动态生成
    if (result.value && result.value.histogram) {
      // 使用API返回的直方图数据
      const features = featureOptions;
      const bins = result.value.histogram.bins || [];
      const series = [];
      
      features.forEach(feature => {
        if (result.value.histogram[feature.value]) {
          series.push({
            name: feature.label,
            type: 'bar',
            data: result.value.histogram[feature.value]
          });
        }
      });
      
      if (series.length > 0) {
        chart.setOption({
          tooltip: {},
          legend: { data: series.map(s => s.name) },
          xAxis: { type: 'category', data: bins },
          yAxis: {},
          series
        });
      } else {
        // 无数据时显示提示
        chart.clear();
        chart.setOption({
          title: { text: '暂无特征分布数据', left: 'center', top: 'center', textStyle: { color: '#aaa', fontSize: 18 } }
        });
      }
    } else if (result.value && Array.isArray(result.value.samples) && result.value.samples.length > 0) {
      // 动态生成直方图数据
      const features = featureOptions;
      const samples = result.value.samples;
      const series = [];
      
      // 按聚类ID对样本进行分组
      const clusterGroups = {};
      samples.forEach(sample => {
        const clusterId = sample.cluster !== undefined ? sample.cluster : (sample.cluster_id !== undefined ? sample.cluster_id : 0);
        if (!clusterGroups[clusterId]) {
          clusterGroups[clusterId] = [];
        }
        
        // 确保楼层有分类值
        if (sample.floor && !sample.floor_category) {
          sample.floor_category = mapFloorToCategory(sample.floor);
          sample.floor_text = sample.floor;
        }
        
        clusterGroups[clusterId].push(sample);
      });
      
      // 为每个特征创建系列数据
      features.forEach(feature => {
        if (samples[0][feature.value] !== undefined) {
          // 为每个聚类创建一个系列
          Object.keys(clusterGroups).forEach(clusterId => {
            const clusterSamples = clusterGroups[clusterId];
            series.push({
              name: `Cluster ${clusterId} - ${feature.label}`,
              type: 'bar',
              stack: feature.label,
              data: [clusterSamples.reduce((sum, sample) => {
                // 特殊处理楼层数据
                if (feature.value === 'floor') {
                  return sum + (parseFloat(sample.floor_category) || 0);
                }
                return sum + (parseFloat(sample[feature.value]) || 0);
              }, 0) / clusterSamples.length]
            });
          });
        }
      });
      
      if (series.length > 0) {
        chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
          },
          legend: {},
          grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          xAxis: [{ type: 'category', data: ['平均值'] }],
          yAxis: [{ type: 'value' }],
          series
        });
      } else {
        chart.clear();
        chart.setOption({
          title: { text: '暂无特征分布数据', left: 'center', top: 'center', textStyle: { color: '#aaa', fontSize: 18 } }
        });
      }
    } else {
      // 无数据时显示提示
      chart.clear();
      chart.setOption({
        title: { text: '暂无特征分布数据', left: 'center', top: 'center', textStyle: { color: '#aaa', fontSize: 18 } }
      });
    }
  }
}

onMounted(() => {
  onCityChange(params.city);
});

function genTableColumns(samples) {
  if (!samples || !Array.isArray(samples) || samples.length === 0) return [];
  return Object.keys(samples[0])
    .filter(key => key !== 'floor_category' && key !== 'floor_text') // 过滤掉内部使用的字段
    .map(key => {
      const column = {
        title: columnTitleMap[key] || key,
        dataIndex: key,
        key: key
      };
      
      // 为楼层添加自定义渲染函数
      if (key === 'floor') {
        column.customRender = ({ text }) => floorCategoryMap[mapFloorToCategory(text)] || text;
      }
      
      return column;
    });
}

watch(
  () => result.value && result.value.samples,
  (samples) => {
    if (samples && Array.isArray(samples) && samples.length > 0) {
      tableColumns.value = genTableColumns(samples);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.cluster-analysis-container {
  padding: 24px;
}
.params-panel {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}
.result-panel {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}
.chart-container {
  margin-bottom: 24px;
}
.chart-title {
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  font-size: 22px;
}
.chart {
  width: 100%;
  height: 400px;
}
.loading-panel {
  text-align: center;
  padding: 48px 0;
}
.empty-panel {
  text-align: center;
  padding: 48px 0;
}
</style>