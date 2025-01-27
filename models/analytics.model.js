import mongoose, { Schema } from 'mongoose';

// Define Analytics Schema
const analyticsSchema = new Schema(
  {
    profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    appClicks: {
      type: Map,
      of: Number, // Tracks clicks per app ID (key: appId, value: click count)
      default: {},
    },
    history: [
      {
        type: {
          type: String, // "view" or "click"
          enum: ['view', 'click'],
          required: true,
        },
        timestamp: { type: Date, default: Date.now },
        appId: { type: String, default: null }, // Tracks app ID if the click is on an app
      },
    ],
  },
  { timestamps: true }
);

// Virtual field for calculating click rate
analyticsSchema.virtual('clickRate').get(function () {
  return this.views ? ((this.clicks / this.views) * 100).toFixed(2) : '0';
});

export const Analytics = mongoose.model('Analytics', analyticsSchema);
