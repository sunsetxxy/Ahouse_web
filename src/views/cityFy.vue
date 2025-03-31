<template>
    <div>
        <p class="title">在售房源数量</p>
        <a-row class="city-stats">
            <a-col :span="6" v-for="item in cityFy" :key="item.id" class="city-item">
                <div class="city-card">
                    <div class="city-name">{{ item.name }}</div>
                    <div class="city-value">{{ item.value }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="12">
                <div ref="beijing" class="chart">
                </div>
            </a-col>
            <a-col :span="12">
                <div ref="shanghai" class="chart">
                </div>
            </a-col>
            <a-col :span="12">
                <div ref="chongqing" class="chart">
                </div>
            </a-col>
            <a-col :span="12">
                <div ref="hangzhou" class="chart">
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
    import { reactive, onMounted, ref } from "vue";
    import { getFylist, communityStatistics }  from "@/api/fylist";
    import * as echarts from 'echarts'
    const cityFy = reactive([
        {
            name: "北京",
            value: "",
            id: 1
        },
        {
            name: "上海",
            value: "",
            id: 2
        },
        {
            name: "重庆",
            value: "",
            id: 3
        },
        {
            name: "杭州",
            value: "",
            id: 4
        },
    ])
    const beijing = ref(null);
    const shanghai = ref(null);
    const chongqing = ref(null);
    const hangzhou = ref(null);
    
    onMounted(() => {
        cityFy.forEach(async (item) => {
            const res = await getFylist({city_id: item.id})
            console.log(res);
            
            item.value = res.count;
        })
        communityStatistics({city_id: 1, limit: 10}).then(res => {
            console.log(res);
            const xData = [];
            const yData = [];
            if (res.code == 200) {
                res.data.forEach(item => {
                        xData.push(item.name);
                        yData.push(item.value);
                    })
                    initChart(beijing.value, '北京在售房源排行', xData, yData);
            }
        })
        communityStatistics({city_id: 2, limit: 10}).then(res => {
            console.log(res);
            const xData = [];
            const yData = [];
            if (res.code == 200) {
                res.data.forEach(item => {
                        xData.push(item.name);
                        yData.push(item.value);
                    })
                    initChart(shanghai.value, '上海在售房源排行', xData, yData);
            }
        })
        communityStatistics({city_id: 3, limit: 10}).then(res => {
            const xData = [];
            const yData = [];
            if (res.code == 200) {
                res.data.forEach(item => {
                        xData.push(item.name);
                        yData.push(item.value);
                    })
                    initChart(chongqing.value, '重庆在售房源排行', xData, yData);
            }
        })
        communityStatistics({city_id: 4, limit: 10}).then(res => {
            const xData = [];
            const yData = [];
            if (res.code == 200) {
                res.data.forEach(item => {
                        xData.push(item.name);
                        yData.push(item.value);
                    })
                    initChart(hangzhou.value, '杭州在售房源排行', xData, yData);
            }
        })
    })
    const initChart = (dom, title, xData, yData) => {
        const myChart = echarts.init(dom);
        const option = {
            title: {
                text: title,
                left: 'center'
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
                name: '房源数量'
            },
            series: [{
                name: '在售房源数量',
                type: 'bar',
                data: yData,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#83bff6' },
                        { offset: 0.5, color: '#188df0' },
                        { offset: 1, color: '#188df0' }
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#2378f7' },
                            { offset: 0.7, color: '#2378f7' },
                            { offset: 1, color: '#83bff6' }
                        ])
                    }
                }
            }],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            }
        }
        myChart.setOption(option);
        
        // 响应式处理
        window.addEventListener('resize', () => {
            myChart.resize();
        });
    }
    const option = {
        title: {
            text: '北京房价分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['低区', '中区', '高区']
        }
    }
    
</script>

<style scoped>
.title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #000;
}

.city-stats {
    padding: 20px;
}

.city-item {
    padding: 10px;
}

.city-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
}

.city-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.city-name {
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
}

.city-value {
    font-size: 24px;
    font-weight: bold;
    color: #1890ff;
}
.chart {
    height: 400px;
    margin: 20px;
}
</style>