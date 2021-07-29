<template>
    <div class="login">
        <el-form class="login-form" ref="form" :model="form" label-width="80px">
            <h3 class="title">后台管理系统</h3>
            <el-form-item>
                <el-input v-model="form.name" prefix-icon="el-icon-s-custom" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input show-password v-model="form.password" prefix-icon="el-icon-lock" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input class="validcode" v-model="form.code" placeholder="验证码">
                    <svg class="icon" aria-hidden="true" slot="prefix">
                        <use xlink:href="#iconyanzhengma"></use>
                    </svg>
                </el-input>
                <div class="login-code">
                    <img @click="changeCode"
                        src="data:image/gif;base64,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"
                        class="login-code-img">
                </div>
            </el-form-item>
            <el-form-item>
                <el-button style="width: 100%;" type="primary" :loading="submitLoading" @click="onSubmit">登录</el-button>
            </el-form-item>
        </el-form>
        <div class="el-login-footer"><span>Copyright © 2018-2020 ruoyi.vip All Rights Reserved.</span></div>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            form: { name: "gqf", password: "1", code: "" },
            submitLoading: false
        }
    },
    methods: {
        onSubmit(v) {
            this.submitLoading = true;
            setTimeout(() => {
     
                this.$bubble.requestLogin("user.login").then((v) => {
                    this.$router.push('/')
                    this.submitLoading = false;
                });
            }, 500);
        },
        changeCode() {

        }
    }
}
</script>

<style scoped lang="scss">
.login {
    width: 100%;
    height: 100%;
    background: url(../assets/login-background.jpg);
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-form {
        border-radius: 6px;
        background: #fff;
        width: 400px;
        box-sizing: border-box;
        padding: 25px 25px 5px 25px;

        .title {
            margin: 0 auto 30px auto;
            text-align: center;
            color: #707070;
        }
    }

    .el-login-footer {
        height: 40px;
        line-height: 40px;
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        color: #fff;
        font-family: Arial;
        font-size: 12px;
        letter-spacing: 1px;
    }
}
</style>

<style lang="scss">
.login {
    .el-form-item__content {
        margin-left: 0 !important;
    }

    .el-input--prefix .el-input__inner {
        padding-left: 35px;
    }

    .el-input__icon {
        font-size: 18px;
        width: 30px;
    }

    .icon {
        font-size: 18px;
        display: inline-block;
        width: 30px;
    }

    .validcode {
        width: 225px;
    }

    .login-code {
        width: 110px;
        height: 40px;
        float: right;
        text-align: right;

        .login-code-img {
            cursor: pointer;
            height: 40px;
        }
    }
}
</style>