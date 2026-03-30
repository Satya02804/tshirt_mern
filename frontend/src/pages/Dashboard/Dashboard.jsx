'use client';

import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Grid, Paper, Typography, Box,
  Card, CardContent, CardHeader, LinearProgress, List,
  ListItem, ListItemText, Chip, Button, Skeleton, Stack
} from '@mui/material';
import {
  People as PeopleIcon, Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon, CurrencyRupee as RupeeIcon,
  TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon,
  ArrowForward, ShoppingBagOutlined
} from '@mui/icons-material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
  LineChart, Line
} from 'recharts';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, salesRes, productsRes, usersRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/analytics/sales'),
          api.get('/dashboard/analytics/top-products'),
          api.get('/dashboard/analytics/user-growth')
        ]);

        setStats(statsRes.data.data);
        setSalesData(salesRes.data.data.map(item => ({
          ...item,
          sales: parseFloat(item.sales),
          date: new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        })));
        setTopProducts(productsRes.data.data.map(item => ({
          name: item.product ? item.product.name : 'Unknown Product',
          quantity: parseFloat(item.total_quantity)
        })));
        setUserGrowth(usersRes.data.data.map(item => ({
          ...item,
          count: parseInt(item.count),
          date: new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        })));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card
      sx={{
        height: '100%',
        borderRadius: 2,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 1)',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
          '& .icon-box': { transform: 'rotate(10deg) scale(1.1)' }
        },
      }}
    >
      <CardContent sx={{ p: 3.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', my: 1 }}>
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{
                px: 1, py: 0.2, borderRadius: 1.5,
                bgcolor: trend > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                display: 'flex', alignItems: 'center'
              }}>
                {trend > 0 ? <TrendingUpIcon fontSize="small" sx={{ color: '#10b981' }} /> : <TrendingDownIcon fontSize="small" sx={{ color: '#ef4444' }} />}
                <Typography variant="caption" sx={{ fontWeight: 800, color: trend > 0 ? '#10b981' : '#ef4444', ml: 0.5 }}>
                  {Math.abs(trend)}%
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>vs last month</Typography>
            </Box>
          </Box>
          <Box className="icon-box" sx={{
            width: 60, height: 60, borderRadius: 4, bgcolor: `${color}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.3s ease'
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 32, color: color } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 6 }} />
      </Container>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#f8fafc',
      backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.02) 0, transparent 50%), radial-gradient(circle at 100% 100%, rgba(124, 58, 237, 0.02) 0, transparent 50%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: '#0f172a', letterSpacing: '-0.04em' }}>
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              Welcome back to T-Shirt Store. Here is your operational overview.
            </Typography>
          </Box>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Total Users" value={stats.totalUsers} icon={<PeopleIcon />} color="#1e40af" trend={12} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Total Products" value={stats.totalProducts} icon={<InventoryIcon />} color="#10b981" trend={8} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCartIcon />} color="#f59e0b" trend={15} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} icon={<RupeeIcon />} color="#8b5cf6" trend={24} />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #fff' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 4 }}>Revenue Analytics</Typography>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="sales" stroke="#1e40af" strokeWidth={4} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 2, height: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #fff' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 4 }}>Best Sellers</Typography>
              <Stack spacing={3}>
                {topProducts.slice(0, 5).map((product, i) => (
                  <Box key={i}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={700}>{product.name}</Typography>
                      <Typography variant="caption" color="primary" fontWeight={800}>{product.quantity} sold</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={topProducts[0]?.quantity ? (product.quantity / topProducts[0].quantity) * 100 : 0}
                      sx={{ height: 8, borderRadius: 5, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: '#10b981' } }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Transactions Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #fff' }}>
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
            <Typography variant="h6" fontWeight={800}>Recent Transactions</Typography>
            <Button component={RouterLink} to="/dashboard/orders" endIcon={<ArrowForward />} sx={{ fontWeight: 700, textTransform: 'none' }}>View All History</Button>
          </Box>
          <List disablePadding>
            {(stats.recentOrders || []).map((order, i) => (
              <ListItem key={order.id} divider={i !== stats.recentOrders.length - 1} sx={{ p: 3, '&:hover': { bgcolor: '#f8fafc' } }}>
                <ListItemText
                  primary={order.user?.name || 'Guest Customer'}
                  secondary={new Date(order.createdAt || order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  primaryTypographyProps={{ fontWeight: 700, color: '#1e293b' }}
                />
                <Box sx={{ textAlign: 'right', mr: 4 }}>
                  <Typography fontWeight={900} sx={{ color: '#0f172a' }}>₹{parseFloat(order.totalPrice || 0).toLocaleString('en-IN')}</Typography>
                </Box>
                <Chip
                  label={order.status}
                  size="small"
                  sx={{
                    fontWeight: 800, textTransform: 'uppercase', 
                    bgcolor: order.status === 'delivered' ? '#dcfce7' : order.status === 'shipped' ? '#dbeafe' : '#fef9c3',
                    color: order.status === 'delivered' ? '#15803d' : order.status === 'shipped' ? '#1e40af' : '#a16207'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;