<template>
  <div class="fyzhanbi-container">
    <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
      <a-tab-pane key="1" tab="北京">
        <a-table :columns="columns" :data-source="tableData" :pagination="false" />
        <a-row :gutter="16" class="chart-row">
          <a-col :span="24">
            <div class="chart-container">
              <p class="chart-title">区域房源分布</p>
              <div ref="pieChart" class="chart"></div>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="16" class="chart-row">
          <a-col :span="12">
            <div class="chart-container">
              <p class="chart-title">区域房源单价对比</p>
              <div ref="singlePriceChart" class="chart"></div>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="chart-container">
              <p class="chart-title">区域房源总价对比</p>
              <div ref="totalPriceChart" class="chart"></div>
            </div>
          </a-col>
        </a-row>

        <a-row :gutter="16" class="chart-row">
          <a-col :span="8">
            <div class="chart-container">
              <p class="chart-title">楼层分布</p>
              <div ref="floorChart" class="chart"></div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="chart-container">
              <p class="chart-title">装修情况</p>
              <div ref="fitmentChart" class="chart"></div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="chart-container">
              <p class="chart-title">户型分布</p>
              <div ref="typeNameChart" class="chart"></div>
            </div>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="2" tab="上海">
        <a-table :columns="columns" :data-source="tableData" :pagination="false" />
        <a-row :gutter="16" class="chart-row">
          <a-col :span="24">
            <div class="chart-container">
              <p class="chart-title">区域房源分布</p>
              <div ref="pieChart" class="chart"></div>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="16" class="chart-row">
          <a-col :span="12">
            <div class="chart-container">
              <p class="chart-title">区域房源单价对比</p>
              <div ref="singlePriceChart" class="chart"></div>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="chart-container">
              <p class="chart-title">区域房源总价对比</p>
              <div ref="totalPriceChart" class="chart"></div>
            </div>
          </a-col>
        </a-row>

        <a-row :gutter="16" class="chart-row">
          <a-col :span="8">
            <div class="chart-container">
              <p class="chart-title">楼层分布</p>
              <div ref="floorChart" class="chart"></div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="chart-container">
              <p class="chart-title">装修情况</p>
              <div ref="fitmentChart" class="chart"></div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="chart-container">
              <p class="chart-title">户型分布</p>
              <div ref="typeNameChart" class="chart"></div>
            </div>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="3" tab="重庆">
        <a-table :columns="columns" :data-source="tableData" :pagination="false" />
        <a-row :gutter="16" class="chart-row">
          <a-col :span="24">
            <div class="chart-container">
              <p class="chart-title">区域房源分布</p>
              <div ref="pieChart" class="chart"></div>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="16" class="chart-row">
          <a-col :span="12">
            <div class="chart-container">
              <p class="chart-title">区域房源单价对比</p>
              <div ref="singlePriceChart" class="chart"></div>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="chart-container">
              <p class="chart-title">区域房源总价对比</p>
              <div ref="totalPriceChart" class="chart"></div>
            </div>
          </a-col>
        </a-row>

        <a-row :gutter="16" class="chart-row">
          <a-col :span="8">
            <div class="chart-container">
              <p class="chart-title">楼层分布</p>
              <div ref="floorChart" class="chart"></div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="chart-container">
              <p class="chart-title">装修情况</p>
              <div ref="fitmentChart" class="chart"></div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="chart-container">
              <p class="chart-title">户型分布</p>
              <div ref="typeNameChart" class="chart"></div>
            </div>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="4" tab="杭州">
        <a-table :columns="columns" :data-source="tableData" :pagination="false" />
        <a-row :gutter="16" class="chart-row">
          <a-col :span="24">
            <div class="chart-container">
              <p class="chart-title">区域房源分布</p>
              <div ref="pieChart" class="chart"></div>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="16" class="chart-row">
          <a-col :span="12">
            <div class="chart-container">
              <p class="chart-title">区域房源单价对比</p>
              <div ref="singlePriceChart" class="chart"></div>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="chart-container">
              <p class="chart-title">区域房源总价对比</p>
              <div ref="totalPriceChart" class="chart"></div>
            </div>
          </a-col>
        </a-row>

        <a-row :gutter="16" class="chart-row">
          <a-col :span="8">
            <div class="chart-container">
              <p class="chart-title">楼层分布</p>
              <div ref="floorChart" class="chart"></div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="chart-container">
              <p class="chart-title">装修情况</p>
              <div ref="fitmentChart" class="chart"></div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="chart-container">
              <p class="chart-title">户型分布</p>
              <div ref="typeNameChart" class="chart"></div>
            </div>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { Progress } from 'ant-design-vue'
import { statistics, singlePriceStatistics, priceStatistics, attributeStatistics } from '@/api/fylist'
import * as echarts from 'echarts'

const activeKey = ref('1')
const tableData = ref([])
const pieChart = ref(null)
const singlePriceChart = ref(null)
const totalPriceChart = ref(null)
const floorChart = ref(null)
const fitmentChart = ref(null)
const typeNameChart = ref(null)
const columns = [
  {
    title: '区域',
    dataIndex: 'area',
    key: 'area',
    width: '20%'
  },
  {
    title: '房源数量',
    dataIndex: 'count',
    key: 'count',
    sorter: (a, b) => a.count - b.count,
    width: '20%'
  },
  {
    title: '占比',
    dataIndex: 'percentage',
    key: 'percentage',
    width: '20%',
    customRender: ({ text }) => {
      const percent = parseInt(text.replace('%', ''))
      return h(Progress, {
        percent: percent,
        status: 'active'
      })
    }
  }
]

const handleTabChange = (key) => {
  fetchData(key)
  fetchPriceData(key)
  fetchAttributeData(key)
}

const fetchData = (cityId) => {
  // 获取区域房源数据
  statistics({city_id: cityId, group_by: 'area', limit: 1000 }).then((res) => {
    let count = 0
    res.data.forEach(item => {
      count += item.value
    })
    
    const areaData = res.data.map(item => {
      return {
        area: item.name,
        count: item.value,
        percentage: (item.value / count * 100) + '%'
      }
    })
    
    tableData.value = areaData
    
    // 初始化饼图
    if (pieChart.value) {
      const pieData = res.data.map(item => ({
        name: item.name,
        value: item.value
      }))
      initPieChart(pieChart.value, '区域房源分布', pieData)
    }
  })
}

// 获取价格数据
const fetchPriceData = (cityId) => {
  // 获取单价数据
  singlePriceStatistics({city_id: cityId, group_by: 'area', limit: 10}).then(res => {
    if (res.code == 200 && singlePriceChart.value) {
      const xData = res.data.map(item => item.name)
      const yData = res.data.map(item => item.value)
      
      initBarChart(singlePriceChart.value, '区域房源单价对比', xData, yData, '单价(元/平方米)')
    }
  })
  
  // 获取总价数据
  priceStatistics({city_id: cityId, group_by: 'area', limit: 10}).then(res => {
    if (res.code == 200 && totalPriceChart.value) {
      const xData = res.data.map(item => item.name)
      const yData = res.data.map(item => item.value)
      
      initBarChart(totalPriceChart.value, '区域房源总价对比', xData, yData, '总价(万元)')
    }
  })
}

// 初始化饼图
const initPieChart = (dom, title, data) => {
  const myChart = echarts.init(dom)
  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: '房源分布',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          formatter: '{b}: {c} ({d}%)'
        }
      }
    ]
  }
  
  myChart.setOption(option)
  
  // 响应式处理
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}



// 初始化柱状图
const initBarChart = (dom, title, xData, yData, yAxisName) => {
  const myChart = echarts.init(dom)
  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: yAxisName
    },
    series: [{
      name: title,
      type: 'bar',
      data: yData,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#91cc75' },
          { offset: 1, color: '#5470c6' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#5470c6' },
            { offset: 1, color: '#91cc75' }
          ])
        }
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}'
      }
    }],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    }
  }
  
  myChart.setOption(option)
  
  // 响应式处理
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}



// 获取房源属性统计数据
const fetchAttributeData = (cityId) => {
  // 获取楼层分布数据
  attributeStatistics({city_id: cityId, attribute: 'floor', limit: 10}).then(res => {
    if (res.code == 200 && floorChart.value) {
      const chartData = res.data.map(item => ({
        name: item.name,
        value: item.value
      }))
      
      initPieChart(floorChart.value, '楼层分布', chartData)
    }
  })
  
  // 获取装修情况数据
  attributeStatistics({city_id: cityId, attribute: 'fitment', limit: 10}).then(res => {
    if (res.code == 200 && fitmentChart.value) {
      const chartData = res.data.map(item => ({
        name: item.name,
        value: item.value
      }))
      
      initPieChart(fitmentChart.value, '装修情况', chartData)
    }
  })
  
  // 获取户型分布数据
  attributeStatistics({city_id: cityId, attribute: 'type_name', limit: 10}).then(res => {
    if (res.code == 200 && typeNameChart.value) {
      const xData = res.data.map(item => item.name)
      const yData = res.data.map(item => item.value)
      
      initBarChart(typeNameChart.value, '户型分布', xData, yData, '数量')
    }
  })
}

onMounted(() => {
  fetchData('1') // 默认显示北京的数据
  fetchPriceData('1')
  fetchAttributeData('1')
})
</script>

<style scoped>
.fyzhanbi-container {
  padding: 20px;
}

:deep(.ant-progress-bg) {
  background: linear-gradient(90deg, #108ee9 0%, #87d068 100%);
}

.chart-row {
  margin-top: 20px;
}

.chart-container {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
}

.chart {
  height: 350px;
  width: 100%;
}
</style>