const xss = require("xss");
const _ = require('lodash');

const pluginManageRule = (ctx) => {
    return {

        alias: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("别名")])
        },


        pkgName: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("包名")])
        },


        enName: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("英文名")])
        },


        name: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("名称")])
        },


        description: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("描述")])
        },


        isadm: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("有后管")])
        },


        isindex: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("有前台")])
        },


        version: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("版本号")])
        },


        iconName: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("icon")])
        },


        adminUrl: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("后台插件地址")])
        },


        adminApi: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("后台api")])
        },


        fontApi: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("前台api")])
        },


        initData: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("初始化数据")])
        },


        pluginsConfig: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("插件配置")])
        },


        defaultConfig: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("全局配置")])
        },


    }
}



let PluginManageController = {

    async list(ctx) {

        try {

            let payload = ctx.query;
            let queryObj = {};

            let pluginManageList = await ctx.service.pluginManage.find(payload, {
                query: queryObj,
            });

            ctx.helper.renderSuccess(ctx, {
                data: pluginManageList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async create(ctx) {


        try {

            let fields = ctx.request.body || {};
            let queryPluginObj = {
                $or: [{
                    alias: fields.alias
                }, {
                    pkgName: fields.pkgName,
                }, {
                    enName: fields.enName,
                }, {
                    name: fields.name,
                }],
                countryCode: fields.countryCode
            };
            let targetItem = await ctx.service.pluginManage.item(ctx, {
                query: queryPluginObj
            });

            if (!_.isEmpty(targetItem)) {
                throw new Error('插件信息重复，请修改后在提交');
            }

            const formObj = {
                alias: fields.alias,
                pkgName: fields.pkgName,
                enName: fields.enName,
                name: fields.name,
                description: fields.description,
                isadm: fields.isadm,
                isindex: fields.isindex,
                version: fields.version,
                iconName: fields.iconName,
                adminUrl: fields.adminUrl,
                adminApi: fields.adminApi,
                fontApi: fields.fontApi,
                initData: fields.initData,
                pluginsConfig: fields.pluginsConfig,
                defaultConfig: fields.defaultConfig,
                createTime: new Date()
            }


            ctx.validate(pluginManageRule(ctx), formObj);

            await ctx.service.pluginManage.create(formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    async getOne(ctx) {

        try {
            let _id = ctx.query.id;

            let targetItem = await ctx.service.pluginManage.item(ctx, {
                query: {
                    _id: _id
                }
            });

            ctx.helper.renderSuccess(ctx, {
                data: targetItem
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },


    async update(ctx) {


        try {

            let fields = ctx.request.body || {};
            const formObj = {


                alias: fields.alias,




                pkgName: fields.pkgName,




                enName: fields.enName,




                name: fields.name,




                description: fields.description,




                isadm: fields.isadm,




                isindex: fields.isindex,




                version: fields.version,




                iconName: fields.iconName,




                adminUrl: fields.adminUrl,




                adminApi: fields.adminApi,




                fontApi: fields.fontApi,




                initData: fields.initData,




                pluginsConfig: fields.pluginsConfig,




                defaultConfig: fields.defaultConfig,



                updateTime: new Date()
            }


            ctx.validate(pluginManageRule(ctx), formObj);



            await ctx.service.pluginManage.update(ctx, fields._id, formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },


    async removes(ctx) {

        try {
            let targetIds = ctx.query.ids;
            await ctx.service.pluginManage.removes(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

}

module.exports = PluginManageController;