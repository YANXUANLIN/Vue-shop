<template>
  <div class="login_container">
      <div class="login_box">
        <!-- 头像区域 -->
        <div class="avatar_box">
          <img src="../assets/logo.png">
        </div>
        <!-- 登陆表单 -->
        <el-form class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <!--  密码 -->
          <el-form-item prop="password">
            <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item class="btns"> 
            <el-button type="primary" @click="login">登录</el-button> 
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>

      </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      // 登录表单的数据绑定
      loginForm:{
        username:'admin',
        password:'123456',

      },
      // 表单的验证规则对象
      loginFormRules: {
        username: [
          {required: true, message:'请输入登录名称', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          {required: true, message:'请输入密码', trigger: 'blur'},
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
     login(){
      this.$refs.loginFormRef.validate(async(valid)=>{
        if(!valid) return; 
        const {data:res}= await this.$http.post('login',this.loginForm);
        if(res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        //保存token到session
        window.sessionStorage.setItem('token',res.data.token);
        //登陆成功后跳转页面 
        this.$router.push('/home');
      });
    } 
  }
} 
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color:#2b4b6b;
}
.login_box{
  width:450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border:2px solid white;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 5px #ddd;
    position: absolute;
    top:-50%;
    left: 50%;
    transform: translate(-50%,50%) ;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;   
      background-color: #eee;
      }

    }
    .btns {
      display: flex;
      justify-content:flex-end;
    } 
    .login_form {
      position: absolute;;
      bottom: 0;
      width: 100%;
      padding:0 20px;
      box-sizing: border-box;
    }
  }
</style>