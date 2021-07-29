import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Login from "../components/Login.vue";
import Demo from "../components/Demo.vue";
import UserList from "../components/UserList.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/",
        name: "Home",
        component: Home,
        redirect: to => {
            if (Vue.prototype.$bubble.getLoginInfo()) {
                return '/userList'
            } else {
                return '/login'
            }
        },
        children: [
            {
                path: "/demo",
                name: "demo",
                component: Demo,
                meta: "demo"
                //一下参数用于beforeEach中使用=>to.meta.requireAuth
                // meta: {
                //     requireAuth: true
                // }
            },
            {
                path: "/userList",
                name: "UserList",
                component: UserList,
                meta: "用户列表"
            }
        ]
    }
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    if (Vue.prototype.$bubble && Vue.prototype.$bubble.getLoginInfo()) {
        if (to.path == "/login") {
            next({ path: '/userList' })
        } else {
            next();
        }
    } else {
        if (to.path != "/login") {
            next({ path: '/login' })
        } else {
            next();
        }
    }
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
} 
export default router;
