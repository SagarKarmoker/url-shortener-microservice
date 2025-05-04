import express from 'express';
import { connectDB } from './config/db.config.js';
import { RABBITMQ_QUEUE_NAME, RABBITMQ_URL, URL_SERVICE_PORT } from './config/env.js';
import { generateShortUrl } from './utils/urlShort.js';
import Url from './models/url.model.js';
import rabbitConfig from '../utils/rabbit.config.js';
import amqp from 'amqplib';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

// connection to MongoDB
connectDB()

// routes
app.post('/api/v1/create', async (req, res) => {
    try {
        const { longUrl } = req.body;

        // validate long url
        if (!longUrl) return res.status(400).json({
            sucess: false,
            message: 'Long URL is required'
        })

        // validate long url using regex
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

        if (!urlRegex.test(longUrl)) return res.status(400).json({
            sucess: false,
            message: 'Invalid URL'
        })

        // check if long url is already in database
        const existingUrl = await Url.findOne({ longUrl });

        if (existingUrl) return res.status(200).json({
            sucess: true,
            message: 'URL already exists',
            data: existingUrl
        })

        // generate short url
        const shortUrl = generateShortUrl();

        // save long and short url to database

        const url = await Url.create({
            longUrl,
            shortUrl,
            urlCode: shortUrl, 
            createdBy: req.ip
        });

        if (!url) return res.status(500).json({
            sucess: false,
            message: 'Something went wrong'
        })

        // if url is created successfully, send response
        res.status(201).json({
            sucess: true,
            message: 'URL created successfully',
            data: url
        });

    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message
        });
    }
})

app.get('/api/v1/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        // find long url from database
        const url = await Url.findOne({ shortUrl });

        if (!url) return res.status(404).json({
            sucess: false,
            message: 'URL not found'
        })

        // if url found and hit count and notify the analytics service
        url.hitCount++;
        await url.save();

        // notify analytics service
        // send message to rabbitmq queue
        const channel = await rabbitConfig.connectRabbitMQ(amqp, RABBITMQ_URL);

        const message = {
            longUrl: url.longUrl,
            shortUrl: url.shortUrl,
            hitCount: url.hitCount,
            ip: req.ip
        }
        await rabbitConfig.publishMessage(channel, RABBITMQ_QUEUE_NAME, message)

        // if url is found, redirect to long url
        res.status(301).json({
            sucess: true,
            message: 'URL found',
            data: url.longUrl
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message
        });
    }
})

app.get('/api/v1/get-all-urls', async (req, res) => {
    try {
        const urls = await Url.find();
        console.log(urls);

        res.status(200).json({
            success: true,
            message: 'URLs found',
            data: urls
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.listen(URL_SERVICE_PORT, () => {
    console.log(`URL Service is running on port ${URL_SERVICE_PORT}`);
});