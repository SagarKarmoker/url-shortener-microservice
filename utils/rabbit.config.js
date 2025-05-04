const connectRabbitMQ = async (amqp, url) => {
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        console.log('✅ Connected to RabbitMQ');
        return channel;
    } catch (error) {
        console.log(error);
    }
}

const publishMessage = async (channel, queue, message) => {
    try {
        await channel.assertQueue(queue, { durable: false });
        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`📩 Message published: ${message.shortUrl}`);
    } catch (error) {
        console.log(error);
    }
}

const consumeMessage = async (channel, queue, callback) => {
    try {
        await channel.assertQueue(queue, { durable: false });
        await channel.consume(queue, (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                callback(message);
                channel.ack(msg);
            } else {
                console.log('❌ No message to consume');
            }
        },
            { noAck: false }
        )
    } catch (error) {
        console.log(error);
    }
}

export default {
    connectRabbitMQ,
    publishMessage,
    consumeMessage
}