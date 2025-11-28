import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-2xl">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
          </div>
          MedKeep KSA
        </div>
        <button 
          onClick={onEnter}
          className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-full font-semibold transition-all"
        >
          الدخول للمنصة
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            مستقبل صيانة <br/>
            <span className="text-blue-300">الأجهزة الطبية</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            منصة ذكية مدعومة بأحدث تقنيات Gemini 2.5 & 3 Pro لتحليل الأعطال، 
            التنبؤ بالصيانة، وتقديم الدعم الفني الفوري.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button 
              onClick={onEnter}
              className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              ابدأ الآن
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white/5 backdrop-blur-lg border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1: Fast AI */}
          <div className="bg-white/10 p-8 rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
            <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-4 text-blue-900">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">استجابة فائقة السرعة</h3>
            <p className="text-blue-100">
              مدعوم بنموذج Gemini 2.5 Flash Lite لتقديم ردود فورية وتشخيصات سريعة للفنيين في الميدان.
            </p>
          </div>

          {/* Feature 2: Visual Analysis & Thinking */}
          <div className="bg-white/10 p-8 rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 text-white">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
               </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">تحليل بصري وتفكير عميق</h3>
            <p className="text-blue-100">
              استخدم Gemini 3 Pro لتحليل صور الأعطال وحل المشكلات المعقدة بقدرات تفكير متقدمة (Thinking Mode).
            </p>
          </div>

          {/* Feature 3: Search Grounding */}
          <div className="bg-white/10 p-8 rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
            <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center mb-4 text-white">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">بحث متصل ومحدث</h3>
            <p className="text-blue-100">
              ارتباط مباشر ببحث Google للحصول على أحدث أدلة الصيانة، أسعار قطع الغيار، ومعلومات المصنعين.
            </p>
          </div>

        </div>
      </div>
      
      <footer className="py-6 text-center text-blue-300 text-sm">
        © 2024 MedKeep KSA. Powered by Google Gemini API.
      </footer>
    </div>
  );
};
