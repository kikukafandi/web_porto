/**
 * Admin Dashboard Page
 * Overview of system statistics
 */

import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [projectCount, blogCount, productCount, transactionStats] = await Promise.all([
    prisma.project.count(),
    prisma.blog.count(),
    prisma.product.count(),
    prisma.transaction.groupBy({
      by: ['status'],
      _count: true,
    }),
  ]);

  const pendingTransactions = transactionStats.find((s: any) => s.status === 'PENDING')?._count || 0;
  const paidTransactions = transactionStats.find((s: any) => s.status === 'PAID')?._count || 0;
  const failedTransactions = transactionStats.find((s: any) => s.status === 'FAILED')?._count || 0;

  const stats = [
    { label: 'Projects', value: projectCount, color: 'purple' },
    { label: 'Blog Posts', value: blogCount, color: 'pink' },
    { label: 'Products', value: productCount, color: 'blue' },
    { label: 'Paid Orders', value: paidTransactions, color: 'green' },
    { label: 'Pending Orders', value: pendingTransactions, color: 'yellow' },
    { label: 'Failed Orders', value: failedTransactions, color: 'red' },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <p className="text-white/60 mb-2">{stat.label}</p>
            <p className={`text-4xl font-bold text-${stat.color}-400`}>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/admin/projects" className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <h3 className="text-white font-medium">Manage Projects</h3>
              <p className="text-white/60 text-sm">Add, edit, or delete portfolio projects</p>
            </a>
            <a href="/admin/blogs" className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <h3 className="text-white font-medium">Manage Blogs</h3>
              <p className="text-white/60 text-sm">Create and publish blog posts</p>
            </a>
            <a href="/admin/products" className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <h3 className="text-white font-medium">Manage Products</h3>
              <p className="text-white/60 text-sm">Add and manage digital products</p>
            </a>
            <a href="/admin/transactions" className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <h3 className="text-white font-medium">View Transactions</h3>
              <p className="text-white/60 text-sm">Monitor sales and payments</p>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
