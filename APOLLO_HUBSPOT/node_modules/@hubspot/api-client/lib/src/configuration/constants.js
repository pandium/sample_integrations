"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEARCH_LIMITER_OPTIONS = exports.DEFAULT_LIMITER_OPTIONS = void 0;
exports.DEFAULT_LIMITER_OPTIONS = {
    minTime: 1000 / 9,
    maxConcurrent: 6,
    id: 'hubspot-client-limiter',
};
exports.SEARCH_LIMITER_OPTIONS = {
    minTime: 550,
    maxConcurrent: 3,
    id: 'search-hubspot-client-limiter',
};
//# sourceMappingURL=constants.js.map