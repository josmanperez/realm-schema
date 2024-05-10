"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogType = void 0;
var LogType;
(function (LogType) {
    LogType["trace"] = "trace";
    LogType["debug"] = "debug";
    LogType["info"] = "info";
    LogType["warn"] = "warn";
    LogType["error"] = "error";
    LogType["silent"] = "silent";
})(LogType || (exports.LogType = LogType = {}));
const levels = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    silent: 5
};
const logLevel = levels[process.env.LOG_LEVEL || 'info'];
class Logger {
    static log(level, message) {
        if (levels[level] >= logLevel) {
            console[level](message);
        }
    }
}
exports.Logger = Logger;
