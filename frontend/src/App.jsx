import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// Views
import LandingView from './components/views/LandingView';
import DashboardView from './components/views/DashboardView';
import FarmSetupWizard from './components/views/FarmSetupWizard';
import ClimateAnalysisView from './components/views/ClimateAnalysisView';
import SoilHealthView from './components/views/SoilHealthView';
import CropExplorerView from './components/views/CropExplorerView';
import RotationBuilderView from './components/views/RotationBuilderView';
import RotationSimulatorView from './components/views/RotationSimulatorView';
import WhatIfSimulatorView from './components/views/WhatIfSimulatorView';
import StrategyComparisonView from './components/views/StrategyComparisonView';
import InteractiveMapView from './components/views/InteractiveMapView';
import AgroAIView from './components/views/AgroAIView';
import FarmCalendarView from './components/views/FarmCalendarView';
import SustainabilityView from './components/views/SustainabilityView';
import RiskCenterView from './components/views/RiskCenterView';
import FarmReportView from './components/views/FarmReportView';
import LearningCenterView from './components/views/LearningCenterView';
import DataMethodologyView from './components/views/DataMethodologyView';
import AboutView from './components/views/AboutView';

function MainLayout() {
  const { activePage, setActivePage, loading, t } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activePage) {
      case 'landing':
        return <LandingView />;
      case 'dashboard':
        return <DashboardView />;
      case 'setup':
        return <FarmSetupWizard />;
      case 'climate':
        return <ClimateAnalysisView />;
      case 'soil':
        return <SoilHealthView />;
      case 'crops':
        return <CropExplorerView />;
      case 'builder':
        return <RotationBuilderView />;
      case 'simulator':
        return <RotationSimulatorView />;
      case 'whatif':
        return <WhatIfSimulatorView />;
      case 'comparison':
        return <StrategyComparisonView />;
      case 'map':
        return <InteractiveMapView />;
      case 'agroai':
        return <AgroAIView />;
      case 'calendar':
        return <FarmCalendarView />;
      case 'sustainability':
        return <SustainabilityView />;
      case 'risk':
        return <RiskCenterView />;
      case 'report':
        return <FarmReportView />;
      case 'learning':
        return <LearningCenterView />;
      case 'methodology':
        return <DataMethodologyView />;
      case 'about':
        return <AboutView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Subtle Global Loading Bar */}
          {loading && (
            <div className="fixed top-16 left-0 right-0 z-50 h-1 bg-emerald-100 overflow-hidden no-print">
              <div className="h-full bg-emerald-600 animate-pulse w-full" />
            </div>
          )}

          {renderActiveView()}
        </main>
      </div>

      {/* Global Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">AgroResilience</span>
            <span>•</span>
            <span>NASA-Powered Smart Crop Rotation Advisor</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>NASA POWER • MERRA-2 • SMAP</span>
            <span>•</span>
            <button
              onClick={() => setActivePage('methodology')}
              className="hover:text-emerald-700 underline"
            >
              Data Methodology
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage('about')}
              className="hover:text-emerald-700 underline"
            >
              About Project
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
