"use strict";
exports.__esModule = true;
exports.CLIENT = void 0;
var config_1 = require("./config");
var web_api_1 = require("@slack/web-api");
var retry_policies_1 = require("@slack/web-api/dist/retry-policies");
exports.CLIENT = new web_api_1.WebClient(config_1.CONFIG.botToken, {
    retryConfig: retry_policies_1.tenRetriesInAboutThirtyMinutes
});
