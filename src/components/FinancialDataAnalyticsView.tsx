import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  BookOpen,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { IncomeStatementData, BalanceSheetData, FinancialRatio } from "../types/accounting";
import { BI_MEASURES } from "../data/advancedAccountingData";

interface FinancialDataAnalyticsViewProps {
  incomeStatement: IncomeStatementData;
  balanceSheet: BalanceSheetData;
  financialRatios: FinancialRatio[];
}

export const FinancialDataAnalyticsView: React.FC<FinancialDataAnalyticsViewProps> = ({
  incomeStatement,
  balanceSheet,
  financialRatios,
}) => {
  const [viewMode, setViewMode] = useState<"executive" | "analyst">("executive");
  const [activeTab, setActiveTab] = useState<"dashboard" | "dax" | "modeling">("dashboard");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Key Financial Figures from real statements
  const totalRevenue = incomeStatement.totalRevenues || 1;
  const grossProfit = incomeStatement.grossProfit || 0;
  const netProfit = incomeStatement.netProfit || 0;
  const totalOperatingExpenses = incomeStatement.totalOperatingExpenses || 0;
  const totalAssets = balanceSheet.totalAssets || 1;
  const totalEquity = balanceSheet.totalEquity || 1;
  const currentAssets = balanceSheet.totalCurrentAssets || 0;
  const currentLiabilities = balanceSheet.totalCurrentLiabilities || 1;

  // Calculated Metrics
  const grossMarginPct = ((grossProfit / totalRevenue) * 100).toFixed(1);
  const netMarginPct = ((netProfit / totalRevenue) * 100).toFixed(1);
  const currentRatio = (currentAssets / currentLiabilities).toFixed(2);
  const quickAssets = currentAssets - 0; // rough quick assets
  const quickRatio = (quickAssets / currentLiabilities).toFixed(2);

  // DuPont Analysis Breakdown
  const profitMargin = netProfit / totalRevenue;
  const assetTurnover = totalRevenue / totalAssets;
  const equityMultiplier = totalAssets / (totalEquity <= 0 ? 1 : totalEquity);
  const roe = (profitMargin * assetTurnover * equityMultiplier * 100).toFixed(2);

  // Monthly burn estimate (operating expenses / 12)
  const monthlyExpense = totalOperatingExpenses > 0 ? totalOperatingExpenses / 12 : 50000;
  const cashRunwayMonths = (currentAssets / monthlyExpense).toFixed(1);

  // Copy helper for DAX formulas
  const handleCopyFormula = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Financial BI Analytics Team Image */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-blue-900/40">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-72 xl:w-80 shrink-0 relative group">
            <img
              src="/assets/images/financial_bi_analytics.jpg"
              alt="ทีมงานวิเคราะห์ข้อมูลทางการเงินและ Business Intelligence"
              referrerPolicy="no-referrer"
              className="w-full h-44 sm:h-48 object-cover rounded-xl shadow-lg ring-2 ring-blue-400/30 transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/images/mrt_app_logo.jpg";
              }}
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-[11px] font-bold text-blue-300 border border-blue-500/30 flex items-center gap-1.5 shadow-sm">
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Power BI & Data Science</span>
            </div>
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <BarChart3 className="w-3.5 h-3.5 mr-1" />
                  การวิเคราะห์ข้อมูลทางการบัญชีและการสร้างภาพข้อมูล (Data Analytics for Accounting)
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Power BI & Tableau Simulation & แดชบอร์ดผู้บริหารแบบโต้ตอบ
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  เปลี่ยนงบการเงินตัวเลขล้วนให้เป็น Business Intelligence Dashboard: วิเคราะห์ DuPont ROE, กระแสเงินสด Runway, และคลังสูตร DAX Measures พร้อมใช้ในงานจริง
                </p>
              </div>

              <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 shrink-0 self-start sm:self-center">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                    activeTab === "dashboard"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5 mr-1.5" />
                  แดชบอร์ด
                </button>
                <button
                  onClick={() => setActiveTab("dax")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                    activeTab === "dax"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  สูตร DAX
                </button>
                <button
                  onClick={() => setActiveTab("modeling")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                    activeTab === "modeling"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 mr-1.5" />
                  Data Model
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300">
                DuPont ROE Visualizer
              </span>
              <span className="bg-blue-900/50 px-2.5 py-1 rounded-lg border border-blue-700/40 text-blue-200">
                Cash Runway Forecast
              </span>
              <span className="bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-700/40 text-emerald-300">
                Star Schema Architecture
              </span>
            </div>
          </div>
        </div>
      </div>

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Controls Bar: View Mode Switch */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">มุมมองการนำเสนอ:</span>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("executive")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === "executive"
                      ? "bg-white text-indigo-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  มุมมองผู้บริหาร (C-Level Summary)
                </button>
                <button
                  onClick={() => setViewMode("analyst")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === "analyst"
                      ? "bg-white text-indigo-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  มุมมองนักวิเคราะห์การเงิน (Deep Financial Analyst)
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              กิจการ: <strong className="text-slate-900">{incomeStatement.businessName}</strong> | งวด: {incomeStatement.period}
            </div>
          </div>

          {/* Key Executive KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Revenue */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>รายได้รวม (Total Revenue)</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">
                ฿{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-emerald-600 flex items-center font-medium">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                อัตรากำไรขั้นต้น {grossMarginPct}%
              </div>
            </div>

            {/* Card 2: Net Profit */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>กำไรสุทธิ (Net Profit)</span>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <div
                className={`text-lg font-bold font-mono ${
                  netProfit >= 0 ? "text-indigo-700" : "text-rose-600"
                }`}
              >
                ฿{netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Net Margin: <strong className="text-slate-800">{netMarginPct}%</strong>
              </div>
            </div>

            {/* Card 3: Quick Ratio / Liquidity */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>อัตราส่วนสภาพคล่องเร็ว (Quick Ratio)</span>
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {quickRatio} <span className="text-xs font-normal text-slate-500">เท่า</span>
              </div>
              <div className="text-[11px] text-emerald-600 flex items-center font-medium">
                <ShieldCheck className="w-3.5 h-3.5 mr-0.5" />
                {parseFloat(quickRatio) >= 1.0 ? "สภาพคล่องดีเยี่ยม (≥ 1.0)" : "ควรระวังเงินสดตึงตัว"}
              </div>
            </div>

            {/* Card 4: Cash Runway */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>กระแสเงินสดสำรอง (Cash Runway)</span>
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">
                ~{cashRunwayMonths} <span className="text-xs font-normal text-slate-500">เดือน</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                รองรับค่าใช้จ่ายรายเดือน {monthlyExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })} บ./ด.
              </div>
            </div>
          </div>

          {/* DuPont Analysis Interactive Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center">
                  <Activity className="w-4 h-4 text-indigo-600 mr-2" />
                  การวิเคราะห์ดูปองท์ (DuPont Framework: ROE Decomposition)
                </h3>
                <p className="text-xs text-slate-500">
                  เครื่องมือที่นักวิเคราะห์และ CFO ใช้เจาะลึกที่มาของอัตราผลตอบแทนต่อส่วนของผู้ถือหุ้น (ROE = {roe}%)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                ROE รวม: {roe}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Component 1: Net Profit Margin */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>1. อัตรากำไรสุทธิ (Profit Margin)</span>
                  <span className="text-indigo-600">{(profitMargin * 100).toFixed(1)}%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  ความสามารถในการทำกำไรจากทุก 100 บาทของยอดขาย (กำไรสุทธิ ÷ ยอดขาย)
                </p>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(Math.max(profitMargin * 100, 5), 100)}%` }}
                  />
                </div>
              </div>

              {/* Component 2: Asset Turnover */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>2. ประสิทธิภาพการใช้สินทรัพย์ (Asset Turnover)</span>
                  <span className="text-emerald-600">{assetTurnover.toFixed(2)}x</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  สินทรัพย์ 1 บาท สร้างยอดขายได้กี่บาทต่อปี (ยอดขาย ÷ สินทรัพย์รวม)
                </p>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(Math.max(assetTurnover * 30, 10), 100)}%` }}
                  />
                </div>
              </div>

              {/* Component 3: Financial Leverage / Equity Multiplier */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>3. ตัวคูณส่วนของเจ้าของ (Financial Leverage)</span>
                  <span className="text-blue-600">{equityMultiplier.toFixed(2)}x</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  ระดับการพึ่งพาหนี้สินเพื่อขยายสินทรัพย์ (สินทรัพย์รวม ÷ ส่วนของเจ้าของ)
                </p>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(Math.max(equityMultiplier * 25, 10), 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
              <span>
                💡 <strong>ข้อสรุปเชิงวิเคราะห์:</strong> ROE ของกิจการนี้ขับเคลื่อนหลักโดย{" "}
                {profitMargin > 0.15 ? "อัตรากำไรที่แข็งแกร่ง" : "การหมุนเวียนสินทรัพย์"}
              </span>
            </div>
          </div>

          {/* Revenue vs Expense Visual Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                โครงสร้างรายได้ vs ต้นทุนและค่าใช้จ่าย (Income Breakdown)
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-600">รายได้รวม (100%)</span>
                    <span className="font-mono text-slate-900">
                      ฿{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-600">
                      ต้นทุนขาย ({( (incomeStatement.totalCostOfSales / totalRevenue) * 100 ).toFixed(1)}%)
                    </span>
                    <span className="font-mono text-slate-900">
                      ฿{incomeStatement.totalCostOfSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((incomeStatement.totalCostOfSales / totalRevenue) * 100),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-600">
                      ค่าใช้จ่ายดำเนินงาน ({( (totalOperatingExpenses / totalRevenue) * 100 ).toFixed(1)}%)
                    </span>
                    <span className="font-mono text-slate-900">
                      ฿{totalOperatingExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-rose-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((totalOperatingExpenses / totalRevenue) * 100),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-600">กำไรสุทธิ ({netMarginPct}%)</span>
                    <span className="font-mono font-bold text-emerald-700">
                      ฿{netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(Math.max((netProfit / totalRevenue) * 100, 0), 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Health Scorecard */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Financial Health Scorecard (ดัชนีชี้วัดสุขภาพการเงิน)
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <span className="text-emerald-900 font-semibold block">สภาพคล่อง (Liquidity)</span>
                  <div className="text-base font-bold text-emerald-800 font-mono">{currentRatio}x</div>
                  <p className="text-[10px] text-emerald-700">มีสินทรัพย์หมุนเวียนคุ้มหนี้สินระยะสั้น</p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
                  <span className="text-blue-900 font-semibold block">ความสามารถทำกำไร (Profitability)</span>
                  <div className="text-base font-bold text-blue-800 font-mono">{netMarginPct}%</div>
                  <p className="text-[10px] text-blue-700">อัตรากำไรสุทธิต่อยอดขาย</p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                  <span className="text-indigo-900 font-semibold block">ภาระหนี้สิน (Leverage D/E)</span>
                  <div className="text-base font-bold text-indigo-800 font-mono">
                    {(balanceSheet.totalLiabilities / (totalEquity || 1)).toFixed(2)}x
                  </div>
                  <p className="text-[10px] text-indigo-700">สัดส่วนหนี้สินเทียบทุน</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <span className="text-amber-900 font-semibold block">ประสิทธิภาพ (Asset Turnover)</span>
                  <div className="text-base font-bold text-amber-800 font-mono">{assetTurnover.toFixed(2)}x</div>
                  <p className="text-[10px] text-amber-700">การสร้างยอดขายจากสินทรัพย์</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: DAX Measures Library for Power BI */}
      {activeTab === "dax" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                คลังสูตร DAX (Data Analysis Expressions) สำหรับนักศึกษาบัญชี
              </h3>
              <p className="text-xs text-slate-500">
                สูตรมาตรฐานที่องค์กรชั้นนำใช้คำนวณงบการเงินใน Power BI และ Tableau พร้อมนำไปคัดลอกใส่โปรเจกต์
              </p>
            </div>

            <div className="space-y-4">
              {BI_MEASURES.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-900">{item.name}</span>
                      <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                        {item.tool}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyFormula(item.id, item.formula)}
                      className="inline-flex items-center px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs rounded-md shadow-xs transition-colors"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                          คัดลอกแล้ว!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          คัดลอกสูตร DAX
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed">
                    {item.formula}
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      <strong className="text-slate-800">บริบททางธุรกิจ:</strong> {item.businessContext}
                    </div>
                    <div>
                      <strong className="text-slate-800">การแปลความหมาย:</strong> {item.interpretation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Star Schema & Data Modeling */}
      {activeTab === "modeling" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              การสร้างแบบจำลองข้อมูลบัญชี (Financial Data Modeling: Star Schema)
            </h3>
            <p className="text-xs text-slate-500">
              โครงสร้างที่ถูกต้องสำหรับการนำข้อมูลจากโปรแกรม Express หรือ SAP เข้าสู่ Power BI เพื่อให้รายงานทำงานได้รวดเร็ว
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Fact Table */}
            <div className="md:col-span-2 rounded-xl border-2 border-indigo-500 bg-indigo-50/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 text-sm">⭐ Fact_General_Ledger (ตารางข้อเท็จจริง)</span>
                <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded">Fact Table</span>
              </div>
              <p className="text-xs text-slate-600">
                เก็บบันทึกยอดเงินทุกธุรกรรม (Transactions) นับแสนนับล้านแถว
              </p>
              <div className="bg-white p-3 rounded-lg font-mono text-xs space-y-1 border border-indigo-200 text-slate-700">
                <div>Transaction_ID (PK)</div>
                <div className="text-indigo-600">Date_Key (FK → Dim_Date)</div>
                <div className="text-blue-600">Account_Code (FK → Dim_ChartOfAccounts)</div>
                <div className="text-amber-700">Customer_ID (FK → Dim_Customer)</div>
                <div className="text-emerald-700 font-bold">Debit_Amount (Measure)</div>
                <div className="text-emerald-700 font-bold">Credit_Amount (Measure)</div>
              </div>
            </div>

            {/* Dimension 1: Dim Date */}
            <div className="rounded-xl border border-slate-300 bg-slate-50 p-4 space-y-2">
              <span className="font-bold text-slate-900 text-xs block">Dim_Date (ตารางปฏิทิน)</span>
              <p className="text-[11px] text-slate-500">สำหรับทำ Time Intelligence (YTD, MTD, YoY)</p>
              <div className="bg-white p-2.5 rounded-lg font-mono text-xs space-y-1 border border-slate-200 text-slate-700">
                <div>Date_Key</div>
                <div>Year (2026)</div>
                <div>Quarter (Q1)</div>
                <div>Month_Name</div>
                <div>Fiscal_Year (ปีงบประมาณ)</div>
              </div>
            </div>

            {/* Dimension 2: Dim COA */}
            <div className="rounded-xl border border-slate-300 bg-slate-50 p-4 space-y-2">
              <span className="font-bold text-slate-900 text-xs block">Dim_ChartOfAccounts (ผังบัญชี)</span>
              <p className="text-[11px] text-slate-500">สำหรับจัดหมวดหมู่ในงบการเงิน</p>
              <div className="bg-white p-2.5 rounded-lg font-mono text-xs space-y-1 border border-slate-200 text-slate-700">
                <div>Account_Code</div>
                <div>Account_Name</div>
                <div>FS_Level_1 (Assets, Liab)</div>
                <div>FS_Level_2 (Current, Non-current)</div>
                <div>Report_Grouping</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
            <span className="font-bold">ขั้นตอนการเชื่อมต่อข้อมูลจริงจาก Express สู่ Power BI:</span>
            <ol className="list-decimal list-inside space-y-0.5 text-blue-800">
              <li>Export ตารางจาก Express (ไฟล์ DBF เช่น GLTRNP, OESOH) หรือต่อผ่าน ODBC Driver</li>
              <li>ใช้ Power Query ใน Power BI ทำ Data Cleansing และแปลงรหัสบัญชีให้ตรงกัน</li>
              <li>สร้างความสัมพันธ์ One-to-Many (1:*) ระหว่าง Dim Tables ไปยัง Fact Table</li>
              <li>เขียน DAX Measures และสร้างแดชบอร์ดเผยแพร่บน Power BI Service เพื่อให้ผู้บริหารดูผ่านมือถือ</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
