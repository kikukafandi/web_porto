/**
 * Admin Transactions Page
 * View-only interface for monitoring transactions
 */

import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

export default async function AdminTransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'FAILED':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Transactions</h1>

      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((transaction: any) => (
            <Card key={transaction.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {transaction.product.title}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {transaction.buyerEmail}
                    {transaction.buyerName && ` (${transaction.buyerName})`}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-white/60">Amount</p>
                  <p className="text-white font-medium">{formatPrice(transaction.price)}</p>
                </div>
                <div>
                  <p className="text-white/60">Payment Method</p>
                  <p className="text-white font-medium">{transaction.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/60">Created</p>
                  <p className="text-white font-medium">{formatDate(transaction.createdAt)}</p>
                </div>
                <div>
                  <p className="text-white/60">Invoice ID</p>
                  <p className="text-white font-medium text-xs">{transaction.oyInvoiceId || 'N/A'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-white/60">No transactions yet</p>
        </Card>
      )}
    </div>
  );
}
