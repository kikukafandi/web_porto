/**
 * OY! Indonesia Payment Callback/Webhook Handler
 * POST /api/payments/oy/callback - Handle payment notifications from OY!
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyCallback } from '@/lib/oyService';
import { sendEmail, generateInvoiceEmail, sendAdminNotification } from '@/lib/mailer';

// POST /api/payments/oy/callback
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log('OY! Callback received:', JSON.stringify(payload, null, 2));

    // Log the callback for debugging and audit trail
    await prisma.callbackLog.create({
      data: { payload },
    });

    // Verify callback authenticity
    if (!verifyCallback(payload)) {
      console.error('Invalid callback signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Extract transaction ID from payload
    const transactionId = payload.partner_tx_id || payload.tx_ref_number;
    
    if (!transactionId) {
      console.error('No transaction ID in callback');
      return NextResponse.json(
        { error: 'Missing transaction ID' },
        { status: 400 }
      );
    }

    // Find transaction
    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { id: transactionId },
          { oyInvoiceId: transactionId },
        ],
      },
      include: {
        product: true,
      },
    });

    if (!transaction) {
      console.error('Transaction not found:', transactionId);
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Check if already processed (idempotency)
    if (transaction.status === 'PAID') {
      console.log('Transaction already marked as PAID, skipping');
      return NextResponse.json({ message: 'Already processed' });
    }

    // Determine payment status
    const paymentStatus = payload.status || payload.settlement_status;
    const isSuccess = paymentStatus === 'success' || 
                     paymentStatus === 'SUCCESS' || 
                     paymentStatus === 'COMPLETE' ||
                     paymentStatus === 'complete';

    const newStatus = isSuccess ? 'PAID' : 'FAILED';

    // Update transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: newStatus,
        paymentMethod: payload.payment_method || null,
        callbackPayload: payload,
      },
    });

    // If payment successful, send emails
    if (newStatus === 'PAID') {
      console.log('Payment successful, sending emails...');

      // Generate secure download link
      // In production, this should be a signed token or one-time link
      const downloadUrl = `${process.env.NEXTAUTH_URL}/download/${transaction.id}`;

      // Send invoice and download link to buyer
      const emailSent = await sendEmail({
        to: transaction.buyerEmail,
        subject: `Your Purchase: ${transaction.product.title}`,
        html: generateInvoiceEmail(
          transaction.buyerEmail,
          transaction.buyerName,
          transaction.product.title,
          transaction.price,
          downloadUrl
        ),
      });

      if (emailSent) {
        console.log('Invoice email sent to buyer');
      } else {
        console.error('Failed to send invoice email');
      }

      // Send notification to admin
      await sendAdminNotification(
        transaction.product.title,
        transaction.buyerEmail,
        transaction.price
      );

      console.log('Admin notification sent');
    }

    return NextResponse.json({ 
      message: 'Callback processed successfully',
      status: newStatus,
    });
  } catch (error) {
    console.error('Error processing OY! callback:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
}

// GET method for testing/debugging
export async function GET() {
  return NextResponse.json({ 
    message: 'OY! Callback endpoint is active',
    time: new Date().toISOString(),
  });
}
