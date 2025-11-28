import React, { useState } from 'react';
import { Equipment, DeviceStatus } from '../types';
import { checkDeviceDatabase, DatabaseCheckResult } from '../services/geminiService';

interface EquipmentListProps {
  equipment: Equipment[];
  onSelect: (eq: Equipment) => void;
}

export const EquipmentList: React.FC<EquipmentListProps> = ({ equipment, onSelect }) => {
  const [search, setSearch] = useState('');
  
  // Database Check State
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [dbResult, setDbResult] = useState<DatabaseCheckResult | null>(null);
  const [showDbModal, setShowDbModal] = useState(false);
  const [selectedDeviceName, setSelectedDeviceName] = useState('');

  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case DeviceStatus.Operational: return <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-bold">يعمل</span>;
      case DeviceStatus.MaintenanceRequired: return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-bold">صيانة مطلوبة</span>;
      case DeviceStatus.OutOfOrder: return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">معطل</span>;
      case DeviceStatus.UnderRepair: return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">تحت الإصلاح</span>;
    }
  };

  const handleDatabaseCheck = async (eq: Equipment) => {
    setCheckingId(eq.id);
    setSelectedDeviceName(eq.name);
    setShowDbModal(true);
    setDbResult(null);

    const result = await checkDeviceDatabase(eq.name, eq.serialNumber);
    setDbResult(result);
    setCheckingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">سجل الأجهزة الطبية</h2>
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="بحث (الاسم، الرقم التسلسلي، الموقع)..." 
            className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none pr-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-6 py-3 font-medium">الجهاز</th>
              <th className="px-6 py-3 font-medium">القسم / الموقع</th>
              <th className="px-6 py-3 font-medium">الحالة</th>
              <th className="px-6 py-3 font-medium">قاعدة البيانات (SFDA)</th>
              <th className="px-6 py-3 font-medium">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {filteredEquipment.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover bg-gray-200" />
                    <div>
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-gray-500 text-xs">{item.serialNumber}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>{item.department}</div>
                  <div className="text-gray-500 text-xs">{item.location}</div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleDatabaseCheck(item)}
                    className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition-colors text-xs font-semibold flex items-center gap-1 border border-emerald-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    التحقق من الهيئة
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onSelect(item)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors text-xs font-semibold"
                  >
                    تفاصيل
                  </button>
                </td>
              </tr>
            ))}
            {filteredEquipment.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  لا توجد نتائج مطابقة للبحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Database Result Modal */}
      {showDbModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-gray-800">بيانات الجهاز (SFDA)</h3>
                   <p className="text-sm text-gray-500">{selectedDeviceName}</p>
                 </div>
              </div>
              <button 
                onClick={() => setShowDbModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {!dbResult && checkingId ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                  <p className="text-gray-600 font-medium animate-pulse">جاري البحث في قاعدة البيانات والتحقق من الهيئة...</p>
                  <p className="text-xs text-gray-400 mt-2">يتم الآن جلب بيانات المواصفات وحالة التسجيل</p>
                </div>
              ) : dbResult ? (
                <div className="space-y-6">
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                     <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        ملخص البحث والتحقق
                     </h4>
                     <div className="prose prose-sm max-w-none text-emerald-900 leading-relaxed whitespace-pre-wrap">
                        {dbResult.text}
                     </div>
                  </div>

                  {dbResult.sources.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <h5 className="text-sm font-bold text-gray-700 mb-3">المصادر والسجلات المرجعية:</h5>
                      <ul className="grid grid-cols-1 gap-2">
                        {dbResult.sources.map((source, idx) => (
                          <li key={idx}>
                            <a 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{source.title}</p>
                                <p className="text-xs text-gray-500 truncate">{source.uri}</p>
                              </div>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
              <button 
                onClick={() => setShowDbModal(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};