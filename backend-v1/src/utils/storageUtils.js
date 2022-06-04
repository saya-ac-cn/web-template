/**
 * 进行local数据存储管理的工具模块
 */
import store from 'store'

const USER_KEY = 'user_key';
export default {

    /**
     * 保存
     * @param user 用户信息
     */
    add(key,val) {
        store.set(key, val)
    },

    /**
     *  读取
     * @returns {*|{}} 用户信息
     */
    get(key) {
        return store.get(key) || {}
    },

    /**
     * 删除
     */
    remove(key) {
        store.remove(key)
    },
    /**
     * 保存user
     * @param user 用户信息
     */
    saveUser(user) {
        // localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY, user)
    },

    /**
     *  读取user
     * @returns {*|{}} 用户信息
     */
    getUser() {
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },

    /**
     * 删除user
     */
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}
