import AWS from 'aws-sdk'

AWS.config.update({ region: 'us-east-1' });

const sqs = new AWS.SQS();

const sendMessageToSQSQueue = async (message: string) => {
    const params = {
        MessageBody: JSON.stringify(message),
        QueueUrl: 'http://localhost:4566/000000000000/sqs-queue',
    };

    try {
        const result = await sqs.sendMessage(params).promise();
        console.log('Message sent:', result.MessageId);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

export default sendMessageToSQSQueue
