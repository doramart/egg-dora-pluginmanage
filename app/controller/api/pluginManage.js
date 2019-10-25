const _ = require('lodash');


let PluginManageController = {

    async list(ctx) {

        try {

            let payload = ctx.query;
            let queryObj = {};

            let pluginManageList = await ctx.service.pluginManage.find(payload, {
                query: queryObj,
                searchKeys: ['alias', 'pkgName', 'enName', 'name']
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

}

module.exports = PluginManageController;