import React, { useState, useEffect, useRef } from 'react';
import { createTechnicianChat, ChatMode } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from '@google/genai';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'مرحباً بك! أنا مساعدك الفني الذكي. كيف يمكنني مساعدتك في صيانة الأجهزة الطبية اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>('fast');
  const [groundingUrls, setGroundingUrls] = useState<Array<{title: string, uri: string}>>([]);
  
  // Use a ref to hold the chat instance so it doesn't reset on renders
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when mode or open state changes
  useEffect(() => {
    if (isOpen) {
      chatRef.current = createTechnicianChat(mode);
      // Reset history if we switch modes significantly? 
      // For now, let's keep history but the context might be weird if models switch capabilities.
      // Better to just recreate the chat instance for the new model.
    }
  }, [isOpen, mode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, groundingUrls]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setGroundingUrls([]); // Reset grounding for new message

    try {
      const response = await chatRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullText = "";
      const modelMsgId = (Date.now() + 1).toString();
      
      // Initialize model message
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: "...",
        timestamp: new Date()
      }]);

      for await (const chunk of response) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || "";
        fullText += text;

        // Check for grounding metadata (Google Search)
        if (c.candidates?.[0]?.groundingMetadata?.groundingChunks) {
          const chunks = c.candidates[0].groundingMetadata.groundingChunks;
          const urls = chunks
            .filter((c: any) => c.web?.uri)
            .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
          
          if (urls.length > 0) {
            setGroundingUrls(prev => {
              // Deduplicate
              const existing = new Set(prev.map(u => u.uri));
              const newUrls = urls.filter((u: any) => !existing.has(u.uri));
              return [...prev, ...newUrls];
            });
          }
        }
        
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId ? { ...msg, text: fullText } : msg
        ));
      }

    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'عذراً، حدث خطأ أثناء معالجة طلبك.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${isOpen ? 'bg-red-500 rotate-45' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
             <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-96 max-w-[90vw] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-t-2xl">
             <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">المساعد الذكي</h3>
                <p className="text-blue-100 text-xs">متصل الآن</p>
              </div>
             </div>
             
             {/* Mode Selection */}
             <div className="flex bg-blue-800/30 p-1 rounded-lg">
                <button 
                  onClick={() => setMode('fast')}
                  className={`flex-1 text-xs py-1.5 rounded-md transition-all ${mode === 'fast' ? 'bg-white text-blue-800 font-bold shadow-sm' : 'text-blue-100 hover:text-white'}`}
                >
                  سريع (Lite)
                </button>
                <button 
                  onClick={() => setMode('search')}
                  className={`flex-1 text-xs py-1.5 rounded-md transition-all ${mode === 'search' ? 'bg-white text-blue-800 font-bold shadow-sm' : 'text-blue-100 hover:text-white'}`}
                >
                  بحث (Search)
                </button>
                <button 
                  onClick={() => setMode('thinking')}
                  className={`flex-1 text-xs py-1.5 rounded-md transition-all ${mode === 'thinking' ? 'bg-white text-blue-800 font-bold shadow-sm' : 'text-blue-100 hover:text-white'}`}
                >
                  عميق (Thinking)
                </button>
             </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Grounding Sources */}
            {groundingUrls.length > 0 && (
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-600">
                <div className="font-bold mb-1">المصادر:</div>
                <ul className="list-disc list-inside space-y-1">
                  {groundingUrls.map((url, idx) => (
                    <li key={idx} className="truncate">
                      <a href={url.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {url.title || url.uri}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  mode === 'search' ? "ابحث عن قطع غيار، معلومات..." :
                  mode === 'thinking' ? "صف مشكلة معقدة..." :
                  "اكتب سؤالك هنا..."
                }
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                disabled={loading}
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`p-2 rounded-full ${loading || !input.trim() ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
