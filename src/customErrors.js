"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileNameMustBeString = exports.PropertiesMissingParseError = exports.JsonParseError = void 0;
class JsonParseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'JsonParseError';
    }
}
exports.JsonParseError = JsonParseError;
class PropertiesMissingParseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PropertiesMissingParseError';
    }
}
exports.PropertiesMissingParseError = PropertiesMissingParseError;
class FileNameMustBeString extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileNameMustBeString';
    }
}
exports.FileNameMustBeString = FileNameMustBeString;
