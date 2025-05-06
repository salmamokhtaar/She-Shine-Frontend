import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const { fetchProducts } = useProducts();
  const { fetchAllOrders } = useOrders();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageOrderValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState({
    revenueData: [],
    orderStatusData: {},
    topProducts: []
  });

  // Only run once on mount
  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await fetchProducts() || [];
        const orders = await fetchAllOrders() || [];
        
        // Process data for charts
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          return d.toLocaleString('default', { month: 'short' });
        }).reverse();

        // Revenue data for line chart
        const revenueByMonth = last6Months.map(month => {
          const monthOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toLocaleString('default', { month: 'short' }) === month;
          });
          return monthOrders.reduce((sum, order) => sum + (order?.totalAmount || 0), 0);
        });

        // Order status data for doughnut chart
        const orderStatusCounts = orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});

        // Top products data for bar chart
        const productSales = orders.reduce((acc, order) => {
          order.items.forEach(item => {
            acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
          });
          return acc;
        }, {});

        const topProducts = Object.entries(productSales)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([productId, quantity]) => {
            const product = products.find(p => p._id === productId);
            return {
              name: product?.name || 'Unknown Product',
              quantity
            };
          });

        if (isMounted) {
          setChartData({
            revenueData: revenueByMonth,
            orderStatusData: orderStatusCounts,
            topProducts
          });
          
          const pendingOrders = orders.filter(order => order.status === 'pending');
          const totalRevenue = orders.reduce((sum, order) => sum + (order?.totalAmount || 0), 0);
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          const monthlyRevenue = orders.reduce((sum, order) => {
            const orderDate = new Date(order.createdAt);
            if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
              return sum + (order.totalAmount || 0);
            }
            return sum;
          }, 0);
          const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
          setStats({
            totalProducts: Array.isArray(products) ? products.length : 0,
            totalOrders: Array.isArray(orders) ? orders.length : 0,
            pendingOrders: Array.isArray(pendingOrders) ? pendingOrders.length : 0,
            totalRevenue: totalRevenue || 0,
            monthlyRevenue: monthlyRevenue || 0,
            averageOrderValue: averageOrderValue || 0
          });
          // Get recent orders (last 5)
          if (Array.isArray(orders) && orders.length > 0) {
            const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRecentOrders(sortedOrders.slice(0, 5));
          } else {
            setRecentOrders([]);
          }
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load dashboard data. Please try again.');
          toast.error('Failed to load dashboard data. Please try again.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadDashboardData();
    // Refresh every 30 seconds
    const intervalId = setInterval(loadDashboardData, 30000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []); // No unstable dependencies

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart configurations
  const revenueChartData = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return d.toLocaleString('default', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Revenue',
        data: chartData.revenueData,
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const orderStatusChartData = {
    labels: Object.keys(chartData.orderStatusData),
    datasets: [
      {
        data: Object.values(chartData.orderStatusData),
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgb(236, 72, 153)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topProductsChartData = {
    labels: chartData.topProducts.map(p => p.name),
    datasets: [
      {
        label: 'Units Sold',
        data: chartData.topProducts.map(p => p.quantity),
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderColor: 'rgb(236, 72, 153)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, <span className="text-pink-600 font-medium">{user?.name}</span>!</p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-pink-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-pink-100 rounded-full p-3">
              <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                <dd className="text-3xl font-semibold text-gray-900">{stats.totalProducts}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                <dd className="text-3xl font-semibold text-gray-900">{stats.totalOrders}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-yellow-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-yellow-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                <dd className="text-3xl font-semibold text-gray-900">{stats.pendingOrders}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-green-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd className="text-3xl font-semibold text-gray-900">${stats.totalRevenue.toFixed(2)}</dd>
                <dd className="text-sm text-gray-500">${stats.monthlyRevenue.toFixed(2)} this month</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-80">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
          <div className="h-80">
            <Doughnut data={orderStatusChartData} options={chartOptions} />
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
          <div className="h-80">
            <Bar data={topProductsChartData} options={chartOptions} />
          </div>
        </div>
      </div>
      {/* Quick Links */}
      <div className="bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-lg mb-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-pink-100">
        <div className="px-6 py-5 border-b border-pink-100">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/products" className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 justify-center transition-all duration-300 transform hover:-translate-y-1">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Manage Products
          </Link>
          <Link to="/admin/orders" className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 justify-center transition-all duration-300 transform hover:-translate-y-1">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Manage Orders
          </Link>
          <Link to="/admin/users" className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 justify-center transition-all duration-300 transform hover:-translate-y-1">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Manage Users
          </Link>
        </div>
      </div>
      {/* Recent Orders */}
      <div className="bg-gradient-to-br from-white to-pink-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-pink-100">
        <div className="px-6 py-5 border-b border-pink-100 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors duration-300 flex items-center">
            View all
            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-pink-100">
            <thead className="bg-pink-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-pink-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No orders found</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-pink-50 transition-colors duration-300">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.userId?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{order.userId?.email || 'No email'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
