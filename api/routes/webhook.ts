// backend/routes/webhookRoutes.ts
import crypto from 'crypto';
import { Router } from "express";
import { paymentController } from '../controllers/payment';

const router = Router();

router.post('/payments', (req, res) => {
    try {

        const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        console.log(req.headers, "request-HEADERS");
        console.log(req.body);

        console.log(digest, req.headers['x-razorpay-signature'], digest === req.headers['x-razorpay-signature'])

        if (digest === req.headers['x-razorpay-signature']) {
            const event = req.body.event;
            const payload = req.body.payload;
            console.log('Webhook verified and payload received:', payload);
            console.log('Webhook verified and event received:', payload.payment.entity.acquirer_data);
            const paymentEntity = req.body.payload.payment.entity;

            switch (event) {
                case 'order.paid':
                    const orderEntity = req.body.payload.order.entity;
                    handleOrderPaid(orderEntity, paymentEntity);
                    break;
                case 'payment.captured':
                    handlePaymentCaptured(paymentEntity);
                    break;

                case 'payment.failed':
                    handlePaymentFailed(paymentEntity);
                    break;

                case 'payment.dispute.created':
                    handleDisputeCreated(paymentEntity);
                    break;

                case 'payment.dispute.closed':
                    handleDisputeClosed(paymentEntity);
                    break;

                default:
                    console.warn(`Unhandled event type: ${event}`);
            }

            res.status(200).send('Webhook processed successfully');
        } else {
            console.error('Webhook signature verification failed');
            res.status(400).send('Invalid signature');
        }
    } catch (error: any) {
        console.error('Error processing webhook:', error.message);
        res.status(500).send('An unknown error occurred.');
    }
});


async function handleOrderPaid(orderEntity: any, paymentEntity: any) {
    try {
        console.log('Order Entity:', orderEntity);
        console.log('Payment Entity:', paymentEntity);
        paymentController.verifyPayment(orderEntity, paymentEntity);
        console.log('Payment updated successfully');
    } catch (error) {
        // Catch any errors that occur during the payment update process
        console.error('Error updating payment:', error);
        // Optionally, you can log the error or take additional actions like sending alerts
        // For example: sendErrorNotification(error);
    }
}


async function handlePaymentCaptured(paymentEntity: any) {
    try {
        console.log('Payment captured:', paymentEntity);
        console.log('Payment updated successfully');
    } catch (error) {
        // Catch any errors that occur during the payment update process
        console.error('Error updating payment:', error);
        // Optionally, you can log the error or take additional actions like sending alerts
        // For example: sendErrorNotification(error);
    }
}

async function handlePaymentFailed(paymentEntity: any) {
    try {
        console.log('Payment failed:', paymentEntity);
        paymentController.failedPayment(paymentEntity);
        console.log('Payment failure recorded successfully');
    } catch (error) {
        // Catch any errors that occur during the payment update process
        console.error('Error updating payment failure:', error);
        // Optionally, you can log the error or take additional actions like sending alerts
        // For example: sendErrorNotification(error);
    }
}

function handleDisputeCreated(payload: any) {
    console.log('Dispute created:', payload);
    // Add logic to track or respond to the dispute
}

function handleDisputeClosed(payload: any) {
    console.log('Dispute closed:', payload);
    // Add logic to resolve the dispute in your system
}
export default router;
