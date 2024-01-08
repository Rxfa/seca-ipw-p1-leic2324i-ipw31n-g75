import {siteBasePath, siteLoggedBasePath} from "./config.mjs";

export function verifyAuth(req, res, next) {
    console.log("verifyAuth", req.user)
    if(req.user)
        return next()
    res.redirect(`${siteBasePath}/login`)
}

export function setHbsGlobalVariables(req, res, next) {
    res.locals.basePath = siteBasePath
    res.locals.loggedBasePath = siteLoggedBasePath
    res.locals.loggedUser = req.user || undefined;
    next();
}