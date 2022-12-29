const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const candidateRegistrationRoute = require('./candidateRegistration.route');
const employerRegistrationRoute = require('./employerRegistration.route');
const candidateDetailsRoute = require('./candidateDetails.route');
const employerdetailsRoute = require('./employerdetails.route');
const employerCandidateSearchRoute = require('./employerCandidateSearch.route');
const createPlanRoute = require('./createPlan.route');
const planPaymentDetailsRoute = require('./planPaymentDetails.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/candidateRegistration',
    route: candidateRegistrationRoute,
  },
  {
    path: '/employerRegistration',
    route: employerRegistrationRoute,
  },
  {
    path: '/candidateDetail',
    route: candidateDetailsRoute,
  },
  {
    path: '/employerCandidateSearch',
    route: employerCandidateSearchRoute,
  },
  {
    path: '/employerdetail',
    route: employerdetailsRoute,
  },
  {
    path: '/createPlan',
    route: createPlanRoute,
  },
  {
    path: '/planPayment',
    route: planPaymentDetailsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
