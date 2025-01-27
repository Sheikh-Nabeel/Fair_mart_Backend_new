import { Analytics } from '../models/analytics.model.js';
import { Profile } from '../models/profile.model.js';

export const incrementProfileView = async (req, res) => {
  const { profileId } = req.body;

  try {
    let analytics = await Analytics.findOne({ profileId });

    if (!analytics) {
      analytics = new Analytics({ profileId });
    }

    analytics.views += 1; // Increment views
    analytics.history.push({ type: 'view' }); // Log the view in history
    await analytics.save();

    res.json({ message: 'Profile view incremented', data: analytics });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const incrementAppClick = async (req, res) => {
    const { profileId } = req.body;
    const { appId } = req.body; // appId must be passed in the request body
  
    try {
      let analytics = await Analytics.findOne({ profileId });
  
      if (!analytics) {
        analytics = new Analytics({ profileId });
      }
  
      analytics.clicks += 1; // Increment total clicks
      analytics.appClicks.set(appId, (analytics.appClicks.get(appId) || 0) + 1); // Increment app-specific clicks
      analytics.history.push({ type: 'click', appId }); // Log the click in history
      await analytics.save();
  
      res.json({ message: 'App click incremented', data: analytics });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  export const getLast24HoursAnalytics = async (req, res) => {
    const { profileId } = req.body;
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
    try {
      const analytics = await Analytics.findOne({ profileId });
  
      if (!analytics) {
        return res.status(404).json({ message: 'No analytics found for this profile' });
      }
  
      const history = analytics.history.filter((entry) => entry.timestamp >= last24Hours);
  
      const views = history.filter((entry) => entry.type === 'view').length;
      const clicks = history.filter((entry) => entry.type === 'click').length;
      const clickRate = views ? ((clicks / views) * 100).toFixed(2) : '0';
  
      res.json({ views, clicks, clickRate });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  export const getAnalyticsByPeriod = async (req, res) => {
    const { profileId } = req.body;
    const { period } = req.body;
  
    let startDate;
    const now = new Date();
  
    if (period === 'week') startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    else if (period === 'month') startDate = new Date(now.setMonth(now.getMonth() - 1));
    else if (period === 'year') startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    else return res.status(400).json({ message: 'Invalid period specified' });
  
    try {
      const analytics = await Analytics.findOne({ profileId });
  
      if (!analytics) {
        return res.status(404).json({ message: 'No analytics found for this profile' });
      }
  
      const history = analytics.history.filter((entry) => entry.timestamp >= startDate);
  
      const views = history.filter((entry) => entry.type === 'view').length;
      const clicks = history.filter((entry) => entry.type === 'click').length;
      const clickRate = views ? ((clicks / views) * 100).toFixed(2) : '0';
  
      res.json({ period, views, clicks, clickRate });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  export const getAppClicks = async (req, res) => {
    const { profileId } = req.body;
    const { appId } = req.body;
  
    try {
      const analytics = await Analytics.findOne({ profileId });
  
      if (!analytics) {
        return res.status(404).json({ message: 'No analytics found for this profile' });
      }
  
      const appClicks = analytics.appClicks.get(appId) || 0;
  
      res.json({ appId, clicks: appClicks });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  export const getAllAppsClicks = async (req, res) => {
    const { profileId } = req.body;
  
    try {
      // Fetch analytics data for the given profileId
      const analytics = await Analytics.findOne({ profileId });
      if (!analytics) {
        return res.status(404).json({ message: 'No analytics found for this profile' });
      }
  
      // Fetch the profile to get app names
      const profile = await Profile.findById(profileId);
      if (!profile) {
        return res.status(404).json({ message: 'No profile found for this ID' });
      }
  
      // Map app clicks to include app names from the profile
      const appClicks = Array.from(analytics.appClicks || []).map(([appId, clicks]) => {
        const app = profile.apps.find(app => app._id.toString() === appId);
        return {
          appId,
          appName: app ? app.name : 'Unknown App',
          clicks,
        };
      });
  
      res.json({ data: appClicks });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  