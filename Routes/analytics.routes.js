import express from 'express';
import {
  incrementProfileView,
  incrementAppClick,
  getLast24HoursAnalytics,
  getAnalyticsByPeriod,
  getAppClicks,
  getAllAppsClicks,
} from '../controllers/analytics.controller.js';

const router = express.Router();

router.post('/view', incrementProfileView);
router.post('/click', incrementAppClick);
router.post('/last24hours', getLast24HoursAnalytics);
router.post('/period', getAnalyticsByPeriod);
router.post('/appclicks', getAppClicks);
router.post('/getallapps',getAllAppsClicks)

export default router;
