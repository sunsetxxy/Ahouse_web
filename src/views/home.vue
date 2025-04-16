<template>
    <div class="home-container">
        <a-card class="search-card" :bordered="false">
            <!-- 标题 -->
            <div class="card-title">
                <home-outlined />
                <span>房源管理</span>
            </div>

            <!-- 搜索表单 -->
            <a-form
                :model="searchForm"
                layout="inline"
                @finish="handleSearch"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }"
                class="search-form"
            >
                <!-- 第一行 -->
                <a-row :gutter="24" style="width: 100%">
                    <a-col :span="6">
                        <a-form-item label="房屋名称">
                            <a-input
                                v-model:value="searchForm.search"
                                placeholder="请输入房屋名称"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="区域">
                            <a-input
                                v-model:value="searchForm.city_name"
                                placeholder="请输入区域名称"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="位置">
                            <a-input
                                v-model:value="searchForm.localhost"
                                placeholder="请输入具体位置"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="户型">
                            <a-input
                                v-model:value="searchForm.type_name"
                                placeholder="请输入户型"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 第二行 -->
                <a-row :gutter="24" style="width: 100%; margin-top: 8px">
                    <a-col :span="6">
                        <a-form-item label="楼层">
                            <a-input
                                v-model:value="searchForm.floor"
                                placeholder="请输入楼层"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="装修">
                            <a-input
                                v-model:value="searchForm.fitment"
                                placeholder="请输入装修情况"
                                allow-clear
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="价格区间">
                            <a-space>
                                <a-input-number
                                    v-model:value="searchForm.price_min"
                                    placeholder="最低价"
                                    :min="0"
                                    style="width: 110px"
                                />
                                <span>-</span>
                                <a-input-number
                                    v-model:value="searchForm.price_max"
                                    placeholder="最高价"
                                    :min="0"
                                    style="width: 110px"
                                />
                            </a-space>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="单价区间">
                            <a-space>
                                <a-input-number
                                    v-model:value="searchForm.single_price_min"
                                    placeholder="最低单价"
                                    :min="0"
                                    style="width: 110px"
                                />
                                <span>-</span>
                                <a-input-number
                                    v-model:value="searchForm.single_price_max"
                                    placeholder="最高单价"
                                    :min="0"
                                    style="width: 110px"
                                />
                            </a-space>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 按钮行 -->
                <a-row style="width: 100%; margin-top: 16px">
                    <a-col :span="24" style="text-align: right">
                        <a-space>
                            <a-button type="primary" html-type="submit">
                                <template #icon><search-outlined /></template>
                                查询
                            </a-button>
                            <a-button @click="resetSearch">
                                <template #icon><reload-outlined /></template>
                                重置
                            </a-button>
                            <!-- <a-button type="primary" @click="showAddModal">
                                <template #icon><plus-outlined /></template>
                                新增
                            </a-button> -->
                        </a-space>
                    </a-col>
                </a-row>
            </a-form>
        </a-card>

        <!-- 数据表格 -->
        <a-card class="table-card" :bordered="false" style="margin-top: 16px">
            <a-table
                :columns="columns"
                :data-source="data"
                :pagination="pagination"
                :loading="loading"
                @change="handleTableChange"
                :scroll="{ x: 1200 }"
                :row-key="record => record.id || record.house_name"
            >
                <!-- 自定义列 -->
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'price'">
                        <span class="price-column">{{ record.price }} 万</span>
                    </template>
                    <template v-if="column.key === 'single_price'">
                        <span>{{ record.single_price }} 元/㎡</span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <a-space>
                            <a-button type="link" size="small" @click="handleView(record)">
                                <template #icon><eye-outlined /></template>
                                查看
                            </a-button>
                            <!-- 添加 v-if 条件判断 -->
                            <a-button 
                                type="link" 
                                size="small" 
                                @click="handleEdit(record)"
                                v-if="is_staff"
                            >
                                <template #icon><edit-outlined /></template>
                                编辑
                            </a-button>
                        </a-space>
                    </template>
                </template>
            </a-table>
        </a-card>

        <!-- 新增/编辑弹窗 -->
        <a-modal
            v-model:visible="modalVisible"
            :title="modalTitle"
            @ok="handleSubmit"
            @cancel="resetForm"
            :width="700"
            :maskClosable="false"
        >
            <template #footer>
                <a-space>
                    <a-popconfirm
                        v-if="formState.id"
                        title="确定要删除该房源吗？"
                        @confirm="handleDelete(formState)"
                        ok-text="确定"
                        cancel-text="取消"
                    >
                        <a-button type="danger">
                            <template #icon><delete-outlined /></template>
                            删除
                        </a-button>
                    </a-popconfirm>
                    <a-button @click="resetForm">取消</a-button>
                    <a-button type="primary" @click="handleSubmit">确定</a-button>
                </a-space>
            </template>
            <a-form
                :model="formState"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 16 }"
                :rules="formRules"
            >
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item
                            label="房屋名称"
                            name="house_name"
                            :rules="[{ required: true, message: '请输入房屋名称' }]"
                        >
                            <a-input v-model:value="formState.house_name" placeholder="请输入房屋名称" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="区域"
                            name="city_name"
                            :rules="[{ required: true, message: '请输入区域' }]"
                        >
                            <a-input v-model:value="formState.city_name" placeholder="请输入区域" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item
                            label="位置"
                            name="localhost"
                            :rules="[{ required: true, message: '请输入具体位置' }]"
                        >
                            <a-input v-model:value="formState.localhost" placeholder="请输入具体位置" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="户型"
                            name="type_name"
                            :rules="[{ required: true, message: '请输入户型' }]"
                        >
                            <a-input v-model:value="formState.type_name" placeholder="请输入户型" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item
                            label="楼层"
                            name="floor"
                            :rules="[{ required: true, message: '请输入楼层' }]"
                        >
                            <a-input v-model:value="formState.floor" placeholder="请输入楼层" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="装修"
                            name="fitment"
                            :rules="[{ required: true, message: '请输入装修情况' }]"
                        >
                            <a-input v-model:value="formState.fitment" placeholder="请输入装修情况" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item
                            label="总价(万)"
                            name="price"
                            :rules="[{ required: true, message: '请输入总价' }]"
                        >
                            <a-input-number
                                v-model:value="formState.price"
                                placeholder="请输入总价"
                                :min="0"
                                style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="单价(元/㎡)"
                            name="single_price"
                            :rules="[{ required: true, message: '请输入单价' }]"
                        >
                            <a-input-number
                                v-model:value="formState.single_price"
                                placeholder="请输入单价"
                                :min="0"
                                style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item
                    label="备注"
                    name="remark"
                >
                    <a-textarea
                        v-model:value="formState.remark"
                        placeholder="请输入备注信息"
                        :rows="4"
                    />
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 查看详情弹窗 -->
        <a-modal
            v-model:visible="detailVisible"
            title="房源详情"
            @cancel="() => detailVisible = false"
            :footer="null"
            :width="700"
        >
            <a-descriptions bordered :column="2">
                <a-descriptions-item label="房屋名称">{{ currentRecord.house_name }}</a-descriptions-item>
                <a-descriptions-item label="区域">{{ currentRecord.city_name }}</a-descriptions-item>
                <a-descriptions-item label="位置">{{ currentRecord.localhost }}</a-descriptions-item>
                <a-descriptions-item label="户型">{{ currentRecord.type_name }}</a-descriptions-item>
                <a-descriptions-item label="楼层">{{ currentRecord.floor }}</a-descriptions-item>
                <a-descriptions-item label="装修">{{ currentRecord.fitment }}</a-descriptions-item>
                <a-descriptions-item label="总价">{{ currentRecord.price }} 万</a-descriptions-item>
                <a-descriptions-item label="单价">{{ currentRecord.single_price }} 元/㎡</a-descriptions-item>
                <a-descriptions-item label="链接" v-if="currentRecord.url">
                    <a :href="currentRecord.url" target="_blank" class="url-link">{{ currentRecord.url }}</a>
                </a-descriptions-item>
                <a-descriptions-item label="备注" :span="2">{{ currentRecord.remark || '暂无备注' }}</a-descriptions-item>
            </a-descriptions>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import {
    PlusOutlined,
    SearchOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    HomeOutlined
} from "@ant-design/icons-vue";
import type { TableProps } from "ant-design-vue";
import { getFylist, updateHouse } from "@/api/fylist";

// 搜索表单
const searchForm = reactive({
    search: "", // 房屋名称模糊搜索
    city_name: "", // 区域名称
    localhost: "", // 具体位置
    type_name: "", // 户型
    floor: "", // 楼层
    fitment: "", // 装修
    price_min: undefined, // 最低价格
    price_max: undefined, // 最高价格
    single_price_min: undefined, // 最低单价
    single_price_max: undefined, // 最高单价
});

// 表格列配置
const columns = [
    {
        title: "房屋名称",
        dataIndex: "house_name",
        key: "house_name",
        ellipsis: true,
    },
    {
        title: "区域",
        dataIndex: "city_name",
        key: "city_name",
        ellipsis: true,
    },
    {
        title: "位置",
        dataIndex: "localhost",
        key: "localhost",
        ellipsis: true,
    },
    {
        title: "户型",
        dataIndex: "type_name",
        key: "type_name",
        ellipsis: true,
    },
    {
        title: "楼层",
        dataIndex: "floor",
        key: "floor",
        width: 80,
    },
    {
        title: "装修",
        dataIndex: "fitment",
        key: "fitment",
        width: 80,
    },
    {
        title: "总价",
        dataIndex: "price",
        key: "price",
        width: 100,
        sorter: (a, b) => a.price - b.price,
    },
    {
        title: "单价",
        dataIndex: "single_price",
        key: "single_price",
        width: 120,
        sorter: (a, b) => a.single_price - b.single_price,
    },
    {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 200,
    },
];

// 定义房源项类型
interface HouseItem {
    id?: string;
    house_name: string;
    city_name: string;
    localhost: string;
    type_name: string;
    floor: string;
    fitment: string;
    price: number;
    single_price: number;
    remark?: string;
    url?: string; // 添加url字段
}

// 数据
const data = ref<HouseItem[]>([]);
const loading = ref(false);
const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条记录`,
});

// 新增/编辑表单
const modalVisible = ref(false);
const modalTitle = ref("新增房源");
const formState = reactive<HouseItem>({
    house_name: "",
    city_name: "",
    localhost: "",
    type_name: "",
    floor: "",
    fitment: "",
    price: 0,
    single_price: 0,
    remark: "",
});

// 表单验证规则
const formRules = {
    house_name: [{ required: true, message: "请输入房屋名称" }],
    city_name: [{ required: true, message: "请输入区域" }],
    localhost: [{ required: true, message: "请输入具体位置" }],
    type_name: [{ required: true, message: "请输入户型" }],
    floor: [{ required: true, message: "请输入楼层" }],
    fitment: [{ required: true, message: "请输入装修情况" }],
    price: [{ required: true, message: "请输入总价" }],
    single_price: [{ required: true, message: "请输入单价" }],
};

// 详情弹窗
const detailVisible = ref(false);
const currentRecord = ref<HouseItem>({} as HouseItem);

// 查询
const handleSearch = () => {
    pagination.current = 1;
    fetchData();
};

// 重置搜索
const resetSearch = () => {
    Object.assign(searchForm, {
        search: "",
        city_name: "",
        localhost: "",
        type_name: "",
        floor: "",
        fitment: "",
        price_min: undefined,
        price_max: undefined,
        single_price_min: undefined,
        single_price_max: undefined,
    });
    handleSearch();
};

// 分页/排序变化
const handleTableChange: TableProps["onChange"] = (pag, filters, sorter) => {
    pagination.current = pag.current!;
    pagination.pageSize = pag.pageSize!;
    fetchData();
};

// 获取数据
const fetchData = async () => {
    loading.value = true;
    try {
        const res = await getFylist({
            ...searchForm,
            page: pagination.current,
            size: pagination.pageSize,
        });
        data.value = res.data;
        pagination.total = res.count || res.data.length;
    } catch (error) {
        console.error("获取房源列表失败", error);
        message.error("获取房源列表失败");
    } finally {
        loading.value = false;
    }
};

// 显示新增弹窗
const showAddModal = () => {
    modalTitle.value = "新增房源";
    resetForm();
    modalVisible.value = true;
};

// 查看详情
const handleView = (record: HouseItem) => {
    currentRecord.value = { ...record };
    detailVisible.value = true;
};

// 编辑
const handleEdit = (record: HouseItem) => {
    modalTitle.value = "编辑房源";
    Object.assign(formState, { ...record });
    modalVisible.value = true;
};

// 删除
const handleDelete = async (record: HouseItem) => {
    try {
        // 这里应该调用删除接口
        // await deleteHouse(record.id);
        message.success("删除成功");
        fetchData();
    } catch (error) {
        console.error("删除失败", error);
        message.error("删除失败");
    }
};

// 提交表单
const handleSubmit = async () => {
    try {
        // 这里应该调用新增/编辑接口
        // if (formState.id) {
        const res:any = await updateHouse(formState);
        console.log(res);
        
        // } else {
        //   await addHouse(formState);
        // }
        if (res.code != 200) return message.error(res.msg);
        message.success(formState.id ? "编辑成功" : "新增成功");
        modalVisible.value = false;
        fetchData();
    } catch (error) {
        console.error("提交失败", error);
        message.error("提交失败");
    }
};

// 重置表单
const resetForm = () => {
    Object.assign(formState, {
        id: undefined,
        house_name: "",
        city_name: "",
        localhost: "",
        type_name: "",
        floor: "",
        fitment: "",
        price: 0,
        single_price: 0,
        remark: "",
    });
    modalVisible.value = false;
};

// 新增权限状态
const is_staff = JSON.parse(localStorage.getItem("is_staff") || "false");

// 初始化加载数据
onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.home-container {
    padding: 16px;
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

.search-form {
    width: 100%;
}

.price-column {
    color: #f5222d;
    font-weight: 500;
}

.url-link {
    color: #1890ff;
    text-decoration: underline;
    word-break: break-all;
}

.url-link:hover {
    color: #40a9ff;
}
</style>
