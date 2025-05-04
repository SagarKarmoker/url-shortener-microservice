import amqp from 'amqplib';
import { RABBITMQ_QUEUE_NAME, RABBITMQ_URL } from './config/env.js';
import rabbitConfig from '../utils/rabbit.config.js';
import { connectDB } from './config/db.config.js';
import Analytics from './models/analytics.model.js';

// Function to process the message
async function processMessage(msg) {
    try {
        const analytics = await Analytics.create({
            shortUrlId: msg.shortUrl,
            deviceType: msg.deviceType,
            browser: msg.browser,
            location: msg.location,
            referrer: msg.referrer,
            ip: msg.ip,
        });

        if (analytics) {
            return '✅ Message processed successfully';
        } else {
            return '❌ Message not processed';
        }
    } catch (error) {
        console.error('Error processing message:', error);
        throw error;
    }
}

(async () => {
    // DB connection
    await connectDB();

    // RabbitMQ connection
    const channel = await rabbitConfig.connectRabbitMQ(amqp, RABBITMQ_URL);
    await rabbitConfig.consumeMessage(channel, RABBITMQ_QUEUE_NAME, (msg) => {
        console.log(`📩 Message received: ${msg.shortUrl}`)
        
        // Process the message
        processMessage(msg);
    });
})();