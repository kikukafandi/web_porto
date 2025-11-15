/**
 * Checkout API Route
 * POST /api/checkout - Create transaction and OY! payment (public)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPayment } from '@/lib/oyService';
import { z } from 'zod';

const checkoutSchema = z.object({
  productId: z.string().uuid(),
  buyerEmail: z.string().email(),
  buyerName: z.string().optional().nullable(),
});

// POST /api/checkout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = checkoutSchema.parse(body);

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      );
    }

    // Create transaction with PENDING status
    const transaction = await prisma.transaction.create({
      data: {
        buyerEmail: validatedData.buyerEmail,
        buyerName: validatedData.buyerName,
        productId: product.id,
        price: product.price,
        status: 'PENDING',
      },
    });

    // Create OY! payment
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/payments/oy/callback`;
    
    const paymentResponse = await createPayment({
      amount: product.price,
      buyerEmail: validatedData.buyerEmail,
      callbackUrl,
      description: `Purchase: ${product.title}`,
      partnerTxId: transaction.id,
    });

    // Update transaction with OY! invoice ID
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        oyInvoiceId: paymentResponse.payment_link_id || paymentResponse.invoice_id,
      },
    });

    return NextResponse.json({
      transactionId: transaction.id,
      paymentUrl: paymentResponse.payment_link_url,
      invoiceId: paymentResponse.payment_link_id || paymentResponse.invoice_id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
