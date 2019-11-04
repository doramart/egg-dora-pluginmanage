const path = require("path");
const _ = require('lodash');
const fs = require('fs');
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')

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


        // adminApi: {
        //     type: "string",
        //     required: true,
        //     message: ctx.__("validate_error_field", [ctx.__("后台api")])
        // },


        // fontApi: {
        //     type: "string",
        //     required: true,
        //     message: ctx.__("validate_error_field", [ctx.__("前台api")])
        // },


        // initData: {
        //     type: "string",
        //     required: true,
        //     message: ctx.__("validate_error_field", [ctx.__("初始化数据")])
        // },


        // pluginsConfig: {
        //     type: "string",
        //     required: true,
        //     message: ctx.__("validate_error_field", [ctx.__("插件配置")])
        // },


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

            if (fields.amount) {
                let amount = parseFloat(fields.amount);
                if (isNaN(amount) || amount <= 0) {
                    throw new Error("金额输入错误.");
                } else {
                    fields.amount = amount.toFixed(2);
                }
            }

            const formObj = {
                alias: fields.alias,
                pkgName: fields.pkgName,
                enName: fields.enName,
                name: fields.name,
                description: fields.description,
                amount: fields.amount,
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
                amount: fields.amount,
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

    // 导入配置
    async importPlugin(ctx, app) {

        try {
            // console.log('--this.app.config--', this.app.config)
            //存放目录
            let updatePath = `${app.config.upload_path}/upload/plugins/`;

            const stream = await ctx.getFileStream()
            // 所有表单字段都能通过 `stream.fields` 获取到
            const filename = path.basename(stream.filename) // 文件名称
            const extname = path.extname(stream.filename).toLowerCase() // 文件扩展名称
            // 组装参数 model
            let ms = (new Date()).getTime().toString() + extname;
            const attachment = {};
            attachment.extname = extname || 'hello'
            attachment.filename = filename
            // 组装参数 stream
            const target = path.join(updatePath, `${ms}`)
            const writeStream = fs.createWriteStream(target)
            // 文件处理，上传到云存储等等
            try {
                await awaitWriteStream(stream.pipe(writeStream))
            } catch (err) {
                // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
                await sendToWormhole(stream)
                throw err
            }

            if (fs.existsSync(target)) {
                let pluginInfo = require(target);
                if (!_.isEmpty(pluginInfo)) {
                    let pluginKeys = Object.keys(pluginInfo);
                    let targetPluginInfo = pluginInfo[pluginKeys[0]];
                    targetPluginInfo.createTime = new Date();
                    // 校验插件数据是否重复
                    let fields = targetPluginInfo;
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

                    await ctx.service.pluginManage.create(targetPluginInfo);
                }
            }

            ctx.helper.renderSuccess(ctx);
        } catch (error) {
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }
    }


}

module.exports = PluginManageController;