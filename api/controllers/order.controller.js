import createError from "../utils/createError.js";
import { prisma } from "../config/database.js";
import Stripe from "stripe";

// Intent to create a payment and order
export const intent = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE);

    const gig = await prisma.gig.findUnique({
      where: { id: req.params.id }
    });

    if (!gig) {
      return next(createError(404, "Gig not found!"));
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const newOrder = await prisma.order.create({
      data: {
        gigId: gig.id,
        img: gig.cover,
        title: gig.title,
        buyerId: req.userId,
        sellerId: gig.userId,
        price: gig.price,
        paymentIntent: paymentIntent.id,
        status: 'PENDING',
      }
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    next(err);
  }
};

// Get the orders the user has placed (My Orders)
export const getMyOrders = async (req, res, next) => {
  try {
    const myOrders = await prisma.order.findMany({
      where: {
        buyerId: req.userId,
        isCompleted: true,
      },
      include: {
        buyer: {
          select: {
            id: true,
            username: true,
            img: true,
          }
        },
        seller: {
          select: {
            id: true,
            username: true,
            img: true,
          }
        },
        gig: {
          select: {
            id: true,
            title: true,
            cover: true,
            price: true,
          }
        }
      }
    });

    res.status(200).send(myOrders);
  } catch (err) {
    next(err);
  }
};

// Get the orders the user has received (Received Orders for Sellers)
export const getReceivedOrders = async (req, res, next) => {
  try {
    // Ensure the user is a seller
    if (!req.isSeller) {
      return next(
        createError(403, "You are not authorized to view received orders.")
      );
    }

    const receivedOrders = await prisma.order.findMany({
      where: {
        sellerId: req.userId,
        isCompleted: true,
      },
      include: {
        buyer: {
          select: {
            id: true,
            username: true,
            img: true,
          }
        },
        seller: {
          select: {
            id: true,
            username: true,
            img: true,
          }
        },
        gig: {
          select: {
            id: true,
            title: true,
            cover: true,
            price: true,
          }
        }
      }
    });

    res.status(200).send(receivedOrders);
  } catch (err) {
    next(err);
  }
};

// Confirm the order after payment
export const confirm = async (req, res, next) => {
  try {
    const order = await prisma.order.updateMany({
      where: { 
        paymentIntent: req.body.payment_intent 
      },
      data: { 
        isCompleted: true,
        status: 'COMPLETED'
      }
    });

    if (order.count === 0) {
      return next(createError(404, "Order not found"));
    }

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};

// Update the status of an order (e.g., from "PENDING" to "COMPLETED")
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the provided status
    if (!["PENDING", "COMPLETED"].includes(status)) {
      return next(createError(400, "Invalid status value"));
    }

    // Find the order by ID
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return next(createError(404, "Order not found"));
    }

    console.log(order.sellerId, req.userId);

    // Ensure the seller is authorized to update the status
    if (req.isSeller && order.sellerId !== req.userId) {
      return next(
        createError(403, "You are not authorized to update this order")
      );
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status,
        isCompleted: status === 'COMPLETED'
      }
    });

    res.status(200).send("Order status updated successfully");
  } catch (err) {
    next(err);
  }
};
