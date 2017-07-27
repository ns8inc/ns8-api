import utils = require("ns8-utils");
import restify = require('restify');
import _client = require('./client');
import _sessionStore = require('./admin/sessionStore');
import _errors = require('./errors');
import _applications = require('./admin/applications');
import _users = require('./admin/users');
import _accounts = require('./admin/accounts');
import _projects = require('./admin/projects');
import _reporting = require('./reporting');

import _REST = require('./REST');

let settings = utils.config.settings();

export let client: restify.Client = _client;
export let sessionStore = _sessionStore;
export let errors = _errors;
export let users = _users;
export let accounts = _accounts;
export let applications = _applications;
export let projects = _projects;
export let reporting = _reporting;

export let logs = require('./admin/logs');
export let logger = require('./admin/logger');
export let login = require('./admin/login');
export let signup = require('./admin/signup');

export let REST = require('./REST');

export class Authorization {
    accessToken: string;
    adminMode: boolean;
    user: _users.User;
    expiration: Date;
    account: _accounts.Account;
    projects: Array<_projects.Project>;
    projectId: number;
    currentProjectId: number;
}

/**
 * Log an error to the api host.
 * @param a1
 * @param a2
 * @param a3
 * @param a4
 * @param a5
 */
export function log(a1, a2, a3, a4, a5) {
    logs.log(a1, a2, a3, a4, a5);
}

/**
 * For requests from a web session, return a restify JSON client with the authorization of the session added.
 * @param req
 * @returns {Client}
 */
export function sessionClient(req): restify.Client {
    let clientParams: any = {
        url: utils.config.settings()['apiUrl'],
        version: '*'
    };

    //  For authenticated sessions, add the access token to the header.  This uses the bearer token method as described in https://tools.ietf.org/html/rfc6750.
    //  rfc6750 does not require OAuth2 for this method, but this allows for future OAuth2 implementations to use the same strategy.
    if (req.session && req.session.accessToken) {
        clientParams.headers = {
            Authorization: 'Bearer ' + req.session.accessToken
        };
    }

    return restify.createJsonClient(clientParams);
}

/**
 * Authorize an access token and return user data.
 * @param params
 * @param callback
 */
export function authorize(params: any, callback: (err?: _errors.APIError, result?: Authorization) => void) {

    try {

        client.post('/v1/authorize', params, function(err, req: restify.Request, res: restify.Response, result: any) {

            if (err)                                //  first, check for an exception
                callback(err);
            else if (!result)                       //  then check for a missing result
                callback(new errors.APIError());
            else
                callback(null, result.data);        //  finally, return the payload
        });
    } catch(err) {
        callback(err);
    }
}

/**
 * Set the authorization information on the session.
 * @param req
 * @param auth
 */
export function setSessionAuth(req, auth: Authorization) {
    req.session.accessToken = auth.accessToken;
    req.session.adminMode = auth.adminMode;
    req.session.user = auth.user;
    req.session.expiration = auth.expiration;
    req.session.account = auth.account;
    req.session.projects = auth.projects;
    req.session.projectId = auth.projectId;
    req.session.currentProjectId = auth.currentProjectId;
}

/**
 * Clear all authorization attributes from the session
 * @param req
 */
export function clearSessionAuth(req) {
    delete req.session.accessToken;
    delete req.session.adminMode;
    delete req.session.user;
    delete req.session.expiration;
    delete req.session.account;
    delete req.session.projects;
    delete req.session.projectId;
    delete req.session.currentProjectId;
}

/**
 * If the user is authenticated in the session, call next() to call the next request handler.
 * If the user is not authenticated, redirect to the login page.
 * @param req
 * @param res
 * @param next
 * @returns {any}
 */
export function authenticate(req, res, next) {
    //
    let accessToken, noRedirect = req['noRedirect'], reauthenticate = req['reauthenticate'];
    delete req['noRedirect'];
    delete req['reauthenticate'];

    //  look for an access token override on the query string or a request to reauthenticate
    if ((req.query && req.query.accessToken) || (reauthenticate && req.session && req.session.accessToken)) {

        if (req.query && req.query.accessToken)
            accessToken = req.query.accessToken;
        else
            accessToken = req.session.accessToken;

        let authParams = {
            accessToken: accessToken,
            noCache: true
        };

        if (settings.hasOwnProperty('appId'))
            authParams['appId'] = +settings.appId;

        authorize(authParams, function(err, authObject) {

            if (!err && authObject) {
                setSessionAuth(req, authObject);
                return next();
            } else {

                if (!noRedirect)
                    res.redirect('/login');
                else
                    return next();
            }
        });
    } else if (req.session.accessToken) {
        return next();
    } else {

        if (!noRedirect)
            res.redirect('/login');
        else
            return next();
    }
}

/**
 * Authenticate a user, but if not valid, do not redirect to the login page.
 * @param req
 * @param res
 * @param next
 * @returns {any|any}
 */
export function authenticateNoRedirect(req, res, next) {
    req['noRedirect'] = true;
    return authenticate(req, res, next);
}

/**
 * Authenticate, but reload the authorization even if it is present.
 * @param req
 * @param res
 * @param next
 * @returns {any|any}
 */
export function reauthenticate(req, res, next) {
    req['reauthenticate'] = true;
    return authenticate(req, res, next);
}

/**
 * Clear authorization from session and redirect to the login page.
 * @param req
 * @param res
 */
export function logout(req, res) {

    if (req.session) {

        req.session.destroy(function(err) {
            res.redirect('/login');
        });
    }
}

/**
 * Generates unique machine id.  This can be used for signing cookies.
 * @returns {string}
 */
export function machineId(): string {

    try {

        let nis = require("os").networkInterfaces();

        //  if no network interfaces, return hostname
        if (!nis)
            return require("os").hostname();

        for (let iface in nis) {

            if (nis.hasOwnProperty(iface)) {

                if (utils.isArray(nis[iface])) {

                    for (let i = 0; i < nis[iface].length; i++) {

                        if (nis[iface][i].mac && nis[iface][i].mac != '00:00:00:00:00:00') {
                            return nis[iface][i].mac;
                        }
                    }
                }
            }
        }

        //  if can't find a mac address, fall back to the hostname
        return require("os").hostname();
    } catch(err) {

        //  on an error, fallback to hostname
        return require("os").hostname();
    }
}

/**
 * Return a project object based on an id.
 * @param req
 * @param id
 * @returns {any}
 */
export function getProject(req, id) {

    if (!req || !req.session || !req.session.accessToken)
        return null;

    let ret, projects = req.session.projects;

    if (projects && id) {

        projects.forEach(function(item) {
            if (item.id == +id)
                ret = item;
        });
    }

    return ret || null;
}

/**
 * Return the current active project's object or NULL if one is not selected.
 * @param req
 * @returns {any}
 */
export function currentProject(req) {

    if (!req || !req.session || !req.session.accessToken)
        return null;

    let ret, projects = req.session.projects, id = req.session.currentProjectId;

    if (projects && id) {

        projects.forEach(function(item) {
            if (item.id == +id)
                ret = item;
        });
    }

    if (!ret && req.session.projects && req.session.projects.length > 0)
        ret = req.session.projects[0];
    
    return ret || null;
}

/**
 * Check that an auth has a specific permission for an app - this applies mainly to ops and admin functions.
 * @param req
 * @returns {boolean}
 */
export function isSysAdmin(req): boolean {
    return hasAdminPermission(req, 'admin');
}

/**
 * Check that an auth has a specific permission for an app - this applies mainly to ops and admin functions.
 * @param req
 * @param permission
 * @returns {boolean}
 */
export function hasAdminPermission(req, permission: string): boolean {

    try {

        //  A permission is granted if:
        //  1)  The user has been assigned admin permission
        //  2)  The user has been assigned the specific permission
        if (!req || !req.session || !req.session.user || !req.session.user.permissions)
            return false;

        let user = req.session.user;

        if (user.appId != 1)
            return false;
        
        for (let p = 0; p < user.permissions.length; p++) {

            //  Check for a specific permission - for admin checks DO NOT check for owner status
            if (user.permissions[p] == 'admin' || user.permissions[p] == permission)
                return true;
        }

        return false;
    } catch (err) {
         return false;
    }
}