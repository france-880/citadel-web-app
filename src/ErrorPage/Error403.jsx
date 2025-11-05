export default function Error403() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F7FB] via-[#FFF3E0] to-[#F6F7FB] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#FF7A00] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#064F32] opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center relative z-10 max-w-2xl mx-auto">
        {/* Large Error Code with decorative border */}
        <div className="relative mb-8 inline-block">
          <div 
            className="font-bold text-[#064F32] leading-none relative"
            style={{ fontSize: '280px', fontFamily: 'Arial, sans-serif' }}
          >
            403
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 border-8 border-[#FF7A00] border-dashed rounded-full opacity-20 rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Access Forbidden
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            Sorry, but you don't have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mt-12">
          <div className="w-3 h-3 bg-[#FF7A00] rounded-full opacity-30"></div>
          <div className="w-3 h-3 bg-[#FF7A00] rounded-full opacity-50"></div>
          <div className="w-3 h-3 bg-[#FF7A00] rounded-full opacity-70"></div>
        </div>
      </div>
    </div>
  );
}

