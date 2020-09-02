<template>
<div>
 <el-breadcrumb separator-class="el-icon-arrow-right">
   <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
   <el-breadcrumb-item >商品管理</el-breadcrumb-item>
   <el-breadcrumb-item >商品分类</el-breadcrumb-item>
 </el-breadcrumb>
 <!-- 卡片视图区域 --> 
 <el-card>
   <el-row>
     <el-col :span="1">
       <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
     </el-col>
   </el-row>
   <!-- 表格部分 -->
    <!-- columns  各列的配置 -->
    <tree-table
      :data="catelist"
      :columns="columns"
       :selection-type="false" 
       :expand-type="false"
      :show-index="true"
      index-text="#"
      border
      :show-row-hover="false"
        >
        <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
            <i class="el-icon-error" style="color: lightgreen;" v-else></i>
          </template>
          <!--  -->
          <template slot="sort" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini"  v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
          <!--  -->
          <template slot="todo" slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
          </template>          
        </tree-table>
  <!-- 分页 -->
  <el-pagination  
  @size-change="handleSizeChange" 
  @current-change="handleCurrentChange"
  :current-page="queryInfo.pagenum"
  :page-sizes="[3,5,10]"
  :page-size="queryInfo.pagesize"
  layout="total, sizes, prev, pager, next,  jumper"
  :total="total"
  >

  </el-pagination>
 </el-card>
 <!-- 添加分类对话框 -->
 <el-dialog title="添加分类" 
 :visible.sync="addCateDialogVisible"
 width="50%"
 @close="addCateDialogClosed"

 >
 <!-- 对话框表格 -->
 <el-form :model = "addCateForm" ref = "addCateFormRef" :rules = "addCateFormRules">
   <el-form-item label="分类名称" label-width="100px" prop="cat_name">
     <el-input v-model = "addCateForm.cat_name"></el-input>
   </el-form-item>

   <el-form-item label="父级分类" label-width="100px" >
    <div class="block">
      <!-- props 用来指定配置对象 -->
  <el-cascader
    :options="parentCateList"
    :props="cascaderProps"
    v-model="selectedKeys"
    @change="parentCateChanged"
    clearable
    expand-trigger="hover"
    ></el-cascader>
</div>
   </el-form-item>

 </el-form>

 <el-button type="primary" @click="addCateDialogVisible =false" >取消  </el-button>
 <el-button type="primary" @click="addCate">确定</el-button>
 </el-dialog>
</div>
</template>
<script>
export default {
  data() {
    return {
      // 查询的参数保存
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 父级分类的列表
      parentCateList: [],
      // 商品分类的列表，默认为空
      catelist: [],
      // 数据总数
      total: 0,
      // 控制添加对话框的显示
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        // 分类的等级 默认为一级分类
        cat_level: 0,
        // 父级的ID
        cat_pid: 0
      },
      addCateFormRef: '',
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      },
      // 级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
        // checkStrictly: true
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
      // 父级分类的列表
      parentCateList: [],
      columns: [
        {
          label: '分类名称',
          // 对应列内容的属性名
          prop: 'cat_name',
          width: '400px'
        },
        {
          label: '是否有效',
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'todo'
        }
      ]
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.$message.success('获取商品分类数据成功')
      this.catelist = res.data.result

      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      console.log(newSize)

      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.$message.success('获取商品分类成功')
      this.parentCateList = res.data
    },
    // 选择项发生变法触发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys)
      // 如果selectedKey 数组中的length大于0 有选中 反之没有
      if (this.selectedKeys.length > 0) {
        // 父级分类的ID发生变化
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList();
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  },
  created() {
    this.getCateList()
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>

