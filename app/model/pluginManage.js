module.exports = app => {
    const mongoose = app.mongoose
    var shortid = require('shortid');
    var path = require('path');
    var Schema = mongoose.Schema;
    var moment = require('moment')

    var PluginManageSchema = new Schema({
        _id: {
            type: String,
            'default': shortid.generate
        },
        createTime: {
            type: Date,
        },
        updateTime: {
            type: Date,
        },
        alias: String, // 别名 
        pkgName: String, // 包名 
        enName: String, // 英文名 
        name: String, // 名称 
        description: String, // 描述
        amount: {
            type: Number,
            default: 0
        }, // 价格 
        isadm: {
            type: String,
            default: '1'
        }, // 有后管 
        isindex: {
            type: String,
            default: '0'
        }, // 有前台 
        version: String, // 版本号 
        iconName: String, // icon 
        adminUrl: String, // 后台插件地址 
        adminApi: [{
            type: Schema.Types.Mixed
        }], // 后台api 
        fontApi: [{
            type: Schema.Types.Mixed
        }], // 前台api 
        initData: String, // 初始化数据 
        pluginsConfig: String, // 插件配置 
        defaultConfig: String, // 全局配置 

    });

    PluginManageSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });
    PluginManageSchema.set('toObject', {
        getters: true,
        virtuals: true
    });

    PluginManageSchema.path('createTime').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });
    PluginManageSchema.path('updateTime').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });

    return mongoose.model("PluginManage", PluginManageSchema, 'pluginmanages');

}