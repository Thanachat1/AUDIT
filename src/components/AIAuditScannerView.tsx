import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  Upload,
  AlertTriangle,
  CheckCircle,
  FileCheck,
  ArrowRight,
  HelpCircle,
  Bot,
  Send,
  Loader2,
  RefreshCw,
  Sparkles,
  Info,
  Wrench,
  BookOpen,
  FileSpreadsheet,
} from "lucide-react";
import { AccountItem, AuditScanResult, AuditScanErrorItem, TutorChatMessage } from "../types/accounting";

interface AIAuditScannerViewProps {
  currentAccounts: AccountItem[];
  onApplyCorrectingEntries?: (adjustments: Array<{ code: string; debit: number; credit: number }>) => void;
}

const SAMPLE_ERRONEOUS_DATA = `รหัสบัญชี,ชื่อบัญชี,หมวด,เดบิต,เครดิต
11100,เงินสดในมือ,1,0,15000 (ยอดติดลบ/ผิดด้านปกติ)
11300,ลูกหนี้การค้า,1,180000,0
12110,ค่าเสื่อมราคาสะสม-อาคาร,1,45000,0 (บันทึกผิดด้าน Contra-Asset ต้องอยู่เครดิต)
21100,เจ้าหนี้การค้า,2,25000,80000
31100,ทุนเรือนหุ้น,3,0,100000
41100,รายได้จากการขาย,4,0,250000
51100,ต้นทุนขาย,5,120000,0
52100,ค่าเสื่อมราคา-อาคาร,5,45000,0
53100,ค่าใช้จ่ายภาษีซื้อต้องห้าม,5,10000,0 (ไม่ได้บันทึกภาษีซื้อต้องห้ามเป็นต้นทุนสินทรัพย์)`;

const YEAR3_PROMPTS = [
  {
    title: "ภาษีเงินได้นิติบุคคล ภ.ง.ด.50",
    query: "อธิบายวิธีปรับปรุงกำไรสุทธิทางบัญชีเป็นกำไรสุทธิทางภาษี ตามประมวลรัษฎากร ม.65 ทวิ และ ม.65 ตรี รายจ่ายต้องห้ามมีอะไรบ้างที่พบบ่อยในการสอบ?",
    icon: "Receipt",
  },
  {
    title: "การบัญชีต้นทุน (Cost Accounting)",
    query: "เปรียบเทียบความแตกต่างระหว่าง Job Order Costing กับ Process Costing และอธิบายวิธีคำนวณ Equivalent Units of Production (EUP) วิธีถัวเฉลี่ยถ่วงน้ำหนักและ FIFO",
    icon: "Calculator",
  },
  {
    title: "มาตรฐาน TFRS 15 การรับรู้รายได้",
    query: "สรุปหลักการรับรู้รายได้จากสัญญาที่ทำกับลูกค้า 5 ขั้นตอน (5-Step Model) ตาม TFRS 15 พร้อมตัวอย่างรายการขายสินค้าควบคู่บริการติดตั้ง",
    icon: "BookOpen",
  },
  {
    title: "มาตรฐาน TFRS 16 สัญญาเช่า",
    query: "อธิบายวิธีการบันทึกบัญชีสัญญาเช่าทางการเงินและสิทธิการใช้สินทรัพย์ (Right-of-Use Asset: ROU) และหนี้สินตามสัญญาเช่าตาม TFRS 16",
    icon: "Layers",
  },
];

export const AIAuditScannerView: React.FC<AIAuditScannerViewProps> = ({
  currentAccounts,
  onApplyCorrectingEntries,
}) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_ERRONEOUS_DATA);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<AuditScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Tutor Chat Section
  const [tutorQuestion, setTutorQuestion] = useState("");
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<TutorChatMessage[]>([
    {
      id: "welcome-tutor",
      sender: "assistant",
      text: "สวัสดีครับนักศึกษา! ผมคือ AI ผู้ช่วยตรวจสอบบัญชีและติวเตอร์วิชาบัญชีปี 3 (TFRS, ภาษีนิติบุคคล, บัญชีต้นทุน, และ IT Audit) สามารถวางงบทดลองให้ตรวจ หรือเลือกหัวข้อติวเข้มด้านล่างได้เลยครับ",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Load active app trial balance into scanner
  const handleLoadCurrentAccounts = () => {
    const lines = ["รหัสบัญชี,ชื่อบัญชี,หมวด,เดบิต,เครดิต"];
    currentAccounts.forEach((acc) => {
      lines.push(`${acc.code},${acc.name},${acc.category},${acc.debit},${acc.credit}`);
    });
    setInputText(lines.join("\n"));
  };

  const handleScanErrors = async () => {
    if (!inputText.trim()) return;
    setIsScanning(true);
    setScanError(null);

    try {
      const response = await fetch("/api/accounting/scan-errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputData: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI Audit Scanner");
      }

      const result: AuditScanResult = await response.json();
      setScanResult(result);
    } catch (err: any) {
      console.error("Scan error:", err);
      setScanError(err.message || "เกิดข้อผิดพลาดในการสแกนข้อผิดพลาด");
    } finally {
      setIsScanning(false);
    }
  };

  const handleAskTutor = async (promptToSend?: string) => {
    const textToSend = promptToSend || tutorQuestion;
    if (!textToSend.trim()) return;

    const userMsg: TutorChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setTutorMessages((prev) => [...prev, userMsg]);
    if (!promptToSend) setTutorQuestion("");
    setIsTutorLoading(true);

    try {
      const response = await fetch("/api/accounting/ask-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          context: {
            currentErrorsFound: scanResult?.errorCount || 0,
            scannerSummary: scanResult?.summary,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("ระบบติวเตอร์ AI ขัดข้องชั่วคราว");
      }

      const data = await response.json();
      const botMsg: TutorChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: data.answer || "ขออภัย ไม่สามารถสร้างคำตอบได้",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setTutorMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: TutorChatMessage = {
        id: `assistant-err-${Date.now()}`,
        sender: "assistant",
        text: `⚠️ ขออภัยครับ: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setTutorMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Tax & Audit Specialists Image */}
      <div className="bg-gradient-to-r from-rose-950 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-rose-900/40">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-72 xl:w-80 shrink-0 relative group">
            <img
              src="/assets/images/tax_compliance_specialists.jpg"
              alt="ผู้เชี่ยวชาญด้านการตรวจสอบภาษีและบัญชีนิติบุคคล"
              referrerPolicy="no-referrer"
              className="w-full h-44 sm:h-48 object-cover rounded-xl shadow-lg ring-2 ring-rose-400/30 transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/images/mrt_app_logo.jpg";
              }}
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-[11px] font-bold text-rose-300 border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Tax & Forensic Audit</span>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
              AI Forensic Audit & Tax Error Scanner (ระบบตรวจจับข้อผิดพลาดสมุดบัญชี)
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              ตรวจจับยอดไม่ดุล บันทึกผิดฝั่งธรรมชาติ & แนะนำรายการปรับปรุงอัตโนมัติ
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              ช่วยตรวจสอบงบทดลองและไฟล์บัญชี: สแกนหายอดผิดด้านปกติ (Normal Balance Violation), บัญชีปรับมูลค่าผิดตำแหน่ง, พร้อมติวเตอร์ AI 24 ชม. สำหรับเนื้อหาบัญชีชั้นสูง (TFRS 15/16, ภาษี ภ.ง.ด.50, และบัญชีต้นทุน)
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
              <span className="bg-rose-900/50 px-2.5 py-1 rounded-lg border border-rose-700/40 text-rose-200">
                ประมวลรัษฎากร ม.65 ทวิ/ตรี
              </span>
              <span className="bg-indigo-900/50 px-2.5 py-1 rounded-lg border border-indigo-700/40 text-indigo-200">
                Audit Adjusting Entries
              </span>
              <span className="bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-700/40 text-emerald-300">
                Live AI Tutor
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Data Input & Scanner (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">
                  ข้อมูลงบทดลองหรือรายการบัญชีที่ต้องการตรวจสอบ
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLoadCurrentAccounts}
                  className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md transition-colors"
                  title="ดึงงบทดลองปัจจุบันในแอปมาตรวจสอบ"
                >
                  ดึงจากงบทดลองในแอป
                </button>
                <label className="px-2.5 py-1 text-[11px] font-medium bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-md cursor-pointer transition-colors flex items-center">
                  <Upload className="w-3 h-3 mr-1" />
                  อัปโหลดไฟล์ (CSV/TXT)
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="p-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={8}
                placeholder="วางข้อมูลงบทดลอง, รายการสมุดรายวัน, หรือคัดลอกตารางจาก Excel มาวางที่นี่..."
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white resize-y"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  รองรับรูปแบบ: รหัสบัญชี, ชื่อบัญชี, ยอดเดบิต, ยอดเครดิต
                </span>
                <button
                  onClick={handleScanErrors}
                  disabled={isScanning || !inputText.trim()}
                  className="inline-flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      กำลังสแกนข้อผิดพลาด...
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5 mr-1.5" />
                      สแกนและตรวจสอบข้อผิดพลาด (AI Audit)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Scan Error Alert if any */}
          {scanError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{scanError}</div>
            </div>
          )}

          {/* Scan Results Card */}
          {scanResult && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    ผลการตรวจสอบทางบัญชี (Audit Findings)
                  </h4>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    scanResult.errorCount > 0
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {scanResult.errorCount > 0
                    ? `พบข้อผิดพลาด ${scanResult.errorCount} จุด`
                    : "ถูกต้องตามหลักการบัญชี ✓"}
                </span>
              </div>

              {/* Summary Text */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <span className="font-semibold text-slate-900">สรุปความเห็นผู้สอบบัญชี: </span>
                {scanResult.summary}
              </div>

              {/* Errors List */}
              <div className="space-y-3">
                {scanResult.errors.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      item.severity === "critical"
                        ? "bg-rose-50/60 border-rose-200 text-rose-950"
                        : item.severity === "warning"
                        ? "bg-amber-50/60 border-amber-200 text-amber-950"
                        : "bg-blue-50/60 border-blue-200 text-blue-950"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.severity === "critical"
                              ? "bg-rose-200 text-rose-800"
                              : item.severity === "warning"
                              ? "bg-amber-200 text-amber-800"
                              : "bg-blue-200 text-blue-800"
                          }`}
                        >
                          {item.severity}
                        </span>
                        <span className="font-bold text-slate-900 text-xs">
                          {item.accountCode ? `[${item.accountCode}] ` : ""}
                          {item.accountName}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">
                        {item.ruleReference}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-800">{item.issueTitle}</div>
                    <p className="text-slate-600 leading-relaxed">{item.issueDescription}</p>

                    {/* Recommended Adjusting Entry */}
                    {item.recommendedAdjustment && (
                      <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-900">
                        <span className="font-sans font-bold text-indigo-700 block mb-1">
                          🛠️ รายการปรับปรุงแก้ไขที่แนะนำ (Adjusting Journal Entry):
                        </span>
                        {item.recommendedAdjustment}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Auditor Tips */}
              {scanResult.auditorTips && (
                <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">เคล็ดลับสำหรับทำงานจริง: </span>
                    {scanResult.auditorTips}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: 24/7 Advanced Accounting Tutor (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    ติวเตอร์บัญชีชั้นสูง 24 ชม. (TFRS & Tax)
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    ตอบคำถามภาษีนิติบุคคล บัญชีต้นทุน และระบบ ERP
                  </p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Year 3 Fast Topics Pills */}
            <div className="p-3 bg-slate-50/50 border-b border-slate-200/60 overflow-x-auto">
              <div className="text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                หัวข้อติวเข้มปี 3 ยอดนิยม:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {YEAR3_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskTutor(item.query)}
                    className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 rounded-lg transition-all text-left"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {tutorMessages.map((msg) => {
                const isAssistant = msg.sender === "assistant";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-2.5 ${
                        isAssistant
                          ? "bg-slate-100 text-slate-800 rounded-tl-xs"
                          : "bg-indigo-600 text-white rounded-tr-xs"
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                      <div
                        className={`text-[9px] mt-1 text-right ${
                          isAssistant ? "text-slate-400" : "text-indigo-200"
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTutorLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl rounded-tl-xs px-4 py-3 flex items-center space-x-2 text-slate-500 text-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    <span>ติวเตอร์ AI กำลังค้นคว้ามาตรฐานและข้อกฎหมายภาษี...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskTutor();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={tutorQuestion}
                  onChange={(e) => setTutorQuestion(e.target.value)}
                  placeholder="พิมพ์คำถามบัญชี เช่น ข้อแตกต่าง TFRS 15 กับ 16..."
                  className="flex-1 text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!tutorQuestion.trim() || isTutorLoading}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
