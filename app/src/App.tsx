import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Home from "./pages/home";
import Auth from "./pages/auth";
import NotFound from "./pages/notFound";
import HomeLayout from "./layout/home";
import ProtectedRoute from "./components/protectedRoute";
import DashBoardLayout from "./layout/dashboard";
import DashBoard from "./pages/dashboard";
import Construction from "./components/construction";
import PaymentConfirmation from "./components/booking/paymentConfirmation";
import Home from "./pages/home";
import Subscriptions from "./pages/subscriptions";
import BookSubscription from "./components/booking";
import Settings from "./pages/settings";
import Invoices from "./pages/invoices";
import Users from "./pages/users"
import UserDetails from "./components/users/details";
import EmployeeDetails from "./components/employees/details";
import Employees from "./pages/employees";
import MeetingRoom from "./pages/meetingRoom";
import PricingPolicy from "./components/Home/PricingPolicy";
import ShippingPolicy from "./components/Home/ShippingPolicy";
import TermsConditions from "./components/Home/TermsConditions";
import PrivacyPolicy from "./components/Home/PrivacyPolicy";
import RefundPolicy from "./components/Home/RefundPolicy";
import Documents from "./pages/documents";
import SubscriptionMeetingRoom from "./components/meetingRoom/meetingRoom";
import Reminders from "./pages/reminders";
import AdvanceHistory from "./components/settings/securityDepositHistory";
import InvoiceDemo from "./pages/invoiceDemo";
import InvoiceGenerator from "./pages/invoiceGenerator";
import ChatPage from "./pages/ChatPage";
import AuthCallback from "./components/auth/authCallback";
const App = () => {
    return (
        <Router>
            <Routes>

                <Route path="/chat" element={<ChatPage />} />

                {/* Public Routes */}
                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<Home />} />
                    <Route path="auth" element={<Auth />} />
                    <Route path="notFound" element={<NotFound />} />
                    <Route path="/pricing-policy" element={<PricingPolicy />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsConditions />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/cancellation-refund-policy" element={<RefundPolicy />} />
                    {/* <Route path="/receipt-demo" element={<Receipt receiptDetails={"hello"} type={"hi"} />} /> */}
                    {/* <Route path="/invoice-demo" element={<InvoiceDemo invoiceDetails={"hello"} buttonContent={"hello"} />} /> */}
                </Route>
                <Route path="auth/callback" element={<AuthCallback />} />

                {/* Private Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashBoardLayout />}>
                        <Route path="/dashboard">
                            <Route index element={<DashBoard />} />
                            <Route path="advanceHistory" element={<AdvanceHistory />} />
                        </Route>
                        <Route path="/users">
                            <Route index element={<Users />} />
                            <Route path=":userName" element={<UserDetails />} />
                        </Route>
                        <Route path="/employees">
                            <Route index element={<Employees />} />
                            <Route path=":userName" element={<EmployeeDetails />} />
                        </Route>
                        <Route path="invoices" element={<Invoices />} />
                        <Route path="invoice-generator" element={<InvoiceGenerator />} />
                        <Route path="invoice-demo" element={<InvoiceDemo />} />
                        <Route path="documents" element={<Documents />} />
                        <Route path="meetingRoom" element={<SubscriptionMeetingRoom />} />
                        <Route path="/subscriptions">
                            <Route index element={<Subscriptions />} />
                            <Route path="book" element={<BookSubscription />} />
                            <Route path="book/confirmation" element={<PaymentConfirmation />} />
                        </Route>
                        <Route path="reminders" element={<Reminders />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Route>

                {/* Unknown routes nagivated to not-found */}
                <Route path="*" element={<Navigate to="/notFound" />} />
            </Routes>
        </Router>
    )
}

export default App