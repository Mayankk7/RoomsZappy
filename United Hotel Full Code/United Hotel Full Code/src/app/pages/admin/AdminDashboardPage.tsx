import { AdminLayout } from '../../components/admin/AdminLayout';
import { CalendarCheck, DollarSign, Percent, TrendingUp, ArrowUp, ArrowDown, Building2, Tag, FileDown, Calendar, Info, ShieldCheck, User as UserIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useMemo, memo } from 'react';
import { Modal } from '../../components/admin/Modal';
import { useNavigate } from 'react-router';
import { useRole, setUserActualRole } from '../../components/admin/RoleSwitcher';

// Mock data for revenue chart - memoized at module level to ensure stability
const revenueDataStatic = [
  { id: 'w1', date: 'Jan 1', direct: 12000, ota: 8000 },
  { id: 'w2', date: 'Jan 8', direct: 15000, ota: 9000 },
  { id: 'w3', date: 'Jan 15', direct: 18000, ota: 10000 },
  { id: 'w4', date: 'Jan 22', direct: 16000, ota: 11000 },
  { id: 'w5', date: 'Jan 29', direct: 20000, ota: 9500 },
  { id: 'w6', date: 'Feb 5', direct: 22000, ota: 10500 },
  { id: 'w7', date: 'Feb 12', direct: 25000, ota: 11000 },
];

// Mock recent bookings
const recentBookings = [
  { id: 'BK-1247', guest: 'John Smith', hotel: 'Grand Palace Hotel', room: 'Deluxe Suite', checkIn: '2026-04-15', status: 'confirmed', amount: '$450' },
  { id: 'BK-1246', guest: 'Emma Johnson', hotel: 'Bosphorus View Hotel', room: 'Standard Room', checkIn: '2026-04-10', status: 'pending', amount: '$280' },
  { id: 'BK-1245', guest: 'Michael Brown', hotel: 'Sultanahmet Inn', room: 'Family Room', checkIn: '2026-04-08', status: 'checked-in', amount: '$380' },
  { id: 'BK-1244', guest: 'Sarah Davis', hotel: 'Grand Palace Hotel', room: 'Executive Suite', checkIn: '2026-04-05', status: 'checked-out', amount: '$520' },
  { id: 'BK-1243', guest: 'Robert Wilson', hotel: 'Bosphorus View Hotel', room: 'Deluxe Room', checkIn: '2026-04-01', status: 'cancelled', amount: '$320' },
];

type DateFilter = '7days' | '30days' | '90days' | 'today' | 'custom';

export function AdminDashboardPage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>('30days');
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showRoleInfo, setShowRoleInfo] = useState(true);
  const navigate = useNavigate();
  const currentRole = useRole();

  const handleQuickAction = (actionTitle: string) => {
    switch(actionTitle) {
      case 'Add New Hotel':
        navigate('/admin/hotels');
        break;
      case 'Manage Pricing':
        setShowPricingModal(true);
        break;
      case 'Generate Report':
        setShowReportModal(true);
        break;
      case 'View Calendar':
        setShowCalendarModal(true);
        break;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    switch (status) {
      case 'confirmed':
        return `${baseClass} bg-[#22C55E]/10 text-[#22C55E]`;
      case 'pending':
        return `${baseClass} bg-[#F59E0B]/10 text-[#F59E0B]`;
      case 'cancelled':
        return `${baseClass} bg-[#EF4444]/10 text-[#EF4444]`;
      case 'checked-in':
        return `${baseClass} bg-[#3B82F6]/10 text-[#3B82F6]`;
      case 'checked-out':
        return `${baseClass} bg-[#8C8C8C]/10 text-[#8C8C8C]`;
      default:
        return baseClass;
    }
  };

  return (
    <AdminLayout title="Dashboard" breadcrumb="Admin">
      <div className="space-y-8">
        {/* Role Info Banner */}
        {showRoleInfo && (
          <div className="bg-gradient-to-r from-[#1ABC9C]/10 to-[#1ABC9C]/5 border border-[#1ABC9C]/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className={`rounded-full p-2 ${currentRole === 'admin' ? 'bg-[#1ABC9C]' : 'bg-[#8C8C8C]'}`}>
                {currentRole === 'admin' ? (
                  <ShieldCheck className="h-5 w-5 text-white" />
                ) : (
                  <UserIcon className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#3B3B3B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {currentRole === 'admin' ? '🎯 Admin View Active' : '👤 Staff View Active'}
                  </h3>
                  <button
                    onClick={() => setShowRoleInfo(false)}
                    className="text-[#8C8C8C] hover:text-[#3B3B3B] text-sm"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="text-sm text-[#3B3B3B] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {currentRole === 'admin' 
                    ? 'You have full access to all features including Hotels & Rooms management and Analytics.'
                    : 'Staff members can view Dashboard, manage Bookings, and access Settings. Hotels & Analytics require admin access.'
                  }
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <p className="text-xs text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    💡 For testing, switch your login role:
                  </p>
                  <button
                    onClick={() => setUserActualRole('admin')}
                    className="text-xs px-3 py-1.5 bg-[#1ABC9C] text-white rounded-md hover:bg-[#16A085] transition-colors"
                  >
                    Login as Admin
                  </button>
                  <button
                    onClick={() => setUserActualRole('staff')}
                    className="text-xs px-3 py-1.5 bg-[#8C8C8C] text-white rounded-md hover:bg-[#6B6B6B] transition-colors"
                  >
                    Login as Staff
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Bar + Date Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#3B3B3B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Welcome back, Admin
            </h2>
            <p className="text-sm text-[#8C8C8C] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Grand Palace Hotel
            </p>
          </div>
          
          {/* Date Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Today', value: 'today' as DateFilter },
              { label: '7 Days', value: '7days' as DateFilter },
              { label: '30 Days', value: '30days' as DateFilter },
              { label: '90 Days', value: '90days' as DateFilter },
              { label: 'Custom', value: 'custom' as DateFilter },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setDateFilter(filter.value)}
                className={`
                  rounded-full px-4 py-2 text-sm font-medium transition-colors
                  ${dateFilter === filter.value
                    ? 'bg-[#1ABC9C] text-white'
                    : 'bg-[#EAEAEA] text-[#3B3B3B] hover:bg-[#EAEAEA]/80'
                  }
                `}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Bookings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#EAEAEA]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ABC9C]/10">
                <CalendarCheck className="h-6 w-6 text-[#1ABC9C]" strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Total Bookings
              </p>
              <p className="text-3xl font-bold text-[#3B3B3B] mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                1,247
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="h-4 w-4 text-[#22C55E]" strokeWidth={2} />
                <span className="text-sm font-medium text-[#22C55E]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  +12.5%
                </span>
                <span className="text-xs text-[#8C8C8C]">vs last period</span>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#EAEAEA]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ABC9C]/10">
                <DollarSign className="h-6 w-6 text-[#1ABC9C]" strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Revenue
              </p>
              <p className="text-3xl font-bold text-[#3B3B3B] mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                $184,500
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="h-4 w-4 text-[#22C55E]" strokeWidth={2} />
                <span className="text-sm font-medium text-[#22C55E]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  +8.2%
                </span>
                <span className="text-xs text-[#8C8C8C]">vs last period</span>
              </div>
            </div>
          </div>

          {/* Occupancy Rate */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#EAEAEA]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ABC9C]/10">
                <Percent className="h-6 w-6 text-[#1ABC9C]" strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Occupancy Rate
              </p>
              <p className="text-3xl font-bold text-[#3B3B3B] mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                78%
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDown className="h-4 w-4 text-[#EF4444]" strokeWidth={2} />
                <span className="text-sm font-medium text-[#EF4444]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  -3.1%
                </span>
                <span className="text-xs text-[#8C8C8C]">vs last period</span>
              </div>
            </div>
          </div>

          {/* Direct Booking % */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#EAEAEA]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ABC9C]/10">
                <TrendingUp className="h-6 w-6 text-[#1ABC9C]" strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Direct Booking %
              </p>
              <p className="text-3xl font-bold text-[#3B3B3B] mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                64%
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="h-4 w-4 text-[#22C55E]" strokeWidth={2} />
                <span className="text-sm font-medium text-[#22C55E]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  +5%
                </span>
                <span className="text-xs text-[#8C8C8C]">36% via OTA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#EAEAEA]" key="revenue-chart-container">
          <h3 className="text-lg font-semibold text-[#3B3B3B] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Revenue Overview
          </h3>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height={320} minHeight={320}>
              <LineChart data={revenueDataStatic} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAEAEA" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#8C8C8C"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}
                  tick={{ fill: '#8C8C8C' }}
                  tickLine={false}
                  axisLine={{ stroke: '#EAEAEA' }}
                />
                <YAxis 
                  stroke="#8C8C8C"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}
                  tick={{ fill: '#8C8C8C' }}
                  tickLine={false}
                  axisLine={{ stroke: '#EAEAEA' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #EAEAEA',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="direct" 
                  stroke="#1ABC9C" 
                  strokeWidth={2}
                  name="Direct Bookings"
                  dot={{ fill: '#1ABC9C', r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="ota" 
                  stroke="#8C8C8C" 
                  strokeWidth={2}
                  name="OTA Bookings"
                  dot={{ fill: '#8C8C8C', r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#EAEAEA] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-[#EAEAEA]">
            <h3 className="text-lg font-semibold text-[#3B3B3B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Recent Bookings
            </h3>
            <a 
              href="/admin/bookings"
              className="text-sm font-medium text-[#1ABC9C] hover:text-[#16A085] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              View All →
            </a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8C8C8C] uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8C8C8C] uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8C8C8C] uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8C8C8C] uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8C8C8C] uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Check-in
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8C8C8C] uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8C8C8C] uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#EAEAEA]">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`/admin/bookings/${booking.id}`}
                        className="text-sm font-mono text-[#1ABC9C] hover:text-[#16A085]"
                      >
                        {booking.id}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3B3B3B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {booking.guest}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3B3B3B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {booking.hotel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {booking.room}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3B3B3B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {booking.checkIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadgeClass(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#3B3B3B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {booking.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Building2, title: 'Add New Hotel', description: 'Create a new property listing', color: '#1ABC9C' },
            { icon: Tag, title: 'Manage Pricing', description: 'Update room rates', color: '#1ABC9C' },
            { icon: FileDown, title: 'Generate Report', description: 'Export analytics data', color: '#1ABC9C' },
            { icon: Calendar, title: 'View Calendar', description: 'Check availability', color: '#1ABC9C' },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickAction(action.title)}
                className="group bg-white rounded-xl p-6 shadow-sm border border-[#EAEAEA] hover:border-[#1ABC9C] transition-all text-left"
              >
                <Icon className="h-6 w-6 text-[#1ABC9C] mb-3" strokeWidth={1.5} />
                <h4 className="text-base font-semibold text-[#3B3B3B] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {action.title}
                </h4>
                <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} title="Manage Pricing" size="lg">
        <div className="space-y-6">
          <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Update room rates for your properties
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#3B3B3B] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Select Hotel
              </label>
              <select className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20">
                <option>Grand Palace Hotel</option>
                <option>Bosphorus View Hotel</option>
                <option>Sultanahmet Inn</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#3B3B3B] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Room Type
              </label>
              <select className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20">
                <option>Deluxe Suite</option>
                <option>Standard Room</option>
                <option>Family Room</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#3B3B3B] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Base Price (USD)
              </label>
              <input type="number" placeholder="150" className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#3B3B3B] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Weekend Price (USD)
              </label>
              <input type="number" placeholder="180" className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20" />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3B3B3B] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Peak Season Price (USD)
              </label>
              <input type="number" placeholder="220" className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setShowPricingModal(false)} className="px-6 py-2.5 border border-[#EAEAEA] rounded-lg text-[#3B3B3B] hover:bg-[#FAFAFA] transition-colors">
              Cancel
            </button>
            <button onClick={() => setShowPricingModal(false)} className="px-6 py-2.5 bg-[#1ABC9C] text-white rounded-lg hover:bg-[#16A085] transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Generate Report">
        <div className="space-y-6">
          <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Export analytics data for the selected period
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3B3B3B] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Report Type
              </label>
              <select className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20">
                <option>Revenue Report</option>
                <option>Booking Report</option>
                <option>Occupancy Report</option>
                <option>Guest Demographics</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3B3B3B] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Start Date
                </label>
                <input type="date" className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3B3B3B] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  End Date
                </label>
                <input type="date" className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3B3B3B] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Format
              </label>
              <select className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20">
                <option>Excel (.xlsx)</option>
                <option>PDF</option>
                <option>CSV</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setShowReportModal(false)} className="px-6 py-2.5 border border-[#EAEAEA] rounded-lg text-[#3B3B3B] hover:bg-[#FAFAFA] transition-colors">
              Cancel
            </button>
            <button onClick={() => setShowReportModal(false)} className="px-6 py-2.5 bg-[#1ABC9C] text-white rounded-lg hover:bg-[#16A085] transition-colors flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Generate & Download
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showCalendarModal} onClose={() => setShowCalendarModal(false)} title="Availability Calendar" size="xl">
        <div className="space-y-6">
          <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
            View and manage room availability across your properties
          </p>
          
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center font-medium text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => (
              <button
                key={i}
                className="aspect-square p-2 border border-[#EAEAEA] rounded-lg hover:border-[#1ABC9C] transition-colors text-sm"
              >
                <div className="font-medium text-[#3B3B3B]">{((i % 30) + 1)}</div>
                <div className="text-xs text-[#22C55E] mt-1">{Math.floor(Math.random() * 20) + 5} avail</div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-[#EAEAEA]">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-[#22C55E]/20 border border-[#22C55E] rounded"></div>
              <span className="text-sm text-[#8C8C8C]">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-[#F59E0B]/20 border border-[#F59E0B] rounded"></div>
              <span className="text-sm text-[#8C8C8C]">Limited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-[#EF4444]/20 border border-[#EF4444] rounded"></div>
              <span className="text-sm text-[#8C8C8C]">Sold Out</span>
            </div>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}