interface iPaymuConfig {
  va: string;
  secret: string;
  baseUrl: string;
}

interface PaymentData {
  product: string[];
  qty: string[];
  price: string[];
  weight: string[];
  width: string[];
  height: string[];
  length: string[];
  deliveryArea: string;
  deliveryAddress: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  referenceId: string;
  paymentMethod?: string;
  paymentChannel?: string;
}

export class iPaymuService {
  private config: iPaymuConfig;

  constructor() {
    this.config = {
      va: process.env.IPAYMU_VA || '',
      secret: process.env.IPAYMU_SECRET || '',
      baseUrl: process.env.IPAYMU_BASE_URL || 'https://sandbox.ipaymu.com/api/v2'
    };
  }

  private generateSignature(data: any, timestamp: number): string {
    const crypto = require('crypto');
    const stringToSign = 'POST' + this.config.va + JSON.stringify(data) + timestamp;
    return crypto.createHmac('sha256', this.config.secret).update(stringToSign).digest('hex');
  }

  async createPayment(data: PaymentData) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = this.generateSignature(data, timestamp);

      const response = await fetch(`${this.config.baseUrl}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'va': this.config.va,
          'signature': signature,
          'timestamp': timestamp.toString()
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.Message || 'Payment creation failed');
      }

      return {
        success: true,
        data: result.Data,
        sessionId: result.Data?.SessionID,
        paymentUrl: result.Data?.Url
      };

    } catch (error) {
      console.error('iPaymu payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async checkPaymentStatus(sessionId: string) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const data = { sessionId };
      const signature = this.generateSignature(data, timestamp);

      const response = await fetch(`${this.config.baseUrl}/payment/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'va': this.config.va,
          'signature': signature,
          'timestamp': timestamp.toString()
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.Message || 'Failed to check payment status');
      }

      return {
        success: true,
        status: result.Data?.Status,
        data: result.Data
      };

    } catch (error) {
      console.error('iPaymu status check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}