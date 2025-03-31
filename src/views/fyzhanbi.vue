<template>
  <div class="fyzhanbi-container">
    <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
      <a-tab-pane key="1" tab="北京">
        <a-table :columns="columns" :data-source="tableData" :pagination="false" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="上海">
        <a-table :columns="columns" :data-source="tableData" :pagination="false" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="重庆">
        <a-table :columns="columns" :data-source="tableData" :pagination="false" />
      </a-tab-pane>
      <a-tab-pane key="4" tab="杭州">
        <a-table :columns="columns" :data-source="tableData" :pagination="false" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { Progress } from 'ant-design-vue'
import { statistics } from '@/api/fylist'

const activeKey = ref('1')
const tableData = ref([])
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
}

const fetchData = (cityId) => {
  // 模拟不同城市的数据
  statistics({city_id: cityId, group_by: 'area', limit: 1000 }).then((res) => {
    let count = 0
    res.data.forEach(item => {
      count += item.value
    })
    tableData.value = res.data.map(item => {
      return {
        area: item.name,
        count: item.value,
        percentage: (item.value / count * 100) + '%'
      }
    })
  })
  
}

onMounted(() => {
  fetchData('1') // 默认显示北京的数据
})
</script>

<style scoped>
.fyzhanbi-container {
  padding: 20px;
}

:deep(.ant-progress-bg) {
  background: linear-gradient(90deg, #108ee9 0%, #87d068 100%);
}
</style>