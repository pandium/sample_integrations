var NextContext = /** @class */ (function () {
    function NextContext() {
        var _this = this;
        this.resources = {};
        this.updateResourceContext = function (resource, property, newPropertyValue) {
            if (!_this.resources[resource]) {
                _this.resources[resource] = {};
            }
            _this.resources[resource][property] = newPropertyValue;
        };
    }
    return NextContext;
}());
export default NextContext;
