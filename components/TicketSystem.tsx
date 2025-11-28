import React, { useState } from 'react';
import { Ticket, TicketPriority, Equipment } from '../types';
import { analyzeTicketIssue } from '../services/geminiService';

interface TicketSystemProps {
  tickets: Ticket[];
  equipment: Equipment[];
  onAddTicket: (ticket: Ticket) => void;
}

export const TicketSystem: React.FC<TicketSystemProps> = ({ tickets, equipment, onAddTicket }) => {
  const [showForm, setShowForm] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  
  // Form State
  const [selectedEq, setSelectedEq] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.Medium);
  const [useThinking, setUseThinking] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        setSelectedImage(base64Data);
        setImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEq || !title || !description) return;

    setLoadingAnalysis(true);

    const device = equipment.find(e => e.id === selectedEq);
    const deviceName = device ? device.name : 'Unknown Device';

    // Use Gemini to analyze the issue
    const analysis = await analyzeTicketIssue(
      title, 
      description, 
      deviceName,
      {
        useThinking,
        image: selectedImage || undefined,
        mimeType: imageMimeType || undefined
      }
    );

    const newTicket: Ticket = {
      id: `TCK-${Math.floor(Math.random() * 10000)}`,
      equipmentId: selectedEq,
      title,
      description,
      reportedBy: 'المستخدم الحالي',
      dateCreated: new Date().toISOString().split('T')[0],
      priority,
      status: 'OPEN',
      aiAnalysis: analysis
    };

    onAddTicket(newTicket);
    setLoadingAnalysis(false);
    setShowForm(false);
    
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedEq('');
    setPriority(TicketPriority.Medium);
    setUseThinking(false);
    setSelectedImage(null);
    setImageMimeType(null);
  };

  const getPriorityColor = (p: TicketPriority) => {
    switch (p) {
      case TicketPriority.Critical: return 'text-red-600 bg-red-50 ring-red-500/10';
      case TicketPriority.High: return 'text-orange-600 bg-orange-50 ring-orange-500/10';
      case TicketPriority.Medium: return 'text-yellow-600 bg-yellow-50 ring-yellow-500/10';
      case TicketPriority.Low: return 'text-green-600 bg-green-50 ring-green-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">نظام بلاغات الأعطال</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          بلاغ جديد
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 animate-fade-in mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">تفاصيل البلاغ الجديد</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الجهاز</label>
                <select 
                  className="w-full rounded-lg border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedEq}
                  onChange={(e) => setSelectedEq(e.target.value)}
                  required
                >
                  <option value="">اختر الجهاز...</option>
                  {equipment.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name} - {eq.serialNumber}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الأولوية</label>
                <select 
                  className="w-full rounded-lg border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                >
                  <option value={TicketPriority.Low}>منخفضة</option>
                  <option value={TicketPriority.Medium}>متوسطة</option>
                  <option value={TicketPriority.High}>عالية</option>
                  <option value={TicketPriority.Critical}>حرجة جداً</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المشكلة</label>
              <input 
                type="text" 
                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="مثال: صوت غريب من المحرك"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">وصف تفصيلي</label>
              <textarea 
                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="صف المشكلة بدقة لمساعدة الذكاء الاصطناعي في التحليل..."
              ></textarea>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-2">
              <h4 className="text-sm font-bold text-gray-700 mb-2">إعدادات التحليل الذكي</h4>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                
                {/* Image Upload */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                     إرفاق صورة (لتحليل دقيق)
                  </label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* Thinking Mode Toggle */}
                <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                  <input 
                    type="checkbox" 
                    id="useThinking"
                    checked={useThinking}
                    onChange={(e) => setUseThinking(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="useThinking" className="text-sm text-indigo-900 font-medium cursor-pointer">
                    تفعيل التفكير العميق (Gemini 3 Pro)
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button 
                type="submit" 
                disabled={loadingAnalysis}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loadingAnalysis ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                     جاري التحليل...
                  </>
                ) : 'حفظ وتحليل'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {tickets.map((ticket) => {
          const eq = equipment.find(e => e.id === ticket.equipmentId);
          return (
            <div key={ticket.id} className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ring-1 ring-inset ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className="text-gray-400 text-xs">#{ticket.id}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">{ticket.title}</h3>
                </div>
                <div className="text-left">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    ticket.status === 'OPEN' ? 'bg-red-100 text-red-800' : 
                    ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status === 'OPEN' ? 'مفتوح' : ticket.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : 'مكتمل'}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                 <p className="text-gray-600 text-sm mb-2">{ticket.description}</p>
                 <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{eq?.name}</span>
                    <span className="mx-1">•</span>
                    <span>{eq?.location}</span>
                 </div>
              </div>

              {ticket.aiAnalysis && (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-3">
                  <div className="flex items-center gap-2 mb-2 text-indigo-800 font-semibold text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    تحليل الذكاء الاصطناعي
                  </div>
                  <p className="text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap">
                    {ticket.aiAnalysis}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
