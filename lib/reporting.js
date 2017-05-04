"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("ns8-utils");
const REST = require("./REST");
const index = require("./index");
const applications = require("./admin/applications");
const logger = require("./admin/logs");
let settings = utils.config.settings();
exports.entities = {};
exports.dictionaries = {};
function init(callback) {
    try {
        applications.getAll(function (err, apps) {
            if (err) {
                console.log('Error in reporting.init: ' + err.message);
                logger.log('Error in reporting.init: ', err);
                callback(err);
                return;
            }
            let app = apps[settings.appId];
            if (!app.reporting) {
                callback();
            }
            else {
                if (app.reporting.apiEndpoint.substr(app.reporting.apiEndpoint.length - 1, 1) != '/') {
                    app.reporting.apiEndpoint += '/';
                }
                REST.client.get(app.reporting.apiEndpoint + 'entities', function (err, apiRequest, apiResponse, result) {
                    if (err) {
                        logger.log('Error in getting entitites for ' + app.name, err);
                        console.log('Error in getting entitites for ' + app.name + ': ' + err.message);
                        callback(err);
                    }
                    else {
                        exports.entities = result.data;
                        REST.client.get(app.reporting.apiEndpoint + 'dictionaries', function (err, apiRequest, apiResponse, result) {
                            if (err) {
                                logger.log('Error in getting dictionaries for ' + app.name, err);
                                console.log('Error in getting dictionaries for ' + app.name + ': ' + err.message);
                                callback(err);
                            }
                            else {
                                exports.dictionaries = result.data;
                                console.log('Reporting.init successful for ' + app.name);
                                callback();
                            }
                        });
                    }
                });
            }
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.init = init;
function currentDashboards(req) {
    let project = index.currentProject(req);
    if (!project)
        return {};
    let userId = req.session.user.id;
    project.data = project.data || {};
    project.data[userId] = project.data[userId] || {};
    project.data[userId].dashboards = project.data[userId].dashboards || {};
    return project.data[userId].dashboards;
}
exports.currentDashboards = currentDashboards;
function currentBookmarks(req) {
    let project = index.currentProject(req);
    if (!project)
        return {};
    let userId = req.session.user.id;
    project.data = project.data || {};
    project.data[userId] = project.data[userId] || {};
    project.data[userId].bookmarks = project.data[userId].bookmarks || {};
    return project.data[userId].bookmarks;
}
exports.currentBookmarks = currentBookmarks;
function getCustomAttributes(req, projectId) {
    let project = index.getProject(req, projectId);
    if (!project)
        return {};
    project.data = project.data || {};
    project.data.attributes = project.data.attributes || {};
    return project.data.attributes;
}
exports.getCustomAttributes = getCustomAttributes;
exports.Operators = {
    equal: 'equal',
    not_equal: 'not_equal',
    begins_with: 'begins_with',
    not_begins_with: 'not_begins_with',
    ends_with: 'begins_with',
    not_ends_with: 'not_begins_with',
    contains: 'contains',
    not_contains: 'not_contains',
    _in: 'in',
    not_in: 'not_in',
    between: 'between',
    less: 'less',
    greater: 'greater',
    greater_or_equal: 'greater_or_equal',
    less_or_equal: 'less_or_equal',
    is_null: 'is_null',
    is_not_null: 'is_not_null'
};
class Segment {
}
exports.Segment = Segment;
exports.DataTypes = {
    string: 'string',
    integer: 'integer',
    numeric: 'numeric',
    currency: 'currency',
    percent: 'percent',
    date: 'date',
    boolean: 'boolean',
    object: 'object',
    array: 'array'
};
class Attribute {
}
exports.Attribute = Attribute;
class FilterOptions {
}
exports.FilterOptions = FilterOptions;
var AttributeTypes;
(function (AttributeTypes) {
    AttributeTypes[AttributeTypes["all"] = 0] = "all";
    AttributeTypes[AttributeTypes["metrics"] = 1] = "metrics";
    AttributeTypes[AttributeTypes["elements"] = 2] = "elements";
})(AttributeTypes = exports.AttributeTypes || (exports.AttributeTypes = {}));
function getAttributes(entityName, attributeType, isLog) {
    let attribs = [], appAttribs = exports.entities[entityName].attributes;
    for (let a = 0; a < appAttribs.length; a++) {
        let attrib = appAttribs[a];
        if (attributeType == AttributeTypes.all || (attributeType == AttributeTypes.metrics && attrib.isMetric) || (attributeType == AttributeTypes.elements && attrib.isElement)) {
            if (!isLog || attrib.logAttribute)
                attribs.push(attrib);
        }
    }
    return attribs;
}
exports.getAttributes = getAttributes;
function addAttributeView(options, entityName, attributeType, customAttribs) {
    for (let name in customAttribs[entityName]) {
        if (customAttribs[entityName].hasOwnProperty(name)) {
            let attrib = customAttribs[entityName][name];
            if ((attributeType == AttributeTypes.all) || (attributeType == AttributeTypes.elements && attrib.isElement) || (attributeType == AttributeTypes.metrics && attrib.isMetric)) {
                options.push({
                    value: entityName + '.' + name,
                    text: entityName + ': ' + name,
                    optgroup: "Custom"
                });
            }
        }
    }
}
exports.addAttributeView = addAttributeView;
function getAttributeOptions(entityName, attributeType, customAttribs, isLog) {
    let options = [], attribs = getAttributes(entityName, attributeType, isLog);
    if (customAttribs) {
        addAttributeView(options, 'session', attributeType, customAttribs);
        if (entityName == 'events') {
            addAttributeView(options, 'event', attributeType, customAttribs);
        }
        addAttributeView(options, 'person', attributeType, customAttribs);
    }
    for (let a = 0; a < attribs.length; a++) {
        let attrib = attribs[a];
        if (!isLog || attrib.logAttribute) {
            options.push({
                value: attrib.name,
                text: attrib.title,
                optgroup: "Standard"
            });
        }
    }
    return options;
}
exports.getAttributeOptions = getAttributeOptions;
function addFilterView(filterOptions, entityName, customAttribs) {
    for (let name in customAttribs[entityName]) {
        if (customAttribs[entityName].hasOwnProperty(name) && customAttribs[entityName][name].filterable) {
            let attrib = customAttribs[entityName][name];
            attrib.title = entityName + ': ' + name;
            attrib.name = entityName + '.' + name;
            filterOptions.push(getFilterOption(attrib));
        }
    }
}
exports.addFilterView = addFilterView;
function getFilterOptions(entityName, customAttribs, isLog) {
    let attrib, filterOptions = [];
    if (customAttribs) {
        addFilterView(filterOptions, 'session', customAttribs);
        if (entityName == 'events') {
            addFilterView(filterOptions, 'event', customAttribs);
        }
    }
    let appAttribs = exports.entities[entityName].attributes;
    for (let a = 0; a < appAttribs.length; a++) {
        attrib = appAttribs[a];
        if (attrib.filterable) {
            if (!isLog || attrib.logAttribute) {
                filterOptions.push(getFilterOption(attrib));
            }
        }
    }
    return filterOptions;
}
exports.getFilterOptions = getFilterOptions;
function getRuleOptions(entityName, isLog) {
    let attrib, ruleOptions = [];
    let appAttribs = exports.entities[entityName].attributes;
    for (let a = 0; a < appAttribs.length; a++) {
        attrib = appAttribs[a];
        if (attrib.rule) {
            if (!isLog || attrib.logAttribute)
                ruleOptions.push(getFilterOption(attrib));
        }
    }
    return ruleOptions;
}
exports.getRuleOptions = getRuleOptions;
function getFilterOption(attrib) {
    let filter = new FilterOptions();
    filter.id = attrib.name;
    filter.label = attrib.title || attrib.name;
    filter.description = attrib.description || attrib.name;
    if (attrib.values && attrib.values.length > 0) {
        filter.values = attrib.values;
        filter.input = 'select';
        filter.multiple = true;
    }
    if (attrib.inputFormat) {
        filter.validation = { format: attrib.inputFormat };
    }
    filter.operators = attrib.operators;
    filter.searchable = attrib.searchable;
    switch (attrib.dataType) {
        case exports.DataTypes.date:
            filter.type = attrib.dataType;
            if (!attrib.operators)
                filter.operators = [exports.Operators.equal, exports.Operators.not_equal, exports.Operators.between, exports.Operators.greater, exports.Operators.greater_or_equal, exports.Operators.less, exports.Operators.less_or_equal];
            break;
        case exports.DataTypes.string:
            filter.type = attrib.dataType;
            if (!attrib.operators)
                filter.operators = [exports.Operators.equal, exports.Operators.not_equal, exports.Operators.contains, exports.Operators.begins_with, exports.Operators.not_begins_with, exports.Operators.ends_with, exports.Operators.not_ends_with, exports.Operators.is_null, exports.Operators.is_not_null];
            break;
        case exports.DataTypes.boolean:
            filter.type = attrib.dataType;
            if (!attrib.operators)
                filter.operators = [exports.Operators.equal];
            break;
        case exports.DataTypes.integer:
            filter.type = attrib.dataType;
            if (!attrib.operators)
                filter.operators = [exports.Operators.equal, exports.Operators.not_equal, exports.Operators.greater, exports.Operators.greater_or_equal, exports.Operators.less, exports.Operators.less_or_equal, exports.Operators.between];
            break;
        case exports.DataTypes.numeric:
        case exports.DataTypes.percent:
        case exports.DataTypes.currency:
            filter.type = 'double';
            if (!attrib.operators)
                filter.operators = [exports.Operators.equal, exports.Operators.not_equal, exports.Operators.greater, exports.Operators.greater_or_equal, exports.Operators.less, exports.Operators.less_or_equal, exports.Operators.between];
            break;
    }
    if (attrib.dataType == exports.DataTypes.boolean) {
        filter.input = 'radio';
        filter.values = [true, false];
    }
    return filter;
}
exports.getFilterOption = getFilterOption;
function getSegmentOptions(req) {
    let options = [];
    for (let r = 0; r < req.session.segments.length; r++) {
        options.push({ value: req.session.segments[r].id, text: req.session.segments[r].name });
    }
    return options;
}
exports.getSegmentOptions = getSegmentOptions;
function getSegments(req, useCache, appId, callback) {
    try {
        if (useCache && req.session['segments']) {
            callback(null, req.session['segments']);
            return;
        }
        applications.getAll(function (err, apps) {
            let endpoint = apps[settings.appId].reporting.apiEndpoint;
            REST.client.get(endpoint + 'segments?accessToken=' + req.session.accessToken, function (err, apiRequest, apiResponse, result) {
                if (!err) {
                    req.session['segments'] = result.data;
                }
                else {
                    logger.log(err);
                    req.session['segments'] = [];
                }
                callback(err, result.data);
            });
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.getSegments = getSegments;
//# sourceMappingURL=reporting.js.map