import { AdminLayout } from '../../components/admin/AdminLayout';
import { Search, Download, MoreVertical, X } from 'lucide-react';
import { useState } from 'react';

// Mock bookings data
const mockBookings = [
  { id: 'BK-1247', guest: 'John Smith', email: 'john@email.com', hotel: 'Grand Palace Hotel', room: 'Deluxe Suite', checkIn: '2026-04-15', checkOut: '2026-04-20', nights: 5, amount: '$2,250', status: 'confirmed' },
  { id: 'BK-1246', guest: 'Emma Johnson', email: 'emma@email.com', hotel: 'Bosphorus View Hotel', room: 'Standard Room', checkIn: '2026-04-10', checkOut: '2026-04-12', nights: 2, amount: '$560', status: 'pending' },
  { id: 'BK-1245', guest: 'Michael Brown', email: 'michael@email.com', hotel: 'Sultanahmet Inn', room: 'Family Room', checkIn: '2026-04-08', checkOut: '2026-04-11', nights: 3, amount: '$1,140', status: 'checked-in' },
  { id: 'BK-1244', guest: 'Sarah Davis', email: 'sarah@email.com', hotel: 'Grand Palace Hotel', room: 'Executive Suite', checkIn: '2026-04-05', checkOut: '2026-04-07', nights: 2, amount: '$1,040', status: 'checked-out' },
  { id: 'BK-1243', guest: 'Robert Wilson', email: 'robert@email.com', hotel: 'Bosphorus View Hotel', room: 'Deluxe Room', checkIn: '2026-04-01', checkOut: '2026-04-03', nights: 2, amount: '$640', status: 'cancelled' },
  { id: 'BK-1242', guest: 'Linda Martinez', email: 'linda@email.com', hotel: 'Grand Palace Hotel', room: 'Standard Room', checkIn: '2026-03-28', checkOut: '2026-03-30', nights: 2, amount: '$520', status: 'checked-out' },
  { id: 'BK-1241', guest: 'James Anderson', email: 'james@email.com', hotel: 'Sultanahmet Inn', room: 'Deluxe Suite', checkIn: '2026-03-25', checkOut: '2026-03-29', nights: 4, amount: '$1,680', status: 'confirmed' },
];

type StatusFilter = 'all' | 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'checked-out';

export function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guest.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    const baseClass = 'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold';
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
    <AdminLayout title="Bookings Management" breadcrumb="Admin > Bookings">
      <div className="space-y-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-[#EAEAEA]">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Left Section: Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8C8C8C]" strokeWidth={2} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by guest name or booking ID..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[#EAEAEA] bg-white text-sm text-[#3B3B3B] placeholder:text-[#8C8C8C] focus:border-[#1ABC9C] focus:outline-none focus:ring-4 focus:ring-[#1ABC9C]/20"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-4 py-3 rounded-lg border-2 border-[#EAEAEA] bg-white text-sm text-[#3B3B3B] font-medium focus:border-[#1ABC9C] focus:outline-none focus:ring-4 focus:ring-[#1ABC9C]/20"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="checked-in">Checked-in</option>
                <option value="checked-out">Checked-out</option>
              </select>
            </div>

            {/* Right Section: Count & Export */}
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-[#1ABC9C]/10 rounded-lg border border-[#1ABC9C]/20">
                <span className="text-sm text-[#3B3B3B] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {filteredBookings.length} bookings
                </span>
              </div>
              <button className="flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-[#EAEAEA] bg-white text-sm font-semibold text-[#3B3B3B] hover:bg-[#FAFAFA] hover:border-[#1ABC9C] transition-all">
                <Download className="h-4 w-4" strokeWidth={2} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table - Full Height */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#EAEAEA] overflow-hidden">
          {/* Table Header Info */}
          <div className="px-8 py-4 bg-gradient-to-r from-[#F8F9FA] to-[#FAFAFA] border-b-2 border-[#EAEAEA]">
            <h3 className="text-lg font-semibold text-[#3B3B3B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              All Bookings
            </h3>
            <p className="text-sm text-[#8C8C8C] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Complete overview of all reservations and their current status
            </p>
          </div>

          {/* Scrollable Table Container with Custom Scrollbar */}
          <div 
            className="overflow-x-auto overflow-y-auto bookings-table-scroll" 
            style={{ maxHeight: 'calc(100vh - 380px)', minHeight: '600px' }}
          >
            <style>{`
              .bookings-table-scroll::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .bookings-table-scroll::-webkit-scrollbar-track {
                background: #F8F9FA;
                border-radius: 10px;
              }
              .bookings-table-scroll::-webkit-scrollbar-thumb {
                background: #D1D5DB;
                border-radius: 10px;
                transition: background 0.2s ease;
              }
              .bookings-table-scroll::-webkit-scrollbar-thumb:hover {
                background: #9CA3AF;
              }
              .bookings-table-scroll {
                scrollbar-width: thin;
                scrollbar-color: #D1D5DB #F8F9FA;
              }
            `}</style>
            <table className="w-full" style={{ minWidth: '1400px' }}>
              <colgroup>
                <col style={{ width: '110px' }} />
                <col style={{ width: '200px' }} />
                <col style={{ width: '180px' }} />
                <col style={{ width: '150px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '130px' }} />
                <col style={{ width: '100px' }} />
              </colgroup>
              <thead className="bg-gradient-to-r from-[#1ABC9C] to-[#16A085] sticky top-0 z-10 shadow-lg">
                <tr>
                  <th className="px-4 py-5 text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">Booking ID</span>
                      <span className="text-[10px] text-white/70 font-normal normal-case whitespace-nowrap">Reference</span>
                    </div>
                  </th>
                  <th className="px-4 py-5 text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">Guest Details</span>
                      <span className="text-[10px] text-white/70 font-normal normal-case whitespace-nowrap">Name & Email</span>
                    </div>
                  </th>
                  <th className="px-4 py-5 text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">Hotel</span>
                      <span className="text-[10px] text-white/70 font-normal normal-case whitespace-nowrap">Property Name</span>
                    </div>
                  </th>
                  <th className="px-4 py-5 text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">Room Type</span>
                      <span className="text-[10px] text-white/70 font-normal normal-case whitespace-nowrap">Category</span>
                    </div>
                  </th>
                  <th className="px-4 py-5 text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">Check-in</span>
                      <span className="text-[10px] text-white/70 font-normal normal-case whitespace-nowrap">Arrival Date</span>
                    </div>
                  </th>
                  <th className="px-4 py-5 text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">Check-out</span>
                      <span className="text-[10px] text-white/70 font-normal normal-case whitespace-nowrap">Departure Date</span>
                    </div>
                  </th>
                  <th className="px-4 py-5 text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">Duration</span>
                      <span className="text-[10px] text-white/70 font-normal normal-case whitespace-nowrap">Total Nights</span>
                    </div>
                  </th>
                  <th className="px-4 py-5 text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">Total Amount</span>
                      <span className="text-[10px] text-white/70 font-normal normal-case whitespace-nowrap">Price</span>
                    </div>
                  </th>
                  <th className="px-4 py-5 text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">Status</span>
                      <span className="text-[10px] text-white/70 font-normal normal-case whitespace-nowrap">Current State</span>
                    </div>
                  </th>
                  <th className="px-4 py-5 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="flex flex-col gap-1 items-center">
                      <span className="text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">Actions</span>
                      <span className="text-[10px] text-white/70 font-normal normal-case whitespace-nowrap">Manage</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-[#FAFAFA] flex items-center justify-center">
                          <Search className="h-8 w-8 text-[#8C8C8C]" />
                        </div>
                        <p className="text-base font-medium text-[#3B3B3B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          No bookings found
                        </p>
                        <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Try adjusting your search filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <tr 
                      key={booking.id} 
                      className={`
                        border-b border-[#EAEAEA] transition-all cursor-pointer
                        ${index % 2 === 0 ? 'bg-white hover:bg-[#F0FDF4]' : 'bg-[#FAFAFA] hover:bg-[#F0FDF4]'}
                      `}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <td className="px-4 py-5">
                        <span className="text-xs font-mono font-bold text-[#1ABC9C] bg-[#1ABC9C]/10 px-2.5 py-1.5 rounded-md inline-block">
                          {booking.id}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                          <span className="text-sm font-semibold text-[#3B3B3B] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {booking.guest}
                          </span>
                          <span className="text-xs text-[#8C8C8C] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {booking.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-sm font-medium text-[#3B3B3B] block truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {booking.hotel}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-xs text-[#3B3B3B] bg-[#F8F9FA] px-2.5 py-1.5 rounded-md inline-block truncate max-w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {booking.room}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-xs font-medium text-[#3B3B3B] block" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {booking.checkIn}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-xs font-medium text-[#3B3B3B] block" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {booking.checkOut}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-xs font-semibold text-[#3B3B3B] bg-[#DBEAFE] px-2.5 py-1.5 rounded-md inline-block" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {booking.nights}N
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-base font-bold text-[#3B3B3B] block" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {booking.amount}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className={getStatusBadgeClass(booking.status)}>
                          {booking.status === 'checked-in' ? 'Active' : booking.status === 'checked-out' ? 'Complete' : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                          }}
                          className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-[#8C8C8C] hover:bg-[#1ABC9C] hover:text-white transition-all"
                        >
                          <MoreVertical className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredBookings.length > 0 && (
            <div className="flex items-center justify-between border-t-2 border-[#EAEAEA] px-8 py-5 bg-[#FAFAFA]">
              <p className="text-sm font-medium text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Showing <strong className="text-[#3B3B3B]">1-{filteredBookings.length}</strong> of <strong className="text-[#3B3B3B]">{mockBookings.length}</strong> bookings
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg border-2 border-[#EAEAEA] bg-white text-sm font-semibold text-[#3B3B3B] hover:bg-[#1ABC9C] hover:text-white hover:border-[#1ABC9C] transition-all">
                  Previous
                </button>
                <button className="px-4 py-2 rounded-lg bg-[#1ABC9C] text-sm font-semibold text-white hover:bg-[#16A085] transition-all shadow-sm">
                  1
                </button>
                <button className="px-4 py-2 rounded-lg border-2 border-[#EAEAEA] bg-white text-sm font-semibold text-[#3B3B3B] hover:bg-[#1ABC9C] hover:text-white hover:border-[#1ABC9C] transition-all">
                  2
                </button>
                <button className="px-4 py-2 rounded-lg border-2 border-[#EAEAEA] bg-white text-sm font-semibold text-[#3B3B3B] hover:bg-[#1ABC9C] hover:text-white hover:border-[#1ABC9C] transition-all">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Detail Slide-over Panel */}
      {selectedBooking && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedBooking(null)}
          />
          <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#3B3B3B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {selectedBooking.id}
                </h2>
                <span className={getStatusBadgeClass(selectedBooking.status)}>
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-[#8C8C8C] hover:text-[#3B3B3B] transition-colors"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Guest Info */}
              <div className="bg-[#FAFAFA] rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[#3B3B3B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Guest Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8C8C8C]">Name:</span>
                    <span className="text-[#3B3B3B] font-medium">{selectedBooking.guest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8C8C]">Email:</span>
                    <span className="text-[#3B3B3B] font-medium">{selectedBooking.email}</span>
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div className="bg-[#FAFAFA] rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[#3B3B3B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Stay Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8C8C8C]">Hotel:</span>
                    <span className="text-[#3B3B3B] font-medium">{selectedBooking.hotel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8C8C]">Room:</span>
                    <span className="text-[#3B3B3B] font-medium">{selectedBooking.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8C8C]">Check-in:</span>
                    <span className="text-[#3B3B3B] font-medium">{selectedBooking.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8C8C]">Check-out:</span>
                    <span className="text-[#3B3B3B] font-medium">{selectedBooking.checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8C8C]">Nights:</span>
                    <span className="text-[#3B3B3B] font-medium">{selectedBooking.nights}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-[#FAFAFA] rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[#3B3B3B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Price Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8C8C8C]">Room rate × {selectedBooking.nights} nights:</span>
                    <span className="text-[#3B3B3B] font-medium">$2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8C8C]">Taxes & fees:</span>
                    <span className="text-[#3B3B3B] font-medium">$250</span>
                  </div>
                  <div className="border-t border-[#EAEAEA] pt-2 mt-2 flex justify-between">
                    <span className="text-[#3B3B3B] font-semibold">Total:</span>
                    <span className="text-[#3B3B3B] font-semibold">{selectedBooking.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8C8C]">Payment status:</span>
                    <span className="text-[#22C55E] font-medium">Paid</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button className="w-full rounded-lg bg-[#1ABC9C] px-6 py-3 font-semibold text-white hover:bg-[#16A085] transition-colors">
                  Confirm Booking
                </button>
                <button className="w-full rounded-lg border border-[#EAEAEA] bg-white px-6 py-3 font-semibold text-[#3B3B3B] hover:bg-[#FAFAFA] transition-colors">
                  Send Email
                </button>
                <button className="w-full rounded-lg border border-[#EF4444] bg-white px-6 py-3 font-semibold text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors">
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}