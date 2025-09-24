import { Button, Spinner } from '@chakra-ui/react';
import { cancelOrder, createOrder, paymentFail } from '../../api/payment';
import { useState } from 'react';
import { toaster } from "../ui/toaster";
import useServiceStore from '../../stores/services';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/users';
import useAuthStore from '../../stores/auth';
import { fetchBookingDetailsWithOrderId } from '../../api/booking';
import { useSubscriptionsStore } from '../../stores/subscription';
import { useBookingSummaryStore } from '../../stores/bookingSummary';
import logo from "../../../public/image.png";
const RazorpayPayment = ({ totalAmount, coupon }: any) => {
    const { selectedPlan, setBookingDetails, scheduleCount, durationDates, setBookingDrawer, serviceQuantity, discountByAdmin, advanceByAdmin, extendValidity } = useServiceStore();
    const { selectedSubscription } = useSubscriptionsStore();
    const { userId, userRole, setSubscriptionTab } = useUserStore();
    const { role } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { price, prorata } = useBookingSummaryStore();
    const subscripitionType = userId ? userRole === "USER" ? "INDIVIDUAL" : "COMPANY" : userRole === "USER" ? "INDIVIDUAL" : "COMPANY";
    let bookingType = extendValidity ? selectedSubscription.status === "INACTIVE" ? "RENEW_SUBSCRIPTION" : "EXTEND_SUBSCRIPTION" : "NEW_SUBSCRIPTION";
    let previousAmount = 0;
    if (extendValidity) {
        const bookingDetails = selectedSubscription?.booking;
        const previousQuantity = bookingDetails?.quantity;
        const invoice = bookingDetails.invoice;
        previousAmount = invoice?.totalAmount / previousQuantity;
    }


    const handlePayment = async () => {
        setLoading(true)
        try {
            let toastId: any;
            const data = {
                planId: selectedPlan?.id,
                coupon, scheduleCount,
                serviceQuantity,
                durationDates,
                subscripitionType,
                discountByAdmin,
                advanceByAdmin,
                bookingType,
                baseAmount: price,
                previousSubscriptionId: selectedSubscription?.id
            }
            const response = await createOrder(userId, data);
            const order = await response.data
            const orderId = order.orderId;

            // Get the computed value of --secondary-color
            const rootStyles = getComputedStyle(document.documentElement);
            const secondaryColor = rootStyles.getPropertyValue('--secondary-color').trim() || '#006198'; // Default if not found

            // Replace with your Razorpay test key
            const testKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
            const options = {
                key: testKey,
                amount: totalAmount * 100, // 50000 paise = ₹500
                currency: 'INR',
                name: 'Secure Studio',
                "order_id": orderId,
                image: logo,
                handler: async function (data: any) {
                    try {
                        toastId = toaster.create({ description: "Preparing Invoice...", type: "loading" });
                        let response = await fetchBookingDetailsWithOrderId(data?.razorpay_order_id);
                        response = await response.data;
                        setBookingDetails(response);
                        toaster.update(toastId, { description: response.message || "Fetched Invoice details", type: "success" });
                        setLoading(false);
                        setSubscriptionTab("CONFIRMATION");
                        if (role === "SUPER_ADMIN") {
                            setSubscriptionTab("CONFIRMATION");
                        } else {
                            navigate('/subscriptions/book/confirmation');
                        }
                    } catch (error: any) {
                        if (error.status === 500) {
                            toaster.update(toastId, { description: error.data.message || "Fetching Invoice failed", type: "error" });
                        }
                        setLoading(false);
                    }
                },
                prefill: {
                    name: 'Secure Studio',
                },
                theme: {
                    color: secondaryColor,
                },
                modal: {
                    ondismiss: async () => {
                        try {
                            let canceledResponse = await cancelOrder(order.bookingId);
                            toastId = toaster.create({ description: canceledResponse.message || "Order Cancelled", type: "error" });
                            setLoading(false);
                        } catch (error) {
                            toaster.update(toastId, { description: response.data.message || "Order Cancelled Failed", type: "error" });
                            setLoading(false);
                        }
                    },
                }
            }
            const rzp = new (window as any).Razorpay(options);

            rzp.on('payment.failed', async (response: any) => {
                console.log("razerpay-payment-failed", response);
                await paymentFail(order.bookingId)
            });

            rzp.open();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Button width={"50%"} flexGrow={1} disabled={loading ? true : false} opacity={loading ? 0.8 : 1} onClick={() => { setBookingDrawer(false); handlePayment() }} size="lg" mt={4}>
            {loading ? <Spinner /> : "Pay"}
        </Button>
    );
};

export default RazorpayPayment;