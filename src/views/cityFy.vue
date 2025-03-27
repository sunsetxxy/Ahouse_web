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
    </div>
</template>

<script setup>
    import { reactive, onMounted } from "vue";
    import { getFylist }  from "@/api/fylist";
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

    onMounted(() => {
        cityFy.forEach(async (item) => {
            const res = await getFylist({city_id: item.id})
            console.log(res);
            
            item.value = res.count;
        })
    })
    
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
</style>