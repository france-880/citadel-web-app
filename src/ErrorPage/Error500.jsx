export default function Error500() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F7FB] via-[#FFEBEE] to-[#F6F7FB] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-40 w-72 h-72 bg-red-400 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-40 w-72 h-72 bg-[#064F32] opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center relative z-10 max-w-2xl mx-auto">
        {/* Large Error Code with decorative border */}
        <div className="relative mb-8 inline-block">
          <div 
            className="font-bold text-[#064F32] leading-none relative"
            style={{ fontSize: '280px', fontFamily: 'Arial, sans-serif' }}
          >
            500
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 border-8 border-red-400 border-dashed rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Internal Server Error
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            Something unexpected happened on our end. Don't worry, our team has been notified and is working on fixing the issue.
          </p>
        </div>

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mt-12">
          <div className="w-3 h-3 bg-red-400 rounded-full opacity-30"></div>
          <div className="w-3 h-3 bg-red-400 rounded-full opacity-50"></div>
          <div className="w-3 h-3 bg-red-400 rounded-full opacity-70"></div>
        </div>
      </div>
    </div>
  );
}

