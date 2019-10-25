const _ = require('lodash');
const pluginManageAdminController = require('../controller/manage/pluginManage')
const pluginManageApiController = require('../controller/api/pluginManage')

module.exports = (options, app) => {

    return async function pluginManageRouter(ctx, next) {

        let pluginConfig = app.config.doraPluginManage;
        await app.initPluginRouter(ctx, pluginConfig, pluginManageAdminController, pluginManageApiController);
        await next();

    }

}