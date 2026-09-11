import React, { useState, useMemo, useEffect } from "react";
import { Header, NavTabType } from "./components/Header";
import { FinancialStatementView } from "./components/FinancialStatementView";
import { JournalAndTrialBalanceEditor } from "./components/JournalAndTrialBalanceEditor";
import { LessonSummarizerView } from "./components/LessonSummarizerView";
import { AISAndERPSimulatorView } from "./components/AISAndERPSimulatorView";
import { AIAuditScannerView } from "./components/AIAuditScannerView";
import { FinancialDataAnalyticsView } from "./components/FinancialDataAnalyticsView";
import { DigitalAuditAndControlsView } from "./components/DigitalAuditAndControlsView";
import { CareerPortfolioAndInterviewView } from "./components/CareerPortfolioAndInterviewView";
import { AccountingCheatsheetModal } from "./components/AccountingCheatsheetModal";
import { DeveloperProfileModal } from "./components/DeveloperProfileModal";
import { BUSINESS_PRESETS } from "./data/presets";
import { AccountItem } from "./types/accounting";
import {
  Phone,
  Mail,
  MessageCircle,
  UserCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  computeIncomeStatement,
  computeBalanceSheet,
  computeFinancialRatios,
} from "./utils/financialCalculations";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>("statements");
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);

  // Dark Mode Theme Management
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("accustudent_theme");
      if (saved) return saved === "dark";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("accustudent_theme", "dark");
      } catch (e) {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("accustudent_theme", "light");
      } catch (e) {}
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const [currentPresetId, setCurrentPresetId] = useState<string>("it-service");
  const initialPreset = BUSINESS_PRESETS[0];

  // Try to load from localStorage if available, or fall back to preset
  const [accounts, setAccounts] = useState<AccountItem[]>(() => {
    try {
      const saved = localStorage.getItem("accustudent_accounts");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not read from localStorage", e);
    }
    return initialPreset.accounts;
  });

  const [businessName, setBusinessName] = useState<string>(() => {
    return localStorage.getItem("accustudent_bizname") || initialPreset.name;
  });

  const [period, setPeriod] = useState<string>(() => {
    return localStorage.getItem("accustudent_period") || initialPreset.period;
  });

  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem("accustudent_accounts", JSON.stringify(accounts));
      localStorage.setItem("accustudent_bizname", businessName);
      localStorage.setItem("accustudent_period", period);
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }, [accounts, businessName, period]);

  // Compute Income Statement
  const incomeStatement = useMemo(() => {
    return computeIncomeStatement(accounts, businessName, period);
  }, [accounts, businessName, period]);

  // Compute Balance Sheet with Net Profit automatically integrated into Equity
  const balanceSheet = useMemo(() => {
    return computeBalanceSheet(accounts, incomeStatement.netProfit, businessName, period);
  }, [accounts, incomeStatement.netProfit, businessName, period]);

  // Compute Financial Ratios
  const ratios = useMemo(() => {
    return computeFinancialRatios(incomeStatement, balanceSheet, accounts);
  }, [incomeStatement, balanceSheet, accounts]);

  // Handle Preset switch
  const handleSelectPreset = (presetId: string) => {
    const preset = BUSINESS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setCurrentPresetId(preset.id);
    setAccounts(preset.accounts);
    setBusinessName(preset.name);
    setPeriod(preset.period);
  };

  // Reset to current preset
  const handleResetToCurrentPreset = () => {
    const preset =
      BUSINESS_PRESETS.find((p) => p.id === currentPresetId) || BUSINESS_PRESETS[0];
    setAccounts(preset.accounts);
    setBusinessName(preset.name);
    setPeriod(preset.period);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-200">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        presets={BUSINESS_PRESETS}
        currentPresetId={currentPresetId}
        onSelectPreset={handleSelectPreset}
        onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
        onOpenDeveloperModal={() => setIsDeveloperModalOpen(true)}
        onReset={handleResetToCurrentPreset}
        isBalanced={balanceSheet.isBalanced}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Financial Statements */}
        {activeTab === "statements" && (
          <FinancialStatementView
            incomeStatement={incomeStatement}
            balanceSheet={balanceSheet}
            ratios={ratios}
            accounts={accounts}
          />
        )}

        {/* Tab 2: Journal & Trial Balance Editor */}
        {activeTab === "editor" && (
          <JournalAndTrialBalanceEditor
            accounts={accounts}
            onUpdateAccounts={setAccounts}
            businessName={businessName}
            onChangeBusinessName={setBusinessName}
            period={period}
            onChangePeriod={setPeriod}
            onResetToPreset={handleResetToCurrentPreset}
          />
        )}

        {/* Tab 3: AIS & ERP Simulation + SQL */}
        {activeTab === "erp" && <AISAndERPSimulatorView />}

        {/* Tab 4: AI Audit Scanner & Advanced Tutor */}
        {activeTab === "audit" && (
          <AIAuditScannerView
            accounts={accounts}
            incomeStatement={incomeStatement}
            balanceSheet={balanceSheet}
          />
        )}

        {/* Tab 5: Data Analytics & Power BI */}
        {activeTab === "analytics" && (
          <FinancialDataAnalyticsView
            incomeStatement={incomeStatement}
            balanceSheet={balanceSheet}
            financialRatios={ratios}
          />
        )}

        {/* Tab 6: IT Audit & Internal Controls */}
        {activeTab === "controls" && <DigitalAuditAndControlsView />}

        {/* Tab 7: Career Portfolio & Big 4 Interview */}
        {activeTab === "career" && <CareerPortfolioAndInterviewView />}

        {/* Tab 8: Lessons Summarizer */}
        {activeTab === "lessons" && <LessonSummarizerView />}
      </main>

      {/* Footer & Developer Section */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-6 pb-5 text-slate-600 dark:text-slate-400 print:hidden mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          {/* Developer Card Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-900/50">
            <div className="flex items-center space-x-3.5 w-full md:w-auto">
              <button
                onClick={() => setIsDeveloperModalOpen(true)}
                className="group relative shrink-0 focus:outline-none cursor-pointer"
                title="คลิกดูโปรไฟล์ผู้พัฒนา MR.T"
              >
                <img
                  src="/assets/images/mrt_app_logo.jpg"
                  alt="MR.T Logo"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-400 group-hover:scale-105 transition-transform shadow-xs"
                />
              </button>
              <div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-sm font-extrabold text-white">MR.T — Software Developer</span>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                    ระบบบัญชี | ภาษี | ธุรกิจ
                  </span>
                </div>
                <p className="text-xs text-indigo-200 font-medium line-clamp-1 sm:line-clamp-none mt-0.5">
                  ERP, ระบบคำนวณภาษีและจัดการรายรับ-รายจ่ายตามมาตรฐานสากล พร้อมช่วยให้ธุรกิจคุณเติบโตอย่างเป็นระบบ
                </p>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              <a
                href="tel:0612155870"
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/10 shadow-2xs"
                title="โทร 061-215-5870"
              >
                <Phone className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                <span>061-215-5870</span>
              </a>
              <a
                href="mailto:investorstar9966@gmail.com"
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/10 shadow-2xs"
                title="ส่งอีเมลถึงผู้พัฒนา"
              >
                <Mail className="w-3.5 h-3.5 mr-1.5 text-indigo-300" />
                <span className="hidden sm:inline">investorstar9966@gmail.com</span>
                <span className="sm:hidden">Email</span>
              </a>
              <button
                onClick={() => setIsDeveloperModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 text-xs font-extrabold shadow-xs transition-all cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 mr-1.5 text-slate-950" />
                <span>ดูโปรไฟล์ & สแกน LINE QR</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>
              AuditFlow © 2026 — เพื่อนคู่คิดของนักบัญชีและผู้ตรวจสอบภาษีมืออาชีพ โดย MR.T Software Developer
            </span>
            <span className="text-slate-400 dark:text-slate-500">
              มาตรฐาน TFRS for NPAEs & PAEs • สภาวิชาชีพบัญชี ในพระบรมราชูปถัมภ์ (TFAC)
            </span>
          </div>
        </div>
      </footer>

      {/* Developer Profile Modal */}
      <DeveloperProfileModal
        isOpen={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
      />

      {/* Cheatsheet Reference Modal */}
      <AccountingCheatsheetModal
        isOpen={isCheatsheetOpen}
        onClose={() => setIsCheatsheetOpen(false)}
      />
    </div>
  );
}

