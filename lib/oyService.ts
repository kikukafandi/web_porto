/**
 * OY! Indonesia Payment Gateway Service
 * Handles payment creation and callback verification
 */

import axios from 'axios';

const OY_API_KEY = process.env.OY_API_KEY || '';
const OY_BASE_URL = process.env.OY_BASE_URL || 'https://api-stg.oyindonesia.com';
const OY_CALLBACK_SECRET = process.env.OY_CALLBACK_SECRET || '';

interface CreatePaymentParams {
  amount: number;
  buyerEmail: string;
  callbackUrl: string;
  description: string;
  partnerTxId?: string;
}

interface CreatePaymentResponse {
  status: {
    code: string;
    message: string;
  };
  payment_link_id: string;
  payment_link_url: string;
  invoice_id?: string;
}

interface OYCallbackPayload {
  partner_tx_id?: string;
  tx_ref_number?: string;
  amount?: number;
  status?: string;
  settlement_status?: string;
  payment_method?: string;
  [key: string]: unknown;
}

/**
 * Create a payment request with OY! Indonesia
 * Returns payment link and invoice ID
 */
export async function createPayment(params: CreatePaymentParams): Promise<CreatePaymentResponse> {
  try {
    const response = await axios.post(
      `${OY_BASE_URL}/api/payment-checkout/create-v2`,
      {
        partner_tx_id: params.partnerTxId || `TX-${Date.now()}`,
        description: params.description,
        notes: params.description,
        sender_name: params.buyerEmail,
        amount: params.amount,
        email: params.buyerEmail,
        phone_number: '',
        is_open: false,
        step: 'input-amount',
        include_admin_fee: false,
        list_disabled_payment_methods: '',
        list_enabled_banks: '',
        expiration: 24 * 60, // 24 hours in minutes
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Oy-Username': OY_API_KEY,
          'X-Api-Key': OY_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('OY! Payment creation error:', error);
    throw new Error('Failed to create payment');
  }
}

/**
 * Verify OY! callback authenticity
 * In production, verify signature or IP whitelist
 */
export function verifyCallback(payload: OYCallbackPayload): boolean {
  // In sandbox/development, we accept all callbacks
  // In production, implement proper signature verification
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement proper signature verification
    // Check X-OY-Signature header against calculated hash
    return true;
  }
  return true;
}

/**
 * Check payment status with OY! API
 */
export async function checkPaymentStatus(invoiceId: string): Promise<OYCallbackPayload> {
  try {
    const response = await axios.get(
      `${OY_BASE_URL}/api/payment-checkout/status`,
      {
        params: { partner_tx_id: invoiceId },
        headers: {
          'X-Oy-Username': OY_API_KEY,
          'X-Api-Key': OY_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('OY! Status check error:', error);
    throw new Error('Failed to check payment status');
  }
}
