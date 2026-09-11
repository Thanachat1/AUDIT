import React, { useState } from "react";
import {
  IncomeStatementData,
  BalanceSheetData,
  FinancialRatio,
  AccountItem,
  ACCOUNT_CATEGORIES,
} from "../types/accounting";
import { formatCurrency } from "../utils/financialCalculations";
import {
  TrendingUp,
  Scale,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  PieChart,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";

interface FinancialStatementViewProps {
  incomeStatement: IncomeStatementData;
  balanceSheet: BalanceSheetData;
  ratios: FinancialRatio[];
  accounts: AccountItem[];
}

export const FinancialStatementView: React.FC<FinancialStatementViewProps> = ({
  incomeStatement,
  balanceSheet,
  ratios,
  accounts,
}) => {
  const [statementSubTab, setStatementSubTab] = useState<
    "balance-sheet" | "income-statement" | "trial-balance" | "ratios"
  >("balance-sheet");

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Trigger celebratory confetti if balanced
  const handleCelebration = () => {
    if (balanceSheet.isBalanced) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // Request AI Financial Analysis
  const handleRequestAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      const summaryPayload = {
        businessName: balanceSheet.businessName,
        totalAssets: balanceSheet.totalAssets,
        totalCurrentAssets: balanceSheet.totalCurrentAssets,
        totalNonCurrentAssets: balanceSheet.totalNonCurrentAssets,
        totalLiabilities: balanceSheet.totalLiabilities,
        totalCurrentLiabilities: balanceSheet.totalCurrentLiabilities,
        totalEquity: balanceSheet.totalEquity,
        totalRevenues: incomeStatement.totalRevenues,
        grossProfit: incomeStatement.grossProfit,
        netProfit: incomeStatement.netProfit,
        ratios: ratios.map((r) => ({
          name: r.nameTh,
          value: r.value.toFixed(2),
          unit: r.unit,
          status: r.status,
        })),
      };

      const res = await fetch("/api/accounting/explain-financial-statements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statementSummary: summaryPayload }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      } else if (data.error) {
        setAiAnalysis(`เกิดข้อผิดพลาด: ${data.error}`);
      }
    } catch (err: any) {
      setAiAnalysis(`เกิดข้อผิดพลาดในการเชื่อมต่อ AI: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyAnalysis = () => {
    if (!aiAnalysis) return;
    navigator.clipboard.writeText(aiAnalysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="financial-statements-container" className="space-y-6">
      {/* Hero Showcase Banner with Real-world Financial Audit Team */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-md border border-indigo-900/40">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-72 xl:w-80 shrink-0 relative group">
            <img
              src="/assets/images/audit_financial_review.jpg"
              alt="ทีมผู้ตรวจสอบบัญชีและนักวิเคราะห์งบการเงิน"
              referrerPolicy="no-referrer"
              className="w-full h-44 sm:h-48 object-cover rounded-xl shadow-lg ring-2 ring-indigo-400/30 transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/images/mrt_app_logo.jpg";
              }}
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-[11px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Smart Audit & Reporting</span>
            </div>
          </div>
          <div className="flex-1 space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              ศูนย์วิเคราะห์และตรวจทานงบการเงินครบวงจร (Financial Statements Hub)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              ตรวจทานงบดุล งบกำไรขาดทุน และอัตราส่วนทางการเงินแบบเรียลไทม์
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              เชื่อมโยงข้อมูลจากสมุดรายวันทั่วไป (Journal Entries) สู่การออกงบทดลอง งบแสดงฐานะการเงิน และงบกำไรขาดทุนแบบอัตโนมัติ พร้อมฟังก์ชัน AI วิเคราะห์โครงสร้างทางการเงินและสภาพคล่องตามมาตรฐาน TFRS
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
              <span className="bg-indigo-900/60 px-2.5 py-1 rounded-lg border border-indigo-700/50 text-indigo-200">
                งบดุลคู่สมดุล 100%
              </span>
              <span className="bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-700/50 text-emerald-300">
                DuPont Ratio Breakdown
              </span>
              <span className="bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-700/50 text-blue-300">
                AI Diagnostic Report
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Status & Equation Banner */}
      <div
        id="equation-status-card"
        className={`p-4 rounded-xl border transition-all ${
          balanceSheet.isBalanced
            ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
            : "bg-amber-50/70 border-amber-200 text-amber-900"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                balanceSheet.isBalanced
                  ? "bg-emerald-600 text-white"
                  : "bg-amber-500 text-white"
              }`}
              onClick={handleCelebration}
              title={balanceSheet.isBalanced ? "คลิกเพื่อฉลองสมดุลงบ!" : "งบยังไม่ดุล"}
            >
              {balanceSheet.isBalanced ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm">
                  สมการบัญชี (Accounting Equation):
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    balanceSheet.isBalanced
                      ? "bg-emerald-200 text-emerald-800"
                      : "bg-amber-200 text-amber-800"
                  }`}
                >
                  {balanceSheet.isBalanced
                    ? "สมดุลแล้ว (Balanced) ✓"
                    : `ผลต่าง ${formatCurrency(balanceSheet.difference)} บาท !`}
                </span>
              </div>
              <p className="text-xs mt-0.5 font-mono">
                สินทรัพย์ (Assets) ฿{formatCurrency(balanceSheet.totalAssets)} =
                หนี้สิน (Liabilities) ฿{formatCurrency(balanceSheet.totalLiabilities)} +
                ส่วนของเจ้าของ (Equity) ฿{formatCurrency(balanceSheet.totalEquity)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="ai-interpret-btn"
              onClick={handleRequestAnalysis}
              disabled={isAnalyzing}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs"
            >
              {isAnalyzing ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
              )}
              {isAnalyzing ? "กำลังวิเคราะห์..." : "AI วิเคราะห์งบการเงินเจาะลึก"}
            </button>
          </div>
        </div>
      </div>

      {/* Subtabs for Statement Views */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex space-x-1.5 overflow-x-auto">
          <button
            id="subtab-balance-sheet"
            onClick={() => setStatementSubTab("balance-sheet")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statementSubTab === "balance-sheet"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Scale className="w-3.5 h-3.5 inline mr-1" />
            1. งบแสดงฐานะการเงิน (Balance Sheet)
          </button>

          <button
            id="subtab-income-statement"
            onClick={() => setStatementSubTab("income-statement")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statementSubTab === "income-statement"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
            2. งบกำไรขาดทุน (Income Statement)
          </button>

          <button
            id="subtab-trial-balance"
            onClick={() => setStatementSubTab("trial-balance")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statementSubTab === "trial-balance"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Scale className="w-3.5 h-3.5 inline mr-1" />
            3. งบทดลอง (Trial Balance)
          </button>

          <button
            id="subtab-ratios"
            onClick={() => setStatementSubTab("ratios")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statementSubTab === "ratios"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <PieChart className="w-3.5 h-3.5 inline mr-1" />
            4. วิเคราะห์อัตราส่วนทางการเงิน (Ratios)
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          มาตรฐานการบัญชี TFRS for NPAEs
        </div>
      </div>

      {/* AI Analysis Panel (if generated) */}
      {aiAnalysis && (
        <div
          id="ai-analysis-output"
          className="p-4 bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-200 rounded-xl relative shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-indigo-900 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>บทวิเคราะห์งบการเงินและข้อสังเกตเพื่อการสอบ (โดยอาจารย์บัญชี AI)</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyAnalysis}
                className="text-xs text-indigo-700 hover:text-indigo-900 flex items-center bg-white/80 px-2 py-1 rounded border border-indigo-200"
                title="คัดลอกบทวิเคราะห์"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1" />
                )}
                {copied ? "คัดลอกแล้ว" : "คัดลอก"}
              </button>
              <button
                onClick={() => setAiAnalysis(null)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ปิด
              </button>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-sans bg-white/60 p-3 rounded-lg border border-indigo-100">
            {aiAnalysis}
          </div>
        </div>
      )}

      {/* 1. VIEW: BALANCE SHEET (งบแสดงฐานะการเงิน) */}
      {statementSubTab === "balance-sheet" && (
        <div
          id="statement-balance-sheet-card"
          className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden print:border-none print:shadow-none"
        >
          {/* Official Thai Accounting Header */}
          <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {balanceSheet.businessName}
            </h2>
            <h3 className="text-sm font-semibold text-slate-700 mt-0.5">
              งบแสดงฐานะการเงิน (Statement of Financial Position)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {balanceSheet.asOfDate}
            </p>
            <div className="text-[11px] text-slate-400 mt-0.5 text-right font-mono">
              (หน่วย: บาท)
            </div>
          </div>

          <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
            {/* --- SECTION 1: ASSETS (สินทรัพย์) --- */}
            <div>
              <div className="text-sm font-bold text-slate-900 border-b-2 border-slate-800 pb-1 uppercase tracking-wide">
                สินทรัพย์ (Assets)
              </div>

              {/* Current Assets */}
              <div className="mt-4">
                <div className="text-xs font-bold text-slate-800">
                  สินทรัพย์หมุนเวียน (Current Assets)
                </div>
                <div className="mt-2 space-y-1.5">
                  {balanceSheet.currentAssets.map((item, idx) => (
                    <div
                      key={`ca-${idx}`}
                      className="flex justify-between items-center text-xs sm:text-sm py-1 border-b border-slate-50"
                    >
                      <span className="text-slate-700 pl-4">
                        {item.name}
                      </span>
                      <span className="font-mono text-slate-900 text-right">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold py-1.5 border-t border-slate-200 bg-slate-50/50 px-2 rounded">
                    <span className="text-slate-800">
                      รวมสินทรัพย์หมุนเวียน (Total Current Assets)
                    </span>
                    <span className="font-mono text-slate-900 text-right underline">
                      {formatCurrency(balanceSheet.totalCurrentAssets)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Non-Current Assets */}
              <div className="mt-6">
                <div className="text-xs font-bold text-slate-800">
                  สินทรัพย์ไม่หมุนเวียน (Non-Current Assets)
                </div>
                <div className="mt-2 space-y-1.5">
                  {balanceSheet.nonCurrentAssets.map((item, idx) => (
                    <div
                      key={`nca-${idx}`}
                      className="flex justify-between items-center text-xs sm:text-sm py-1 border-b border-slate-50"
                    >
                      <span
                        className={`pl-4 ${
                          item.isNegative ? "text-slate-500 italic" : "text-slate-700"
                        }`}
                      >
                        {item.name} {item.isNegative ? "(หัก)" : ""}
                      </span>
                      <span
                        className={`font-mono text-right ${
                          item.isNegative ? "text-rose-600" : "text-slate-900"
                        }`}
                      >
                        {item.isNegative
                          ? `(${formatCurrency(item.amount)})`
                          : formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold py-1.5 border-t border-slate-200 bg-slate-50/50 px-2 rounded">
                    <span className="text-slate-800">
                      รวมสินทรัพย์ไม่หมุนเวียน (Total Non-Current Assets)
                    </span>
                    <span className="font-mono text-slate-900 text-right underline">
                      {formatCurrency(balanceSheet.totalNonCurrentAssets)}
                    </span>
                  </div>
                </div>
              </div>

              {/* TOTAL ASSETS */}
              <div className="mt-6 flex justify-between items-center text-sm sm:text-base font-bold py-2.5 px-3 bg-emerald-50/70 border-y-2 border-emerald-600 rounded-md">
                <span className="text-emerald-950">รวมสินทรัพย์ทั้งสิ้น (Total Assets)</span>
                <span className="font-mono text-emerald-950 underline decoration-double decoration-2">
                  {formatCurrency(balanceSheet.totalAssets)}
                </span>
              </div>
            </div>

            {/* --- SECTION 2: LIABILITIES AND EQUITY (หนี้สินและส่วนของเจ้าของ) --- */}
            <div className="pt-4">
              <div className="text-sm font-bold text-slate-900 border-b-2 border-slate-800 pb-1 uppercase tracking-wide">
                หนี้สินและส่วนของเจ้าของ (Liabilities & Equity)
              </div>

              {/* Current Liabilities */}
              <div className="mt-4">
                <div className="text-xs font-bold text-slate-800">
                  หนี้สินหมุนเวียน (Current Liabilities)
                </div>
                <div className="mt-2 space-y-1.5">
                  {balanceSheet.currentLiabilities.map((item, idx) => (
                    <div
                      key={`cl-${idx}`}
                      className="flex justify-between items-center text-xs sm:text-sm py-1 border-b border-slate-50"
                    >
                      <span className="text-slate-700 pl-4">{item.name}</span>
                      <span className="font-mono text-slate-900 text-right">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold py-1.5 border-t border-slate-200 bg-slate-50/50 px-2 rounded">
                    <span className="text-slate-800">
                      รวมหนี้สินหมุนเวียน (Total Current Liabilities)
                    </span>
                    <span className="font-mono text-slate-900 text-right underline">
                      {formatCurrency(balanceSheet.totalCurrentLiabilities)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Non-Current Liabilities */}
              {balanceSheet.nonCurrentLiabilities.length > 0 && (
                <div className="mt-6">
                  <div className="text-xs font-bold text-slate-800">
                    หนี้สินไม่หมุนเวียน (Non-Current Liabilities)
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {balanceSheet.nonCurrentLiabilities.map((item, idx) => (
                      <div
                        key={`ncl-${idx}`}
                        className="flex justify-between items-center text-xs sm:text-sm py-1 border-b border-slate-50"
                      >
                        <span className="text-slate-700 pl-4">{item.name}</span>
                        <span className="font-mono text-slate-900 text-right">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-xs sm:text-sm font-semibold py-1.5 border-t border-slate-200 bg-slate-50/50 px-2 rounded">
                      <span className="text-slate-800">
                        รวมหนี้สินไม่หมุนเวียน (Total Non-Current Liabilities)
                      </span>
                      <span className="font-mono text-slate-900 text-right underline">
                        {formatCurrency(balanceSheet.totalNonCurrentLiabilities)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TOTAL LIABILITIES */}
              <div className="mt-4 flex justify-between items-center text-xs sm:text-sm font-semibold py-2 px-2 bg-amber-50/50 border border-amber-200 rounded">
                <span className="text-amber-900">รวมหนี้สิน (Total Liabilities)</span>
                <span className="font-mono text-amber-950 font-bold">
                  {formatCurrency(balanceSheet.totalLiabilities)}
                </span>
              </div>

              {/* OWNER'S EQUITY */}
              <div className="mt-6">
                <div className="text-xs font-bold text-slate-800">
                  ส่วนของเจ้าของ (Owner's Equity)
                </div>
                <div className="mt-2 space-y-1.5">
                  {balanceSheet.equityItems.map((item, idx) => (
                    <div
                      key={`eq-${idx}`}
                      className="flex justify-between items-center text-xs sm:text-sm py-1 border-b border-slate-50"
                    >
                      <span
                        className={`pl-4 ${
                          item.isNegative ? "text-slate-500 italic" : "text-slate-700"
                        }`}
                      >
                        {item.name} {item.isNegative ? "(หัก)" : ""}
                      </span>
                      <span
                        className={`font-mono text-right ${
                          item.isNegative ? "text-rose-600" : "text-slate-900"
                        }`}
                      >
                        {item.isNegative
                          ? `(${formatCurrency(item.amount)})`
                          : formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}

                  {/* Net Profit transferred from Income Statement */}
                  <div className="flex justify-between items-center text-xs sm:text-sm py-1.5 bg-indigo-50/40 px-2 rounded border border-indigo-100">
                    <span className="text-indigo-900 pl-2 font-medium flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                      บวก: กำไรสุทธิประจำงวด (จากงบกำไรขาดทุน)
                    </span>
                    <span
                      className={`font-mono font-bold text-right ${
                        balanceSheet.netProfitForPeriod >= 0
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {balanceSheet.netProfitForPeriod >= 0
                        ? formatCurrency(balanceSheet.netProfitForPeriod)
                        : `(${formatCurrency(Math.abs(balanceSheet.netProfitForPeriod))})`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold py-1.5 border-t border-slate-200 bg-slate-50/50 px-2 rounded">
                    <span className="text-slate-800">
                      รวมส่วนของเจ้าของ (Total Equity)
                    </span>
                    <span className="font-mono text-slate-900 text-right underline">
                      {formatCurrency(balanceSheet.totalEquity)}
                    </span>
                  </div>
                </div>
              </div>

              {/* TOTAL LIABILITIES AND EQUITY */}
              <div
                className={`mt-6 flex justify-between items-center text-sm sm:text-base font-bold py-2.5 px-3 rounded-md border-y-2 ${
                  balanceSheet.isBalanced
                    ? "bg-emerald-50/70 border-emerald-600 text-emerald-950"
                    : "bg-amber-100 border-amber-600 text-amber-950"
                }`}
              >
                <span>รวมหนี้สินและส่วนของเจ้าของ (Total Liabilities & Equity)</span>
                <span className="font-mono underline decoration-double decoration-2">
                  {formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. VIEW: INCOME STATEMENT (งบกำไรขาดทุน) */}
      {statementSubTab === "income-statement" && (
        <div
          id="statement-income-card"
          className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden print:border-none print:shadow-none"
        >
          <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {incomeStatement.businessName}
            </h2>
            <h3 className="text-sm font-semibold text-slate-700 mt-0.5">
              งบกำไรขาดทุน (Income Statement)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {incomeStatement.period}
            </p>
            <div className="text-[11px] text-slate-400 mt-0.5 text-right font-mono">
              (หน่วย: บาท)
            </div>
          </div>

          <div className="p-4 sm:p-8 space-y-6 max-w-3xl mx-auto">
            {/* Revenues */}
            <div>
              <div className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1">
                รายได้ (Revenues)
              </div>
              <div className="mt-2 space-y-1.5">
                {incomeStatement.revenues.map((rev, idx) => (
                  <div
                    key={`rev-${idx}`}
                    className="flex justify-between items-center text-xs sm:text-sm py-1 pl-4"
                  >
                    <span className="text-slate-700">{rev.name}</span>
                    <span className="font-mono text-slate-900">
                      {formatCurrency(rev.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold py-1.5 border-t border-slate-200 bg-slate-50 px-2 rounded">
                  <span className="text-slate-900">รวมรายได้ (Total Revenues)</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {formatCurrency(incomeStatement.totalRevenues)}
                  </span>
                </div>
              </div>
            </div>

            {/* Cost of Goods / Services Sold */}
            <div>
              <div className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1">
                ต้นทุนขายและบริการ (Cost of Goods / Services Sold)
              </div>
              <div className="mt-2 space-y-1.5">
                {incomeStatement.costOfSales.map((cos, idx) => (
                  <div
                    key={`cos-${idx}`}
                    className="flex justify-between items-center text-xs sm:text-sm py-1 pl-4"
                  >
                    <span className="text-slate-700">{cos.name}</span>
                    <span className="font-mono text-slate-900">
                      {formatCurrency(cos.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold py-1.5 border-t border-slate-200 bg-slate-50 px-2 rounded">
                  <span className="text-slate-800">
                    รวมต้นทุนขาย (Total Cost of Sales)
                  </span>
                  <span className="font-mono text-slate-900">
                    {formatCurrency(incomeStatement.totalCostOfSales)}
                  </span>
                </div>
              </div>
            </div>

            {/* GROSS PROFIT */}
            <div className="flex justify-between items-center text-sm font-bold py-2 px-3 bg-indigo-50/70 border border-indigo-200 rounded-md">
              <span className="text-indigo-950">กำไรขั้นต้น (Gross Profit)</span>
              <span className="font-mono text-indigo-950 font-bold">
                {formatCurrency(incomeStatement.grossProfit)}
              </span>
            </div>

            {/* Operating Expenses */}
            <div>
              <div className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1">
                ค่าใช้จ่ายในการดำเนินงานและบริหาร (Operating & Admin Expenses)
              </div>
              <div className="mt-2 space-y-1.5">
                {incomeStatement.operatingExpenses.map((exp, idx) => (
                  <div
                    key={`exp-${idx}`}
                    className="flex justify-between items-center text-xs sm:text-sm py-1 pl-4"
                  >
                    <span className="text-slate-700">{exp.name}</span>
                    <span className="font-mono text-slate-900">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold py-1.5 border-t border-slate-200 bg-slate-50 px-2 rounded">
                  <span className="text-slate-800">
                    รวมค่าใช้จ่ายดำเนินงาน (Total Operating Expenses)
                  </span>
                  <span className="font-mono text-slate-900">
                    {formatCurrency(incomeStatement.totalOperatingExpenses)}
                  </span>
                </div>
              </div>
            </div>

            {/* OPERATING PROFIT (EBIT) */}
            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold py-1.5 px-3 bg-slate-100 rounded">
              <span className="text-slate-800">
                กำไรจากการดำเนินงาน (Operating Profit / EBIT)
              </span>
              <span className="font-mono text-slate-900">
                {formatCurrency(incomeStatement.operatingProfit)}
              </span>
            </div>

            {/* Financial Costs */}
            {incomeStatement.totalFinancialCosts > 0 && (
              <div className="flex justify-between items-center text-xs sm:text-sm py-1 px-3">
                <span className="text-slate-700 pl-2">
                  หัก: ต้นทุนทางการเงิน (ดอกเบี้ยจ่าย)
                </span>
                <span className="font-mono text-slate-900">
                  ({formatCurrency(incomeStatement.totalFinancialCosts)})
                </span>
              </div>
            )}

            {/* Tax Expense */}
            {incomeStatement.taxExpense > 0 && (
              <div className="flex justify-between items-center text-xs sm:text-sm py-1 px-3">
                <span className="text-slate-700 pl-2">
                  หัก: ค่าใช้จ่ายภาษีเงินได้
                </span>
                <span className="font-mono text-slate-900">
                  ({formatCurrency(incomeStatement.taxExpense)})
                </span>
              </div>
            )}

            {/* NET PROFIT / NET LOSS */}
            <div
              className={`flex justify-between items-center text-base font-bold py-3 px-4 rounded-lg border-y-2 ${
                incomeStatement.netProfit >= 0
                  ? "bg-emerald-50 border-emerald-600 text-emerald-950"
                  : "bg-rose-50 border-rose-600 text-rose-950"
              }`}
            >
              <div>
                <span>
                  {incomeStatement.netProfit >= 0
                    ? "กำไรสุทธิประจำงวด (Net Profit)"
                    : "ขาดทุนสุทธิประจำงวด (Net Loss)"}
                </span>
                <p className="text-[11px] font-normal opacity-80 mt-0.5">
                  โอนไปยังส่วนของเจ้าของในงบแสดงฐานะการเงิน
                </p>
              </div>
              <span className="font-mono text-lg underline decoration-double decoration-2">
                {formatCurrency(incomeStatement.netProfit)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. VIEW: TRIAL BALANCE (งบทดลอง) */}
      {statementSubTab === "trial-balance" && (
        <div
          id="statement-trial-balance-card"
          className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden"
        >
          <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {balanceSheet.businessName}
            </h2>
            <h3 className="text-sm font-semibold text-slate-700 mt-0.5">
              งบทดลอง (Trial Balance)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {balanceSheet.asOfDate}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">รหัส</th>
                  <th className="py-2.5 px-3">ชื่อบัญชี</th>
                  <th className="py-2.5 px-3 text-center">หมวด</th>
                  <th className="py-2.5 px-3 text-right">เดบิต (Debit)</th>
                  <th className="py-2.5 px-3 text-right">เครดิต (Credit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map((acc) => {
                  const cat = ACCOUNT_CATEGORIES[acc.category];
                  return (
                    <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 font-mono text-slate-600">
                        {acc.code}
                      </td>
                      <td className="py-2 px-3 font-medium text-slate-900">
                        {acc.name}
                        {acc.isContra && (
                          <span className="ml-1.5 text-[10px] text-rose-500 font-normal">
                            (ปรับมูลค่า)
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] rounded-full font-medium ${
                            acc.category === 1
                              ? "bg-emerald-100 text-emerald-800"
                              : acc.category === 2
                              ? "bg-amber-100 text-amber-800"
                              : acc.category === 3
                              ? "bg-indigo-100 text-indigo-800"
                              : acc.category === 4
                              ? "bg-cyan-100 text-cyan-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          หมวด {acc.category}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-800">
                        {acc.debit > 0 ? formatCurrency(acc.debit) : "-"}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-800">
                        {acc.credit > 0 ? formatCurrency(acc.credit) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                <tr>
                  <td colSpan={3} className="py-3 px-3 text-slate-900 font-bold text-right">
                    ยอดรวมงบทดลอง (Total):
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-900 underline decoration-double">
                    {formatCurrency(
                      accounts.reduce((sum, a) => sum + (a.debit || 0), 0)
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-900 underline decoration-double">
                    {formatCurrency(
                      accounts.reduce((sum, a) => sum + (a.credit || 0), 0)
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 4. VIEW: FINANCIAL RATIOS (อัตราส่วนทางการเงินเพื่อการวิเคราะห์) */}
      {statementSubTab === "ratios" && (
        <div id="financial-ratios-grid" className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <PieChart className="w-4 h-4 mr-1.5 text-indigo-600" />
              การวิเคราะห์อัตราส่วนทางการเงินเพื่อเตรียมสอบและการประเมินธุรกิจ
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              คำนวณอัตโนมัติจากงบการเงินด้านบน พร้อมเกณฑ์มาตรฐาน (Benchmark) และคำอธิบายความหมายสำหรับนักศึกษา
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ratios.map((ratio) => (
              <div
                key={ratio.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {ratio.nameTh}
                      </h4>
                      <p className="text-[11px] text-slate-400">{ratio.nameEn}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        ratio.status === "good"
                          ? "bg-emerald-100 text-emerald-800"
                          : ratio.status === "neutral"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ratio.status === "good"
                        ? "เกณฑ์ดี"
                        : ratio.status === "neutral"
                        ? "ปานกลาง"
                        : "ควรระวัง"}
                    </span>
                  </div>

                  <div className="my-3 flex items-baseline space-x-1.5">
                    <span className="text-2xl font-extrabold font-mono text-indigo-600">
                      {ratio.value.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500">{ratio.unit}</span>
                  </div>

                  <div className="text-[11px] bg-slate-50 p-2 rounded border border-slate-100 font-mono text-slate-600 mb-2">
                    สูตร: {ratio.formula}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ratio.interpretation}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                  <span>เกณฑ์ทั่วไป:</span>
                  <span className="font-semibold text-slate-700">{ratio.benchmark}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
