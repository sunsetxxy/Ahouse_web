<template>
    <a-card>
        <!-- 搜索表单 -->
        <a-form
            :model="searchForm"
            layout="inline"
            @finish="handleSearch"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
        >
            <!-- 第一行 -->
            <a-row :gutter="16" style="width: 85%">
                <a-col :span="6">
                    <a-form-item label="房屋名称">
                        <a-input
                            v-model:value="searchForm.search"
                            placeholder="请输入房屋名称"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="区域">
                        <a-input
                            v-model:value="searchForm.city_name"
                            placeholder="请输入区域名称"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="位置">
                        <a-input
                            v-model:value="searchForm.localhost"
                            placeholder="请输入具体位置"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="户型">
                        <a-input
                            v-model:value="searchForm.type_name"
                            placeholder="请输入户型"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <!-- 第三行：按钮行 -->
            <a-row style="width: 10%">
                <a-col>
                    <a-form-item>
                        <a-space>
                            <a-button type="primary" html-type="submit"
                                >查询</a-button
                            >
                            <a-button
                                style="margin-left: 8px"
                                @click="resetSearch"
                                >重置</a-button
                            >
                            <a-button type="primary" @click="showAddModal">
                                <template #icon><plus-outlined /></template>
                                新增
                            </a-button>
                        </a-space>
                    </a-form-item>
                </a-col>
            </a-row>
            <!-- 第二行 -->
            <a-row :gutter="16" style="margin-top: 16px; width: 85%">
                <a-col :span="6">
                    <a-form-item label="楼层">
                        <a-input
                            v-model:value="searchForm.floor"
                            placeholder="请输入楼层"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="装修">
                        <a-input
                            v-model:value="searchForm.fitment"
                            placeholder="请输入装修情况"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="价格区间">
                        <a-input-number
                            v-model:value="searchForm.price_min"
                            placeholder="最低价"
                            :min="0"
                            style="width: 135px"
                        />
                        <span style="margin: 0 8px">-</span>
                        <a-input-number
                            v-model:value="searchForm.price_max"
                            placeholder="最高价"
                            :min="0"
                            style="width: 135px"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="单价区间">
                        <a-input-number
                            v-model:value="searchForm.single_price_min"
                            placeholder="最低单价"
                            :min="0"
                            style="width: 135px"
                        />
                        <span style="margin: 0 8px">-</span>
                        <a-input-number
                            v-model:value="searchForm.single_price_max"
                            placeholder="最高单价"
                            :min="0"
                            style="width: 135px"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <!-- 操作按钮 -->
        <div style="margin: 16px 0"></div>

        <!-- 数据表格 -->
        <a-table
            :columns="columns"
            :data-source="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
        >
            <template #action="{ record }">
                <a-button type="link" @click="handleEdit(record)"
                    >编辑</a-button
                >
                <a-button type="link" danger @click="handleDelete(record)"
                    >删除</a-button
                >
            </template>
        </a-table>

        <!-- 新增/编辑弹窗 -->
        <a-modal
            v-model:visible="modalVisible"
            :title="modalTitle"
            @ok="handleSubmit"
            @cancel="resetForm"
        >
            <a-form
                :model="formState"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 16 }"
            >
                <a-form-item
                    label="用户名"
                    name="username"
                    :rules="[{ required: true, message: '请输入用户名' }]"
                >
                    <a-input v-model:value="formState.username" />
                </a-form-item>
                <a-form-item
                    label="手机号"
                    name="phone"
                    :rules="[{ required: true, message: '请输入手机号' }]"
                >
                    <a-input v-model:value="formState.phone" />
                </a-form-item>
                <a-form-item label="状态" name="status">
                    <a-switch
                        v-model:checked="formState.status"
                        checked-children="启用"
                        un-checked-children="禁用"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-card>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import type { TableProps } from "ant-design-vue";
import { getFylist } from "@/api/fylist";

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
        key: "name",
    },
    {
        title: "区域",
        dataIndex: "city_name",
        key: "city_name",
    },
    {
        title: "位置",
        dataIndex: "localhost",
        key: "localhost",
    },
    {
        title: "户型",
        dataIndex: "type_name",
        key: "type_name",
    },
    {
        title: "楼层",
        dataIndex: "floor",
        key: "floor",
    },
    {
        title: "装修",
        dataIndex: "fitment",
        key: "fitment",
    },
    {
        title: "总价",
        dataIndex: "price",
        key: "price",
        customRender: ({ text }: { text: number }) => `${text} 万`,
    },
    {
        title: "单价",
        dataIndex: "single_price",
        key: "single_price",
        customRender: ({ text }: { text: number }) => `${text} 元/㎡`,
    },
    {
        title: "操作",
        key: "action",
        slots: { customRender: "action" },
    },
];

// 数据
const data = ref<UserItem[]>([]);
const loading = ref(false);
const pagination = reactive({
    current: 1,
    pageSize: 30,
    total: 0,
});

// 新增/编辑表单
const modalVisible = ref(false);
const modalTitle = ref("新增用户");

// 查询
const handleSearch = () => {
    pagination.current = 1;
    fetchData();
};

// 重置搜索
const resetSearch = () => {
    Object.assign(searchForm, {
        username: "",
        status: "",
    });
    handleSearch();
};

// 分页/排序变化
const handleTableChange: TableProps["onChange"] = (pag) => {
    pagination.current = pag.current!;
    fetchData();
};

// 获取数据
const fetchData = async () => {
    loading.value = true;
    try {
        // 这里调用接口获取数据
        // const res = await api.getUserList({
        //   ...searchForm,
        //   page: pagination.current,
        //   pageSize: pagination.pageSize
        // });
        // data.value = res.data.list;
        // pagination.total = res.data.total;
        const res = await getFylist(searchForm);
        console.log(res);
        data.value = res.data;
        pagination.total = res.count;
    } finally {
        loading.value = false;
    }
};

// 显示新增弹窗
const showAddModal = () => {
    modalTitle.value = "新增用户";
    modalVisible.value = true;
};

// 编辑
const handleEdit = (record: UserItem) => {
    modalTitle.value = "编辑用户";
    Object.assign(formState, record);
    modalVisible.value = true;
};

// 删除
const handleDelete = (record: UserItem) => {
    // 调用删除接口
    console.log("删除", record);
};

// 提交表单
const handleSubmit = () => {
    // 调用新增/编辑接口
    console.log("提交", formState);
    modalVisible.value = false;
};

// 重置表单
const resetForm = () => {
    Object.assign(formState, {
        id: "",
        username: "",
        phone: "",
        status: true,
    });
};

// 初始化加载数据
fetchData();
</script>
