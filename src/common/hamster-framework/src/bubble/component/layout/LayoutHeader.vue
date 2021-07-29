<template>
  <header class="bubble-layout-header">
    <div class="title-wrap">
      <i
        class="el-icon-s-fold"
        v-show="
          currentPageSize == 'normal' ? currentMenuSize == 'normal' : menuDrawer
        "
        @click="toggleSize"
      ></i>
      <i
        class="el-icon-s-unfold"
        v-show="
          currentPageSize == 'normal' ? currentMenuSize == 'mini' : !menuDrawer
        "
        @click="toggleSize"
      ></i>
      <span v-show="currentPageSize == 'mini'">{{ $bubble.miniTitle }}</span>
      <span v-show="currentPageSize == 'normal'"
        >欢迎进入 {{ $bubble.title }}</span
      >
    </div>
    <div class="user-wrapper">
      <span
        class="action notice"
        :class="{ 'action-full': currentPageSize == 'normal' }"
        @click="handleClickBell"
      >
        <i class="el-icon-bell"></i>
        <div v-if="count && count != 0">{{ count > 99 ? "99+" : count }}</div>
      </span>
      <el-dropdown :hide-on-click="false">
        <!-- <span class="el-dropdown-link">
          下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </span> -->
        <span
          class="action"
          :class="{ 'action-full': currentPageSize == 'normal' }"
          :title="username"
        >
          <el-avatar
            class="avatar"
            :size="32"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          ></el-avatar>
          <span v-show="currentPageSize == 'normal'"
            >欢迎您，{{
              username.length > 6 ? username.substring(0, 6) + "..." : username
            }}</span
          >
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span class="action" @click="handleLogout">
              <a class="a_title" href="javascript:;">
                <i class="el-icon-switch-button" v-show="!loginoutLoading"></i>
                <i class="el-icon-loading" v-show="loginoutLoading"></i>
                <span>&nbsp;退出登录</span>
              </a>
            </span></el-dropdown-item
          > 
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <span class="action">
                <a class="a_title" href="javascript:;" @click="handleLogout">
                    <i class="el-icon-setting"></i>
                    <span>&nbsp;系统设置</span>
                </a>
            </span> -->
    </div>
  </header>
</template>

<script>
export default {
  name: "LayoutHeader",
  props: {
    currentPageSize: {
      type: String,
    },
    currentMenuSize: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    menuDrawer: {
      type: Boolean,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loginoutLoading: false,
    };
  },
  created() {},
  methods: {
    handleClickBell() {
      this.$bubble.trigger("clickBell");
    },
    handleLogout() {
      this.loginoutLoading = true;
      this.$bubble.trigger("loginout");
    },
    toggleSize() {
      this.$emit(
        "toggleMenuSize",
        this.currentMenuSize == "normal" ? "mini" : "normal"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dropdown {
  color: #fff !important;
}
.bubble-layout-header {
  z-index: 2;
  color: white;
  height: 59px;
  line-height: 59px;
  background-color: #1d1e23;
  transition: background 300ms;
  padding: 0 12px 0 0;
  flex: 0 0 auto;
  position: fixed;
  left: 200px;
  top: 0;
  right: 0;
  transition: all 0.3s;

  .notice {
    position: relative;
    i {
      font-size: 32px;
    }
    > div {
      height: 20px;
      padding: 0 2px;
      min-width: 20px;
      border-radius: 20px;
      background: red;
      text-align: center;
      line-height: 20px;
      position: absolute;
      right: 5px;
      top: 10px;
    }
  }

  &.miniMenu {
    left: 65px;
  }

  &.miniPage {
    left: 0;
  }

  .title-wrap {
    float: left;

    i {
      font-size: 28px;
      line-height: 42px;
      padding: 0 10px;
      cursor: pointer;
      vertical-align: middle;
      transition: color 0.3s, background 0.3s;
    }

    i:hover {
      background: hsla(0, 0%, 100%, 0.3);
    }
  }

  .user-wrapper {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .action {
      cursor: pointer;
      padding: 0 14px;
      display: inline-block;
      transition: all 0.3s;
      height: 40px;
      line-height: 40px;
      transition: background 300ms;

      .a_title {
        color: inherit;
        text-decoration: none;
      }

      &:hover {
        background: hsla(0, 0%, 100%, 0.3);
      }
    }

    .action-full {
      height: 100%;
      line-height: 59px;
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar {
        margin-right: 10px;
      }
    }

    .avatar {
      vertical-align: middle;
    }
  }
}
</style>