import fs from 'fs'
import AWS from 'aws-sdk'

export const handler = async () => {
    const sqs = new AWS.SQS({
        endpoint: process.env.LOCALSTACK_ENDPOINT,
        region: 'us-east-1',
    });

    const queueUrl = process.env.SQS_QUEUE_URL;

    const params = {
        QueueUrl: queueUrl as string,
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 30,
        WaitTimeSeconds: 0,
    };

    try {
        const data = await sqs.receiveMessage(params).promise();

        if (data.Messages) {
            data.Messages.forEach((message) => {
                console.log('Received message:', message.Body);

                fs.appendFile('/tmp/sqs-log.txt', `${message}`, (err) => {
                    if (err) {
                        console.error('Error writing to file:', err);
                    } else {
                        console.log('SQS messages logged to file:');
                    }
                });
            });
        }

        return {
            statusCode: 200,
            body: 'SQS messages consumed and logged.',
        };
    } catch (error) {
        console.error('Error receiving SQS messages:', error);
        return {
            statusCode: 500,
            body: 'Error receiving SQS messages.',
        };
    }
};
