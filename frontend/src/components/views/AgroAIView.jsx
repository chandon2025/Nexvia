import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { queryAgroAIApi } from '../../services/api';
import {
  Bot,
  Send,
  Sparkles,
  Layers,
  HelpCircle,
  Sprout,
  Compass,
  ArrowRight,
  FlaskConical,
  MessageSquare
} from 'lucide-react';

export default function AgroAIView() {
  const { farmData, climateData, language, setActivePage } = useApp();

  const [inputQuestion, setInputQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      question: "Welcome to AgroAI",
      simple_answer: language === 'bn'
        ? `স্বাগতম! আমি আপনার খামারের (${farmData.location_name}) মাটির ধরণ ও নাসার জলবায়ু উপাত্ত বিশ্লেষণ করে উত্তর দেওয়ার জন্য প্রস্তুত। আপনি নিচের যে কোনো প্রশ্ন বেছে নিতে পারেন বা নিজস্ব প্রশ্ন টাইপ করতে পারেন।`
        : `Welcome! I am AgroAI. I synthesize your farm's soil profile in ${farmData.location_name} with NASA Earth observations to provide actionable, explainable advice. Ask me anything or select a prompt below!`,
      detailed_explanation: language === 'bn'
        ? `এগ্রো-এআই প্রাকৃতিক ভাষা প্রক্রিয়াকরণ এবং কৃষিবিজ্ঞানের সমন্বয়ে কাজ করে। এটি ফসল শস্যাবর্তন, ভূগর্ভস্থ পানি সংরক্ষণ এবং মাটির উর্বরতা রক্ষার সর্বোত্তম বৈজ্ঞানিক উপায় ব্যাখ্যা করে।`
        : `AgroAI grounds every response in your farm's active agroecological parameters: soil texture (${farmData.soil_type}), regional precipitation (${climateData?.indicators?.annual_rainfall_mm || 1400}mm), and NASA SMAP root-zone moisture indices.`,
      relevant_crops: ["rice", "lentil", "mustard"]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [answerViewMode, setAnswerViewMode] = useState("simple"); // "simple" or "detailed"

  const presetQuestions = language === 'bn' ? [
    "পরবর্তী মৌসুমে কোন ফসল চাষ করা উচিত?",
    "কোন শস্যাবর্তন মাটির স্বাস্থ্য সবচেয়ে ভালো করবে?",
    "শুষ্ক মৌসুমে কীভাবে সেচের পানি সাশ্রয় করব?",
    "বৃষ্টিপাত ২০% কমে গেলে কী করণীয়?",
    "সিস্টেম কেন এই শস্যাবর্তনটি সুপারিশ করেছে?",
    "কোন ফসলগুলো তীব্র খরা সহনশীল?"
  ] : [
    "Which crop should I plant next?",
    "Which rotation can improve soil health?",
    "How can I save water in dry season?",
    "What happens if rainfall decreases by 20%?",
    "Why did the system recommend this rotation?",
    "Which crop is more drought tolerant?"
  ];

  const handleAsk = async (qText) => {
    const q = qText || inputQuestion;
    if (!q.trim()) return;

    setLoading(true);
    setInputQuestion("");

    const farmContext = {
      location_name: farmData.location_name,
      soil_type: farmData.soil_type,
      water_availability: farmData.water_availability,
      priorities: farmData.farmer_priorities,
      climate: climateData
    };

    const res = await queryAgroAIApi({
      question: q,
      farm_context: farmContext,
      language: language
    });

    setMessages(prev => [...prev, { sender: "ai", ...res }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 pb-20 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <Bot className="w-3.5 h-3.5" />
            <span>Context-Aware Agricultural Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            AgroAI Decision Assistant
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Ask any question about your rotation, soil restoration, water budget, or NASA satellite charts.
          </p>
        </div>

        {/* Answer Format Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setAnswerViewMode('simple')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              answerViewMode === 'simple' ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🌾 Simple Farmer Answer
          </button>
          <button
            onClick={() => setAnswerViewMode('detailed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              answerViewMode === 'detailed' ? 'bg-indigo-100 text-indigo-900' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🔬 Scientific Explanation
          </button>
        </div>
      </div>

      {/* Preset Question Chips */}
      <div className="flex flex-wrap gap-2">
        {presetQuestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(prompt)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold border border-slate-200/90 shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="space-y-4 min-h-[350px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    {msg.question}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Grounded in {farmData.location_name} • {farmData.soil_type} Soil
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                answerViewMode === 'simple' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
              }`}>
                {answerViewMode === 'simple' ? '🌾 Farmer View' : '🔬 Research View'}
              </span>
            </div>

            {/* Answer Content */}
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {answerViewMode === 'simple' ? (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 font-medium">
                  {msg.simple_answer}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 font-mono text-xs leading-relaxed text-indigo-950">
                  {msg.detailed_explanation}
                </div>
              )}
            </div>

            {/* Relevant Crop Badges */}
            {msg.relevant_crops && msg.relevant_crops.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400">Suggested Crops:</span>
                <div className="flex flex-wrap gap-1.5">
                  {msg.relevant_crops.map((cId) => (
                    <button
                      key={cId}
                      onClick={() => setActivePage('crops')}
                      className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors uppercase"
                    >
                      {cId}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center text-xs text-slate-500 animate-pulse">
            AgroAI is consulting NASA agroclimatology models and soil microbiology...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="flex gap-2 sticky bottom-4 z-20"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask AgroAI anything about crops, soil health, water, or NASA graphs..."
          className="flex-1 px-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm shadow-md focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </form>

    </div>
  );
}

