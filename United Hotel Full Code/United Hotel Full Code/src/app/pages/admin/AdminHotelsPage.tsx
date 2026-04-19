import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Star, Edit, Power } from 'lucide-react';
import { useState } from 'react';
import { AddHotelWizard } from '../../components/admin/AddHotelWizard';
import { Modal } from '../../components/admin/Modal';

// Mock hotels data
const mockHotels = [
  {
    id: '1',
    name: 'Grand Palace Hotel',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
    stars: 5,
    city: 'Turkey - Sultanahmet',
    roomCount: 48,
    occupancy: 78,
    status: 'active'
  },
  {
    id: '2',
    name: 'Bosphorus View Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    stars: 4,
    city: 'Turkey - Beşiktaş',
    roomCount: 32,
    occupancy: 65,
    status: 'active'
  },
  {
    id: '3',
    name: 'Sultanahmet Inn',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
    stars: 3,
    city: 'Turkey - Sultanahmet',
    roomCount: 24,
    occupancy: 82,
    status: 'active'
  },
];

export function AdminHotelsPage() {
  const [hotels] = useState(mockHotels);
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [showEditHotelModal, setShowEditHotelModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<typeof mockHotels[0] | null>(null);

  const handleEditHotel = (hotel: typeof mockHotels[0]) => {
    setSelectedHotel(hotel);
    setShowEditHotelModal(true);
  };

  return (
    <AdminLayout title="Hotels & Rooms" breadcrumb="Admin > Hotels">
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Manage your properties and room inventory
          </p>
          <button 
            className="flex items-center gap-2 rounded-lg bg-[#1ABC9C] px-5 py-2.5 font-semibold text-white hover:bg-[#16A085] transition-colors shadow-sm"
            onClick={() => setShowAddHotelModal(true)}
          >
            <Plus className="h-5 w-5" strokeWidth={2} />
            Add New Hotel
          </button>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <div 
              key={hotel.id} 
              className="bg-white rounded-xl shadow-sm border border-[#EAEAEA] overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Hotel Image */}
              <div className="relative h-48 bg-[#EAEAEA]">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <button className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                    ${hotel.status === 'active' 
                      ? 'bg-[#22C55E] text-white' 
                      : 'bg-[#8C8C8C] text-white'
                    }
                  `}>
                    <Power className="h-3 w-3" strokeWidth={2} />
                    {hotel.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* Hotel Details */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#3B3B3B] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < hotel.stars 
                              ? 'fill-[#1ABC9C] text-[#1ABC9C]' 
                              : 'fill-[#EAEAEA] text-[#EAEAEA]'
                          }`}
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {hotel.city}
                    </span>
                  </div>
                </div>

                {/* Room Count & Occupancy */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-[#8C8C8C]">Rooms: </span>
                    <span className="font-semibold text-[#3B3B3B]">{hotel.roomCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#8C8C8C]">Occupancy:</span>
                    <span className="font-semibold text-[#3B3B3B]">{hotel.occupancy}%</span>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div className="w-full bg-[#EAEAEA] rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#1ABC9C] h-full rounded-full transition-all"
                    style={{ width: `${hotel.occupancy}%` }}
                  />
                </div>

                {/* Action Button */}
                <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#EAEAEA] bg-white px-4 py-2.5 font-medium text-[#3B3B3B] hover:bg-[#FAFAFA] transition-colors" onClick={() => handleEditHotel(hotel)}>
                  <Edit className="h-4 w-4" strokeWidth={1.5} />
                  Edit Hotel & Rooms
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no hotels) */}
        {hotels.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-dashed border-[#EAEAEA] p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#1ABC9C]/10 flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-[#1ABC9C]" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-[#3B3B3B] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No hotels yet
            </h3>
            <p className="text-sm text-[#8C8C8C] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Get started by adding your first hotel property
            </p>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#1ABC9C] px-5 py-2.5 font-semibold text-white hover:bg-[#16A085] transition-colors">
              <Plus className="h-5 w-5" strokeWidth={2} />
              Add Your First Hotel
            </button>
          </div>
        )}

        {/* Add/Edit Hotel Form Section (Placeholder) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#EAEAEA]">
          <h3 className="text-lg font-semibold text-[#3B3B3B] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Hotel Management Form
          </h3>
          <div className="bg-[#FAFAFA] rounded-lg p-8 text-center">
            <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Click "Edit Hotel & Rooms" on any hotel card above to manage its details, or click "Add New Hotel" to create a new property.
            </p>
            <div className="mt-6 space-y-2 text-xs text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <p><strong className="text-[#3B3B3B]">Form sections will include:</strong></p>
              <p>• Basic Info (name, description, tags)</p>
              <p>• Location (address, city, coordinates)</p>
              <p>• Media (image uploader with drag-and-drop)</p>
              <p>• Amenities (WiFi, Pool, Spa, etc.)</p>
              <p>• Policies (check-in/out times, cancellation, etc.)</p>
              <p>• Room Management (add/edit rooms, pricing, availability)</p>
            </div>
          </div>
        </div>

        {/* Room Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[#EAEAEA] overflow-hidden">
          <div className="p-6 border-b border-[#EAEAEA]">
            <h3 className="text-lg font-semibold text-[#3B3B3B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Room Inventory
            </h3>
            <p className="text-sm text-[#8C8C8C] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Select a hotel above to manage its rooms
            </p>
          </div>
          
          <div className="p-8 text-center bg-[#FAFAFA]">
            <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Room management table will appear here when a hotel is selected
            </p>
            <div className="mt-6 space-y-2 text-xs text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <p><strong className="text-[#3B3B3B]">Room table columns:</strong></p>
              <p>Room Name | Type | Bed Type | Size (sqm) | Max Guests | Direct Price | OTA Price | Savings % | Availability | Actions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Hotel Modal */}
      <AddHotelWizard
        isOpen={showAddHotelModal}
        onClose={() => setShowAddHotelModal(false)}
      />

      {/* Edit Hotel Modal */}
      <Modal
        isOpen={showEditHotelModal}
        onClose={() => {
          setShowEditHotelModal(false);
          setSelectedHotel(null);
        }}
        title={`Edit ${selectedHotel?.name || 'Hotel'}`}
      >
        {selectedHotel && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3B3B3B] mb-2">
                  Hotel Name
                </label>
                <input
                  type="text"
                  defaultValue={selectedHotel.name}
                  className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3B3B3B] mb-2">
                  Star Rating
                </label>
                <select 
                  defaultValue={selectedHotel.stars}
                  className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3B3B3B] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  defaultValue={selectedHotel.city}
                  className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3B3B3B] mb-2">
                  Number of Rooms
                </label>
                <input
                  type="number"
                  defaultValue={selectedHotel.roomCount}
                  className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3B3B3B] mb-2">
                  Status
                </label>
                <select 
                  defaultValue={selectedHotel.status}
                  className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="border-t border-[#EAEAEA] pt-4">
                <h4 className="text-sm font-semibold text-[#3B3B3B] mb-3">
                  Room Management
                </h4>
                <div className="bg-[#FAFAFA] rounded-lg p-4">
                  <p className="text-sm text-[#8C8C8C] mb-3">
                    Current rooms: {selectedHotel.roomCount}
                  </p>
                  <button className="text-sm text-[#1ABC9C] hover:text-[#16A085] font-medium">
                    + Manage Room Inventory
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowEditHotelModal(false);
                  setSelectedHotel(null);
                }}
                className="flex-1 px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-[#3B3B3B] hover:bg-[#FAFAFA] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEditHotelModal(false);
                  setSelectedHotel(null);
                  // Handle form submission
                }}
                className="flex-1 px-4 py-2.5 bg-[#1ABC9C] text-white rounded-lg hover:bg-[#16A085] transition-colors font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}