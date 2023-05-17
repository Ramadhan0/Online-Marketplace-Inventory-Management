import AWS from 'aws-sdk'
import { products } from '../services/product.service'

const sns = new AWS.SNS()

const { ACCESS_KEY, SECRET_ACCESS_KEY } = process.env

interface IProduct {
    id: number,
    name: string,
    description: string,
    price: number,
    quantity: number
}

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
})

const threshold = 10

async () => {
    const allProd = await products()

    if (!allProd.length) return

    allProd.map((product: IProduct) => {
        if (product.quantity < threshold) {
            const topicArn = 'arn:aws:sns:us-east-1:000000000000:my-topic'

            const message = `Product quantity is below threshold. Current quantity: ${product.quantity}`

            const params = {
                Message: message,
                TopicArn: topicArn,
            }

            sns.publish(params, (err, data) => {
                if (err) {
                    console.error('Error sending SNS notification:', err)
                } else {
                    console.log('SNS notification sent:', data)
                }
            })
        }
    })
}
