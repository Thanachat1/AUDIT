import React from "react";
import {
  Calculator,
  BookOpen,
  RotateCcw,
  Sparkles,
  Printer,
  Building2,
  FileSpreadsheet,
  Server,
  ShieldAlert,
  BarChart3,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Moon,
  Sun,
} from "lucide-react";
import { BusinessPreset } from "../data/presets";

export type NavTabType =
  | "statements"
  | "editor"
  | "erp"
  | "audit"
  | "analytics"
  | "controls"
  | "career"
  | "lessons";

interface HeaderProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  presets: BusinessPreset[];
  currentPresetId: string;
  onSelectPreset: (presetId: string) => void;
  onOpenCheatsheet: () => void;
  onOpenDeveloperModal: () => void;
  onReset: () => void;
  isBalanced: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  presets,
  currentPresetId,
  onSelectPreset,
  onOpenCheatsheet,
  onOpenDeveloperModal,
  onReset,
  isBalanced,
  isDarkMode = false,
  onToggleTheme,
}) => {
  return (
    <header id="app-header" className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Brand & Identity with New MR.T Logo & Caption */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenDeveloperModal}
              title="ดูโปรไฟล์และติดต่อผู้พัฒนา MR.T"
              className="relative group shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl"
            >
              <img
                src="/assets/images/mrt_app_logo.jpg"
                alt="MR.T App Logo"
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-xl object-cover shadow-sm ring-2 ring-indigo-200 dark:ring-indigo-700/50 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </button>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
                  AuditFlow
                  <span className="ml-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                    by MR.T
                  </span>
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                  เพื่อนคู่คิดของนักบัญชีและผู้ตรวจสอบภาษีมืออาชีพ
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Smart Audit ตรวจสอบงบ • Tax Precision คำนวณภาษีแม่นยำ • Seamless Workflow จัดการงานตรวจบัญชีอย่างเป็นระบบ
              </p>
            </div>
          </div>

          {/* Business Preset Selector & Quick Tools */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Theme Toggle Button (Dark / Light Mode) */}
            {onToggleTheme && (
              <button
                id="header-theme-toggle-btn"
                onClick={onToggleTheme}
                title={isDarkMode ? "สลับเป็นโหมดสว่าง (Light Mode)" : "สลับเป็นโหมดมืด (Dark Mode)"}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700 shadow-xs transition-all cursor-pointer"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">โหมดสว่าง</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden sm:inline">โหมดมืด</span>
                  </>
                )}
              </button>
            )}

            {/* Developer Contact Quick Action Button */}
            <button
              id="header-contact-dev-btn"
              onClick={onOpenDeveloperModal}
              title="ข้อมูลผู้พัฒนาและช่องทางติดต่อ MR.T"
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-lg shadow-xs transition-all ring-1 ring-indigo-400/40 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1.5" />
              <span>ติดต่อผู้พัฒนา MR.T</span>
            </button>

            <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
              <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-1.5" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 hidden sm:inline">
                กรณีศึกษา:
              </span>
              <select
                id="preset-select"
                aria-label="เลือกกรณีศึกษาสำหรับงบการเงิน"
                value={currentPresetId}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md py-1 px-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name.length > 35 ? p.name.substring(0, 35) + "..." : p.name} ({p.type === "service" ? "บริการไอที" : "ซื้อมาขายไป"})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Cheatsheet Button */}
            <button
              id="open-cheatsheet-btn"
              onClick={onOpenCheatsheet}
              title="คลังสูตรและผังบัญชี 5 หมวด"
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-500 dark:text-indigo-400" />
              <span>คลังสูตร & ผังบัญชี</span>
            </button>

            {/* Print Button */}
            <button
              id="print-statement-btn"
              onClick={() => window.print()}
              title="พิมพ์รายงาน"
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 mr-1 text-slate-600 dark:text-slate-400" />
              <span className="hidden sm:inline">พิมพ์</span>
            </button>

            {/* Reset Button */}
            <button
              id="reset-data-btn"
              onClick={onReset}
              title="รีเซ็ตยอดกลับสู่ค่าเริ่มต้นของโจทย์"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs with Modern Animated Pills */}
        <nav id="header-nav-bar" className="flex space-x-1.5 border-t border-slate-100 dark:border-slate-800 pt-2 pb-1 -mb-px overflow-x-auto no-scrollbar text-xs">
          {/* Tab 1: Financial Statements */}
          <button
            id="nav-statements-tab"
            onClick={() => setActiveTab("statements")}
            className={`tab-pill flex items-center py-2 px-3.5 rounded-xl whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === "statements"
                ? "bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white font-bold shadow-md shadow-indigo-500/25 scale-[1.02]"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
            งบการเงินอัตโนมัติ
            <span
              className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                activeTab === "statements"
                  ? "bg-white/20 text-white border-white/30 backdrop-blur-xs"
                  : isBalanced
                  ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  : "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              }`}
            >
              {isBalanced ? "ดุลแล้ว ✓" : "ยังไม่ดุล !"}
            </span>
          </button>

          {/* Tab 2: Journal & Trial Balance Editor */}
          <button
            id="nav-editor-tab"
            onClick={() => setActiveTab("editor")}
            className={`tab-pill flex items-center py-2 px-3.5 rounded-xl whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === "editor"
                ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold shadow-md shadow-emerald-500/25 scale-[1.02]"
                : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
            }`}
          >
            <Calculator className={`w-3.5 h-3.5 mr-1.5 ${activeTab === "editor" ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
            สมุดรายวัน & งบทดลอง
          </button>

          {/* Tab 3: AIS & ERP Simulation + SQL */}
          <button
            id="nav-erp-tab"
            onClick={() => setActiveTab("erp")}
            className={`tab-pill flex items-center py-2 px-3.5 rounded-xl whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === "erp"
                ? "bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white font-bold shadow-md shadow-indigo-500/25 scale-[1.02]"
                : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
            }`}
          >
            <Server className={`w-3.5 h-3.5 mr-1.5 ${activeTab === "erp" ? "text-white" : "text-indigo-600 dark:text-indigo-400"}`} />
            ระบบ ERP & SQL บัญชี
          </button>

          {/* Tab 4: AI Audit Scanner & Advanced Tutor */}
          <button
            id="nav-audit-tab"
            onClick={() => setActiveTab("audit")}
            className={`tab-pill flex items-center py-2 px-3.5 rounded-xl whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === "audit"
                ? "bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white font-bold shadow-md shadow-rose-500/25 scale-[1.02]"
                : "text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
            }`}
          >
            <ShieldAlert className={`w-3.5 h-3.5 mr-1.5 ${activeTab === "audit" ? "text-white" : "text-rose-600 dark:text-rose-400"}`} />
            AI ตรวจงบ & ติวเตอร์
          </button>

          {/* Tab 5: Data Analytics & Power BI */}
          <button
            id="nav-analytics-tab"
            onClick={() => setActiveTab("analytics")}
            className={`tab-pill flex items-center py-2 px-3.5 rounded-xl whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white font-bold shadow-md shadow-blue-500/25 scale-[1.02]"
                : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
            }`}
          >
            <BarChart3 className={`w-3.5 h-3.5 mr-1.5 ${activeTab === "analytics" ? "text-white" : "text-blue-600 dark:text-blue-400"}`} />
            Data Analytics & BI
          </button>

          {/* Tab 6: IT Audit & Internal Controls */}
          <button
            id="nav-controls-tab"
            onClick={() => setActiveTab("controls")}
            className={`tab-pill flex items-center py-2 px-3.5 rounded-xl whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === "controls"
                ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-bold shadow-md shadow-purple-500/25 scale-[1.02]"
                : "text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 mr-1.5 ${activeTab === "controls" ? "text-white" : "text-purple-600 dark:text-purple-400"}`} />
            IT Audit & ตรวจจับทุจริต
          </button>

          {/* Tab 7: Career Portfolio & Big 4 Interview */}
          <button
            id="nav-career-tab"
            onClick={() => setActiveTab("career")}
            className={`tab-pill flex items-center py-2 px-3.5 rounded-xl whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === "career"
                ? "bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white font-bold shadow-md shadow-teal-500/25 scale-[1.02]"
                : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
            }`}
          >
            <Briefcase className={`w-3.5 h-3.5 mr-1.5 ${activeTab === "career" ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
            Portfolio & สัมภาษณ์งาน
          </button>

          {/* Tab 8: Lessons Summarizer */}
          <button
            id="nav-lessons-tab"
            onClick={() => setActiveTab("lessons")}
            className={`tab-pill flex items-center py-2 px-3.5 rounded-xl whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === "lessons"
                ? "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-bold shadow-md shadow-amber-500/25 scale-[1.02]"
                : "text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 mr-1.5 ${activeTab === "lessons" ? "text-white" : "text-amber-600 dark:text-amber-400"}`} />
            สรุปบทเรียน
          </button>
        </nav>
      </div>
    </header>
  );
};

