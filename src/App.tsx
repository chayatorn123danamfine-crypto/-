/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewState, CrClResultData, RenalFormula } from './types';
import { HeaderBar } from './components/HeaderBar';
import { LoginScreen } from './components/LoginScreen';
import { MainMenu } from './components/MainMenu';
import { FormulaSelect } from './components/RenalDosing/FormulaSelect';
import { PatientInput } from './components/RenalDosing/PatientInput';
import { CrClResult } from './components/RenalDosing/CrClResult';
import { DrugSearch } from './components/RenalDosing/DrugSearch';
import { WeightMenu } from './components/WeightDosing/WeightMenu';
import { PediatricCalculator } from './components/WeightDosing/PediatricCalculator';
import { WarfarinAdjuster } from './components/WeightDosing/WarfarinAdjuster';
import { TBDosing } from './components/WeightDosing/TBDosing';
import { AdminDashboard } from './components/AdminDashboard';
import { KID_OTHER, KID_AB, KID_AV } from './data/weightDosing';
import { startUserSession, recordFunctionUsage } from './services/systemLogs';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [selectedFormula, setSelectedFormula] = useState<RenalFormula>('cg');
  const [crclData, setCrclData] = useState<CrClResultData | null>(null);
  const [pediatricWeight, setPediatricWeight] = useState<number>(0);

  // Synchronize green theme with weight-based pages
  useEffect(() => {
    const isWeight = currentView.startsWith('weight-');
    if (isWeight) {
      document.body.classList.add('green-theme');
    } else {
      document.body.classList.remove('green-theme');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('sukhothai_current_session');
    } catch {
      // ignore
    }
    setCurrentUser('');
    setCrclData(null);
    setCurrentView('login');
  };

  const handleLoginSuccess = (name: string) => {
    startUserSession(name);
    setCurrentUser(name);
    setCurrentView('menu');
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
  };

  const handleSelectFormula = (formula: RenalFormula) => {
    setSelectedFormula(formula);
    recordFunctionUsage(
      formula === 'cg' ? 'คำนวณค่า CrCl (Cockcroft-Gault)' : 'คำนวณค่า eGFR (CKD-EPI)'
    );
    setCurrentView('renal-input');
  };

  const handleCalculateCrCl = (result: CrClResultData) => {
    setCrclData(result);
    setCurrentView('renal-result');
  };

  const handleNewPatient = () => {
    setCrclData(null);
    setCurrentView('renal-formula-select');
  };

  const handleNavigateView = (view: ViewState, functionName?: string) => {
    if (functionName) {
      recordFunctionUsage(functionName);
    }
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-rose-200">
      <HeaderBar
        currentView={currentView}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigateHome={() => setCurrentView('menu')}
      />

      <main className="flex-1 pb-12">
        {currentView === 'login' && (
          <LoginScreen
            onSuccess={handleLoginSuccess}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard onBack={() => setCurrentView(currentUser ? 'menu' : 'login')} />
        )}

        {currentView === 'menu' && (
          <MainMenu
            onSelect={(v) => {
              if (v === 'renal-input') {
                handleNavigateView('renal-formula-select', 'ประเมินการทำงานของไต');
              } else if (v === 'weight-menu') {
                handleNavigateView('weight-menu', 'ระบบปรับขนาดยาตามน้ำหนัก');
              } else {
                handleNavigateView(v);
              }
            }}
          />
        )}

        {/* Renal Formula Choice */}
        {currentView === 'renal-formula-select' && (
          <FormulaSelect
            onSelectFormula={handleSelectFormula}
            onBack={() => setCurrentView('menu')}
          />
        )}

        {/* Renal Dosing Workflow */}
        {currentView === 'renal-input' && (
          <PatientInput
            formula={selectedFormula}
            initialData={crclData}
            onCalculate={handleCalculateCrCl}
            onBack={() => setCurrentView('renal-formula-select')}
          />
        )}

        {currentView === 'renal-result' && crclData && (
          <CrClResult
            data={crclData}
            onGoToDrugs={() => {
              recordFunctionUsage('ค้นหาปรับขนาดยาตามไต');
              setCurrentView('renal-drugs');
            }}
            onEditPatient={() => setCurrentView('renal-input')}
            onNewPatient={handleNewPatient}
          />
        )}

        {currentView === 'renal-drugs' && crclData && (
          <DrugSearch
            crcl={crclData.crcl}
            onBackToResult={() => setCurrentView('renal-result')}
            onNewPatient={handleNewPatient}
          />
        )}

        {/* Weight-based Dosing Workflow */}
        {currentView === 'weight-menu' && (
          <WeightMenu
            onSelect={(v) => {
              if (v === 'weight-kids') handleNavigateView('weight-kids', 'คำนวณขนาดยาเด็ก');
              else if (v === 'weight-antibiotics') handleNavigateView('weight-antibiotics', 'ปรับยา Antibiotics (เด็ก)');
              else if (v === 'weight-antiviral') handleNavigateView('weight-antiviral', 'ปรับยา Antiviral (เด็ก)');
              else if (v === 'weight-warfarin') handleNavigateView('weight-warfarin', 'ปรับยา Warfarin');
              else if (v === 'weight-tb') handleNavigateView('weight-tb', 'ปรับยา TB');
              else setCurrentView(v);
            }}
            onBackToMain={() => setCurrentView('menu')}
          />
        )}

        {currentView === 'weight-kids' && (
          <PediatricCalculator
            title="คำนวณขนาดยาเด็ก (General)"
            blocks={KID_OTHER}
            weight={pediatricWeight}
            onWeightChange={setPediatricWeight}
            placeholder="ค้นหายาเด็ก เช่น paracetamol, ibuprofen, cetirizine..."
            onBack={() => setCurrentView('weight-menu')}
          />
        )}

        {currentView === 'weight-antibiotics' && (
          <PediatricCalculator
            title="ปรับยา Antibiotics (เด็ก)"
            blocks={KID_AB}
            weight={pediatricWeight}
            onWeightChange={setPediatricWeight}
            placeholder="ค้นหา Antibiotics เช่น amoxicillin, augmentin, cefixime..."
            onBack={() => setCurrentView('weight-menu')}
          />
        )}

        {currentView === 'weight-antiviral' && (
          <PediatricCalculator
            title="ปรับยา Antiviral (เด็ก)"
            blocks={KID_AV}
            weight={pediatricWeight}
            onWeightChange={setPediatricWeight}
            placeholder="ค้นหา Antiviral เช่น tamiflu, acyclovir..."
            showSearch={false}
            onBack={() => setCurrentView('weight-menu')}
          />
        )}

        {currentView === 'weight-warfarin' && (
          <WarfarinAdjuster onBack={() => setCurrentView('weight-menu')} />
        )}

        {currentView === 'weight-tb' && (
          <TBDosing
            initialWeight={pediatricWeight}
            onBack={() => setCurrentView('weight-menu')}
          />
        )}
      </main>
    </div>
  );
}
