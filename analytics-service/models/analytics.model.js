import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    shortUrlId: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    deviceType: {
        type: String,
    },
    browser: {
        type: String,
    },
    location: {
        type: String,
    },
    referrer: {
        type: String,
    },
    ip: {
        type: String,
    },
}, {
    timestamps: true,
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;