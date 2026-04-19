import { Lock } from 'lucide-react';

export function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Strip */}
          <div className="bg-[#3B3B3B] px-6 py-4">
            <h1 className="text-2xl font-semibold text-white text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
              United Hotels
            </h1>
          </div>

          {/* Disabled Notice */}
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-[#EAEAEA] rounded-full flex items-center justify-center mx-auto mb-5">
              <Lock className="w-7 h-7 text-[#8C8C8C]" />
            </div>
            <h2 className="text-xl font-semibold text-[#3B3B3B] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Admin Portal Unavailable
            </h2>
            <p className="text-sm text-[#8C8C8C] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              The admin portal is currently disabled. Please contact the system administrator for access.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/auth"
            className="text-sm text-[#8C8C8C] hover:text-[#3B3B3B] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            ← Back to guest login
          </a>
        </div>
      </div>
    </div>
  );
}
