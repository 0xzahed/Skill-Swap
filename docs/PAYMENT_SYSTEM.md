# Payment System Integration Guide

**Document Version:** 1.0  
**Date:** November 26, 2025  
**Phase:** 2 - Core Features

---

## Table of Contents

1. [Stripe Setup](#stripe-setup)
2. [Payment Flow](#payment-flow)
3. [Implementation](#implementation)
4. [Refund System](#refund-system)
5. [Security](#security)

---

## Stripe Setup

### **Step 1: Create Stripe Account**

1. Visit https://stripe.com
2. Sign up for free account
3. Get API keys from Dashboard
4. No monthly fees - only transaction fees (2.9% + $0.30)

### **Step 2: Install Stripe**

```bash
# Backend
cd backend/functions
npm install stripe

# Frontend
cd ../..
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### **Step 3: Environment Variables**

**backend/functions/.env:**

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**frontend/.env:**

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Payment Flow

### **Complete User Journey**

1. **Select Skill & Session**

   - User browses skills
   - Selects desired session
   - Views pricing details

2. **Booking Form**

   - Fill in booking details
   - Select date/time
   - Review total cost

3. **Payment Processing**

   - Redirects to secure checkout
   - Enter card details (Stripe Elements)
   - Confirm payment

4. **Confirmation**
   - Payment successful
   - Booking confirmed
   - Email receipt sent
   - Redirect to booking details

---

## Implementation

### **Backend: Payment Intent**

**File:** `backend/functions/src/routes/payments.js`

```javascript
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { verifyAuth } = require("../middleware/auth");

// Create payment intent
router.post("/create-intent", verifyAuth, async (req, res) => {
  try {
    const { amount, currency, bookingId, skillId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || "usd",
      metadata: {
        bookingId,
        skillId,
        userId: req.user.uid,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment
router.post("/confirm", verifyAuth, async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update booking with payment info
      await updateBookingPayment(bookingId, {
        paymentId: paymentIntentId,
        status: "completed",
        paidAt: new Date(),
      });

      // Send confirmation email
      await sendBookingConfirmation(bookingId);

      res.json({ success: true, booking: bookingId });
    } else {
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook for payment events
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          await handlePaymentSuccess(event.data.object);
          break;
        case "payment_intent.payment_failed":
          await handlePaymentFailure(event.data.object);
          break;
        case "charge.refunded":
          await handleRefund(event.data.object);
          break;
      }

      res.json({ received: true });
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

// Request refund
router.post("/:id/refund", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Get booking
    const booking = await getBooking(id);

    // Check if refundable (within 24 hours of session)
    if (!isRefundable(booking)) {
      return res.status(400).json({
        error: "Booking is not eligible for refund",
      });
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: booking.payment.paymentId,
      reason: "requested_by_customer",
      metadata: { bookingId: id, reason },
    });

    // Update booking
    await updateBooking(id, {
      "payment.status": "refunded",
      "payment.refundedAt": new Date(),
      "payment.refundReason": reason,
      status: "cancelled",
    });

    res.json({ success: true, refund });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### **Frontend: Checkout Component**

**File:** `src/Pages/Checkout.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ bookingData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        // Confirm payment on backend
        await api.post("/payments/confirm", {
          paymentIntentId: paymentIntent.id,
          bookingId: bookingData.bookingId,
        });

        toast.success("Payment successful! Booking confirmed.");
        navigate(`/bookings/${bookingData.bookingId}`);
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#422AD5] text-white py-3 rounded-lg font-semibold hover:bg-[#3319B0] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : `Pay $${bookingData.amount}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const data = location.state?.bookingData;
    if (!data) {
      navigate("/");
      return;
    }

    setBookingData(data);

    // Create payment intent
    api
      .post("/payments/create-intent", {
        amount: data.amount,
        currency: "usd",
        bookingId: data.bookingId,
        skillId: data.skillId,
      })
      .then((response) => {
        setClientSecret(response.data.clientSecret);
      })
      .catch((error) => {
        toast.error("Failed to initialize payment");
      });
  }, []);

  if (!clientSecret || !bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Complete Payment</h1>

          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="font-semibold mb-4">Booking Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Skill:</span>
                <span className="font-semibold">{bookingData.skillName}</span>
              </div>
              <div className="flex justify-between">
                <span>Provider:</span>
                <span>{bookingData.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{bookingData.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{bookingData.time}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-[#422AD5]">${bookingData.amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm bookingData={bookingData} />
          </Elements>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🔒 Secure payment powered by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
```

---

## Refund System

### **Refund Policy**

- **Full Refund:** Cancel 24+ hours before session
- **50% Refund:** Cancel 12-24 hours before
- **No Refund:** Cancel less than 12 hours before

### **Refund Component**

**File:** `src/Components/Bookings/RefundRequest.jsx`

```jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

const RefundRequest = ({ booking, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRefund = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    setLoading(true);

    try {
      await api.post(`/payments/${booking.id}/refund`, { reason });
      toast.success("Refund processed successfully");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || "Refund failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Request Refund</h3>

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Please explain why you want to cancel..."
        className="w-full px-4 py-2 border rounded-lg"
        rows="4"
      />

      <button
        onClick={handleRefund}
        disabled={loading}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Request Refund"}
      </button>
    </div>
  );
};

export default RefundRequest;
```

---

## Security Best Practices

### **1. Never Store Card Details**

- Use Stripe Elements (PCI compliant)
- Card data never touches your server
- Stripe handles tokenization

### **2. Verify Webhook Signatures**

```javascript
const event = stripe.webhooks.constructEvent(
  req.body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

### **3. Use Idempotency Keys**

```javascript
const paymentIntent = await stripe.paymentIntents.create(
  {
    // ...
  },
  {
    idempotencyKey: `booking-${bookingId}-${Date.now()}`,
  }
);
```

### **4. Validate Amounts on Backend**

```javascript
// Always verify amount on server
const skill = await getSkill(skillId);
if (amount !== skill.price) {
  throw new Error("Invalid amount");
}
```

### **5. Use Test Mode First**

- Test with card: 4242 4242 4242 4242
- Test different scenarios
- Enable live mode only when ready

---

**Next Document:** Proceed to `BOOKING_SYSTEM.md` for complete booking workflow.
