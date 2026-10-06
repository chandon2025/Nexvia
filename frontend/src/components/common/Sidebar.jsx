import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  LayoutDashboard,
  Settings,
  CloudSun,
  Layers,
  Sparkles,
  Repeat,
  FlaskConical,
  Activity,
  GitCompare,
  Map,
  Bot,
  Calendar,
  Leaf,
  ShieldAlert,
  FileSpreadsheet,
  GraduationCap,
  Database,
  Info,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { activePage, setActivePage, mode, t } = useApp();

  const navSections = [
    {
      group: "Core Workspace",
      group_bn: "মূল কর্মক্ষেত্র",
      items: [
        { id: 'landing', label: t('nav.landing'), icon: Home },
        { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { id: 'setup', label: t('nav.setup'), icon: Settings }
      ]
    },
    {
      group: "Earth & Soil Insights",
      group_bn: "পরিবেশ ও মাটি বিশ্লেষণ",
      items: [
        { id: 'climate', label: t('nav.climate'), icon: CloudSun },
        { id: 'soil', label: t('nav.soil'), icon: Layers },
        { id: 'map', label: t('nav.map'), icon: Map }
      ]
    },
    {
      group: "Rotation & Simulation",
      group_bn: "শস্যাবর্তন ও সিমুলেশন",
      items: [
        { id: 'crops', label: t('nav.crops'), icon: Sparkles },
        { id: 'builder', label: t('nav.builder'), icon: Repeat },
        { id: 'simulator', label: t('nav.simulator'), icon: Activity },
        { id: 'whatif', label: t('nav.whatif'), icon: FlaskConical },
        { id: 'comparison', label: t('nav.comparison'), icon: GitCompare }
      ]
    },
    {
      group: "Farm Operations & AI",
      group_bn: "খামার ব্যবস্থাপনা ও এআই",
      items: [
        { id: 'agroai', label: t('nav.agroai'), icon: Bot, badge: 'AI' },
        { id: 'calendar', label: t('nav.calendar'), icon: Calendar },
        { id: 'sustainability', label: t('nav.sustainability'), icon: Leaf },
        { id: 'risk', label: t('nav.risk'), icon: ShieldAlert }
      ]
    },
    {
      group: "Reports & Methodology",
      group_bn: "প্রতিবেদন ও তথ্যপ্রমাণ",
      items: [
        { id: 'report', label: t('nav.report'), icon: FileSpreadsheet, badge: 'PDF' },
        { id: 'learning', label: t('nav.learning'), icon: GraduationCap },
        { id: 'methodology', label: t('nav.methodology'), icon: Database },
        { id: 'about', label: t('nav.about'), icon: Info }
      ]
    }
  ];

  const handleSelect = (pageId) => {
    setActivePage(pageId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden no-print"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 overflow-y-auto transition-transform duration-300 ease-in-out no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          
          {/* Mode Pill Indicator */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Active Mode
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  mode === 'farmer'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}
              >
                {mode === 'farmer' ? '🌾 Farmer UX' : '🔬 Research UX'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {mode === 'farmer'
                ? 'Simplified icons, high-clarity language & practical actions.'
                : 'Advanced NASA indicators, multi-year trends & metrics.'}
            </p>
          </div>

          {/* Navigation Links Grouped */}
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {section.group}
              </h3>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-emerald-700 text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* NASA Footer attribution */}
          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-[10px] text-slate-400 font-medium">
              Data powered by NASA POWER & MERRA-2
            </p>
            <p className="text-[9px] text-slate-400">
              Decision support for climate-smart farming
            </p>
          </div>

        </div>
      </aside>
    </>
  );
}

