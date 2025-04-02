<template>
  <div>
    <div style="display: flex; align-items: center; margin-bottom: 16px">
      <a-input
        v-model:value="username"
        placeholder="搜索用户"
        style="width: 200px"
      />
      <a-button type="primary" style="margin-left: 15px" @click="handleSearch"
        >查询</a-button
      >
      <a-button 
        v-if="isAdmin" 
        type="primary" 
        style="margin-left: 15px" 
        @click="handleAdd"
      >
        <template #icon><plus-outlined /></template>
        新增用户
      </a-button>
    </div>
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
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)">
              <template #icon><edit-outlined /></template>
              修改
            </a-button>
            <a-button type="link" size="small" @click="handlePasswordChange(record)">
              <template #icon><lock-outlined /></template>
              修改密码
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 修改用户信息弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      title="修改用户信息"
      @ok="handleSubmit"
      @cancel="() => modalVisible = false"
      :width="500"
      :maskClosable="false"
    >
      <a-form
        :model="formState"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        :rules="formRules"
      >
        <a-form-item
          label="用户名"
          name="username"
        >
          <a-input v-model:value="formState.username" placeholder="请输入用户名" disabled />
        </a-form-item>
        <a-form-item
          label="邮箱"
          name="email"
          :rules="[{ type: 'email', message: '请输入有效的邮箱地址' }]"
        >
          <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item
          label="名字"
          name="first_name"
        >
          <a-input v-model:value="formState.first_name" placeholder="请输入名字" />
        </a-form-item>
        <a-form-item
          label="姓氏"
          name="last_name"
        >
          <a-input v-model:value="formState.last_name" placeholder="请输入姓氏" />
        </a-form-item>
        <a-form-item
          v-if="isAdmin"
          label="管理员权限"
          name="is_staff"
        >
          <a-switch v-model:checked="formState.is_staff" />
        </a-form-item>
        <a-form-item
          v-if="isAdmin"
          label="账号状态"
          name="is_active"
        >
          <a-switch v-model:checked="formState.is_active" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="() => modalVisible = false">取消</a-button>
          <a-button type="primary" @click="handleSubmit">确定</a-button>
        </a-space>
      </template>
    </a-modal>

    <!-- 新增用户弹窗 -->
    <a-modal
      v-model:visible="addUserModalVisible"
      title="新增用户"
      @ok="handleAddUserSubmit"
      @cancel="() => addUserModalVisible = false"
      :width="500"
      :maskClosable="false"
    >
      <a-form
        :model="addUserForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        :rules="addUserRules"
        ref="addUserFormRef"
      >
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input v-model:value="addUserForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item
          label="邮箱"
          name="email"
          :rules="[{ type: 'email', message: '请输入有效的邮箱地址' }]"
        >
          <a-input v-model:value="addUserForm.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码' }, { min: 6, message: '密码长度不能少于6个字符' }]"
        >
          <a-input-password v-model:value="addUserForm.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item
          label="确认密码"
          name="password2"
          :rules="[{ required: true, message: '请确认密码' }, { validator: validateAddUserPasswordConfirm }]"
        >
          <a-input-password v-model:value="addUserForm.password2" placeholder="请确认密码" />
        </a-form-item>
        <a-form-item
          label="名字"
          name="first_name"
        >
          <a-input v-model:value="addUserForm.first_name" placeholder="请输入名字" />
        </a-form-item>
        <a-form-item
          label="姓氏"
          name="last_name"
        >
          <a-input v-model:value="addUserForm.last_name" placeholder="请输入姓氏" />
        </a-form-item>
        <a-form-item
          v-if="isAdmin"
          label="管理员权限"
          name="is_staff"
        >
          <a-switch v-model:checked="addUserForm.is_staff" />
        </a-form-item>
        <a-form-item
          v-if="isAdmin"
          label="账号状态"
          name="is_active"
        >
          <a-switch v-model:checked="addUserForm.is_active" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="() => addUserModalVisible = false">取消</a-button>
          <a-button type="primary" @click="handleAddUserSubmit">确定</a-button>
        </a-space>
      </template>
    </a-modal>

    <!-- 修改密码弹窗 -->
    <a-modal
      v-model:visible="passwordModalVisible"
      title="修改密码"
      @ok="handlePasswordSubmit"
      @cancel="() => passwordModalVisible = false"
      :width="500"
      :maskClosable="false"
    >
      <a-form
        :model="passwordForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        :rules="passwordRules"
        ref="passwordFormRef"
      >
        <a-form-item
          label="旧密码"
          name="old_password"
          :rules="[{ required: true, message: '请输入旧密码' }]"
        >
          <a-input-password v-model:value="passwordForm.old_password" placeholder="请输入旧密码" />
        </a-form-item>
        <a-form-item
          label="新密码"
          name="new_password"
          :rules="[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码长度不能少于6个字符' }]"
        >
          <a-input-password v-model:value="passwordForm.new_password" placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item
          label="确认新密码"
          name="new_password2"
          :rules="[{ required: true, message: '请确认新密码' }, { validator: validatePasswordConfirm }]"
        >
          <a-input-password v-model:value="passwordForm.new_password2" placeholder="请确认新密码" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="() => passwordModalVisible = false">取消</a-button>
          <a-button type="primary" @click="handlePasswordSubmit">确定</a-button>
        </a-space>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import { EditOutlined, LockOutlined, PlusOutlined } from "@ant-design/icons-vue";

import { userList, updateUserInfo, adminUpdateUserInfo, updatePassword, register } from "@/api/user";

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

// 对话框可见性
const modalVisible = ref(false);

// 表单状态
const formState = reactive({
  id: null,
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  is_staff: false,
  is_active: false
});

// 表单验证规则
const formRules = {
  // 移除用户名的必填验证，因为用户名不可修改
  email: [
    { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" }
  ],
  first_name: [
    { max: 30, message: "名字长度不能超过30个字符", trigger: "blur" }
  ],
  last_name: [
    { max: 30, message: "姓氏长度不能超过30个字符", trigger: "blur" }
  ]
};

// 密码修改对话框可见性
const passwordModalVisible = ref(false);

// 密码修改表单
const passwordForm = reactive({
  userId: null,
  old_password: "",
  new_password: "",
  new_password2: ""
});

// 密码表单引用
const passwordFormRef = ref(null);

// 验证两次密码输入是否一致
const validatePasswordConfirm = async (rule, value) => {
  if (value !== passwordForm.new_password) {
    return Promise.reject("两次输入的密码不一致");
  }
  return Promise.resolve();
};

// 密码表单验证规则
const passwordRules = {
  old_password: [
    { required: true, message: "请输入旧密码", trigger: "blur" }
  ],
  new_password: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6个字符", trigger: "blur" }
  ],
  new_password2: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    { validator: validatePasswordConfirm, trigger: "blur" }
  ]
};

// 新增用户对话框可见性
const addUserModalVisible = ref(false);

// 新增用户表单引用
const addUserFormRef = ref(null);

// 新增用户表单
const addUserForm = reactive({
  username: "",
  email: "",
  password: "",
  password2: "",
  first_name: "",
  last_name: "",
  is_staff: false,
  is_active: true
});

// 验证新增用户两次密码输入是否一致
const validateAddUserPasswordConfirm = async (rule, value) => {
  if (value !== addUserForm.password) {
    return Promise.reject("两次输入的密码不一致");
  }
  return Promise.resolve();
};

// 新增用户表单验证规则
const addUserRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" }
  ],
  email: [
    { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6个字符", trigger: "blur" }
  ],
  password2: [
    { required: true, message: "请确认密码", trigger: "blur" },
    { validator: validateAddUserPasswordConfirm, trigger: "blur" }
  ]
};

// 是否为管理员
const isAdmin = ref(localStorage.getItem("is_staff") === "true");

// 表格列定义
const columns = [
  {
    title: "用户名",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "名字",
    dataIndex: "first_name",
    key: "first_name",
  },
  {
    title: "姓氏",
    dataIndex: "last_name",
    key: "last_name",
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
  {
    title: "操作",
    key: "action",
    width: 150,
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

// 处理编辑用户信息
const handleEdit = (record) => {
  formState.id = record.id;
  formState.username = record.username;
  formState.email = record.email;
  formState.first_name = record.first_name || "";
  formState.last_name = record.last_name || "";
  formState.is_staff = record.is_staff;
  formState.is_active = record.is_active;
  modalVisible.value = true;
};

// 处理修改密码
const handlePasswordChange = (record) => {
  passwordForm.userId = record.id;
  passwordForm.old_password = "";
  passwordForm.new_password = "";
  passwordForm.new_password2 = "";
  passwordModalVisible.value = true;
};

// 处理密码修改提交
const handlePasswordSubmit = async () => {
  try {
    // 表单验证
    await passwordFormRef.value.validate();
    
    // 提交密码修改
    const res = await updatePassword({
      old_password: passwordForm.old_password,
      new_password: passwordForm.new_password,
      new_password2: passwordForm.new_password2
    });
    
    if (res.code === 200 || res.code === "200") {
      message.success("密码修改成功");
      passwordModalVisible.value = false;
    }
  } catch (error) {
    console.error("密码修改失败:", error);
    if (error.response && error.response.data) {
      message.error(error.response.data.info || error.response.data.message || "密码修改失败");
    } else if (error.message && error.message.includes("Network Error")) {
      message.error("网络连接异常，请检查网络设置");
    } else {
      message.error("密码修改失败，请稍后重试");
    }
  }
};

// 处理提交表单
const handleSubmit = async () => {
  try {
    if (isAdmin.value) {
      // 管理员更新用户信息
      const res = await adminUpdateUserInfo(formState.id, {
        // 不传递用户名，因为用户名不可修改
        email: formState.email,
        first_name: formState.first_name,
        last_name: formState.last_name,
        is_staff: formState.is_staff,
        is_active: formState.is_active
      });
      if (res.code === 200 || res.code === "200") {
        message.success("用户信息修改成功");
        modalVisible.value = false;
        // 刷新用户列表
        handleSearch();
      }
    } else {
      // 普通用户只能修改自己的信息
      const res = await updateUserInfo({
        // 不传递用户名，因为用户名不可修改
        email: formState.email,
        first_name: formState.first_name,
        last_name: formState.last_name
      });
      if (res.code === 200 || res.code === "200") {
        message.success("用户信息修改成功");
        modalVisible.value = false;
        // 刷新用户列表
        handleSearch();
      }
    }
  } catch (error) {
    console.error("更新用户信息失败:", error);
    if (error.response && error.response.data) {
      message.error(error.response.data.info || error.response.data.message || "更新用户信息失败");
    } else {
      message.error("更新用户信息失败，请检查网络连接");
    }
  }
};

// 处理新增用户按钮点击
const handleAdd = () => {
  // 重置表单
  addUserForm.username = "";
  addUserForm.email = "";
  addUserForm.password = "";
  addUserForm.password2 = "";
  addUserForm.first_name = "";
  addUserForm.last_name = "";
  addUserForm.is_staff = false;
  addUserForm.is_active = true;
  
  // 显示新增用户对话框
  addUserModalVisible.value = true;
};

// 处理新增用户提交
const handleAddUserSubmit = async () => {
  try {
    // 表单验证
    await addUserFormRef.value.validate();
    
    // 提交新增用户
    // 根据API文档，注册接口只需要username、email、password和password2字段
    const registerData = {
      username: addUserForm.username,
      email: addUserForm.email,
      password: addUserForm.password,
      password2: addUserForm.password2
    };
    
    const res = await register(registerData);
    
    if (res.code === "201" || res.code === 201) {
      // 如果是管理员创建用户，需要额外调用管理员更新接口更新附加字段
      if (isAdmin.value && res.user && res.user.id) {
        try {
          await adminUpdateUserInfo(res.user.id, {
            first_name: addUserForm.first_name,
            last_name: addUserForm.last_name,
            is_staff: addUserForm.is_staff,
            is_active: addUserForm.is_active
          });
        } catch (error) {
          console.error("更新用户附加信息失败:", error);
        }
      }
      message.success("用户创建成功");
      addUserModalVisible.value = false;
      // 刷新用户列表
      handleSearch();
    }
  } catch (error) {
    console.error("创建用户失败:", error);
    if (error.response && error.response.data) {
      message.error(error.response.data.info || error.response.data.message || "创建用户失败");
    } else if (error.message && error.message.includes("Network Error")) {
      message.error("网络连接异常，请检查网络设置");
    } else {
      message.error("创建用户失败，请稍后重试");
    }
  }
};
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
