'use strict'

/**
 * egg-dora-pluginmanage default config
 * @member Config#eggDoraPluginManage
 * @property {String} SOME_KEY - some description
 */

const pkgInfo = require('../package.json');
exports.doraPluginManage = {
    alias: 'pluginManage', // 插件目录，必须为英文
    pkgName: 'egg-dora-pluginmanage', // 插件包名
    enName: 'doraPluginManage', // 插件名
    name: '插件管理', // 插件名称
    description: '插件管理', // 插件描述
    isadm: 1, // 是否有后台管理，1：有，0：没有，入口地址:'/ext/devteam/admin/index'
    isindex: 0, // 是否需要前台访问，1：需要，0：不需要,入口地址:'/ext/devteam/index/index'
    version: pkgInfo.version, // 版本号
    iconName: 'icon_service', // 主菜单图标名称
    adminUrl: 'https://cdn.html-js.cn/cms/plugins/static/admin/pluginManage/js/app.js',
    adminApi: [{
        url: 'pluginManage/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取插件管理列表',
    }, {
        url: 'pluginManage/getOne',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单条插件管理信息',
    }, {
        url: 'pluginManage/addOne',
        method: 'post',
        controllerName: 'create',
        details: '添加单个插件管理',
    }, {
        url: 'pluginManage/updateOne',
        method: 'post',
        controllerName: 'update',
        details: '更新插件管理信息',
    }, {
        url: 'pluginManage/delete',
        method: 'get',
        controllerName: 'removes',
        details: '删除插件管理',
    }, {
        url: 'pluginManage/importPlugin',
        method: 'post',
        controllerName: 'importPlugin',
        details: '插件导入',
    }],
    fontApi: [{
        url: 'pluginManage/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取插件管理列表',
    }, {
        url: 'pluginManage/getOne',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单个插件信息',
    }],

    initData: '', // 初始化数据脚本
    pluginsConfig: ` 
    exports.doraPluginManage = {\n
        enable: true,\n        package: 'egg-dora-pluginmanage',
    };\n
    `, // 插入到 plugins.js 中的配置
    defaultConfig: `
    pluginManageRouter:{\n
        match: [ctx => ctx.path.startsWith('/manage/pluginManage'), ctx => ctx.path.startsWith('/api/pluginManage')],\n
    },\n
    `, // 插入到 config.default.js 中的配置
}