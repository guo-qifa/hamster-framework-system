<template>
    <div class="bubble-layout-menu">
        <div class="bubble-layout-logo">
            <img :src="logo">
            <h1>{{$bubble.miniTitle}}</h1>
        </div>
        <el-menu :router="true" class="el-menu-vertical-demo" :default-active="$route.path" @open="handleOpen" @close="handleClose" :collapse="currentMenuSize == 'mini'">
            <template v-for="item in menu">
                <!-- 包含子菜单 -->
                <el-submenu :index="item.path || item.title" :key="item.path" v-if="item.children">
                    <template slot="title">
                        <i v-if="item.icon.indexOf('el-') >= 0" :class="item.icon"></i>
                        <svg v-if="item.icon.indexOf('el-') < 0" class="icon" aria-hidden="true">
                            <use :xlink:href="'#' + item.icon"></use>
                        </svg>
                        <span>{{item.title}}</span>
                    </template>
                    <el-menu-item v-for="sitem in item.children" :key="sitem.path" :index="sitem.path || sitem.title" :route="{path: sitem.path,query: sitem.query || undefined}">{{sitem.title}}</el-menu-item>
                </el-submenu>
                <!-- 不包含子菜单 -->
                <el-menu-item :index="item.path || item.title" :key="item.path" v-if="!item.children" :route="{path: item.path,query: item.query || undefined}">
                    <i v-if="item.icon.indexOf('el-') >= 0" :class="item.icon"></i>
                    <svg v-if="item.icon.indexOf('el-') < 0" class="icon" aria-hidden="true">
                        <use :xlink:href="'#' + item.icon"></use>
                    </svg>
                    <span slot="title">{{item.title}}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
import LogoImgae from '@/assets/logo2.png'; 
export default {
    name: "LayoutMenu",
    props: {
        menu: {
            type: Array,
            required: true
        },
        currentMenuSize: {
            type: String,
            required: true
        },
        currentPageSize: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            
            logo: this.$bubble.config.Logo ? require("../../../assets/" + this.$bubble.config.Logo) : LogoImgae
        }
    },
    methods: {
        handleOpen() {

        },
        handleClose() {

        }
    },
    created() {
        //菜单宽度状态变更
        this.$watch("currentMenuSize", (n) => {

        });
        //菜单侧边弹出状态变更
        this.$watch("currentPageSize", (n) => {

        });
    }
}
</script>

<style lang="scss" scoped>
.bubble-layout-menu {
    .el-menu--collapse {
        width: 65px !important;
    }
}

.bubble-layout-menu .icon {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 20px;
    vertical-align: middle;
}

.bubble-layout-logo {
    height: 59px !important;
    line-height: 59px !important;
    box-shadow: none !important;
    transition: background 300ms;
    background-color: #1d1e23;
    color: #fff;
    text-align: left;
    padding: 0 10px;

    img {
        width: 45px;
        display: inline-block;
        vertical-align: middle;
        border-radius: 50%;
        height: 45px;
    }

    h1 {
        font-size: 18px;
        margin: 0 0 0 8px;
        font-weight: 600;
        display: inline-block;
    }
}

.el-menu-vertical-demo {
    display: inline-block;
    text-align: left;
    width: 200px;
    min-height: 400px;
    transition: all 0.3s;
    border: none;

    &.miniMenu {
        width: 65px;
    }
}
</style>