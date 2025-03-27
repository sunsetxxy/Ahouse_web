<template>
  <div>
    <a-input
      v-model:value="username"
      placeholder="搜索用户"
      style="width: 200px; margin-bottom: 16px"
    />
    <a-button type="primary" style="margin-left: 15px" @click="handleSearch"
      >查询</a-button
    >
    <a-table
      :columns="columns"
      :data-source="filteredUsers"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'is_staff'">
          <span>
            {{ record.is_staff ? "是" : "否"  }}
          </span>
        </template>
        <template v-if="column.key === 'is_active'">
          <span>
            {{ record.is_active ? "是" : "否"  }}
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import { userList } from "@/api/user";

// 搜索文本
const username = ref("");

// 过滤后的用户列表
const filteredUsers = ref([]);

// 表格分页配置
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: filteredUsers.value.length,
});

// 表格列定义
const columns = [
  {
    title: "姓名",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "管理员",
    dataIndex: "is_staff",
    key: "is_staff",
  },
  {
    title: "账号状态",
    dataIndex: "is_active",
    key: "is_active",
  },
];

onMounted(() => {
  handleSearch();
});

// 处理搜索事件
const handleSearch = async () => {
  const res = await userList({ username: username.value });
  console.log(res);
  if (res.code === "200") {
    filteredUsers.value = res.data;
  }
  pagination.value.current = 1;
  pagination.value.total = res.count;
};

// 处理表格分页和排序变化
const handleTableChange = (paginationInfo) => {
  pagination.value.current = paginationInfo.current;
  pagination.value.pageSize = paginationInfo.pageSize;
};
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
