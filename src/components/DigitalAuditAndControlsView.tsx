import React, { useState } from "react";
import {
  ShieldCheck,
  AlertOctagon,
  FileCheck2,
  Users2,
  CheckCircle2,
  XCircle,
  FileSearch,
  KeyRound,
  Database,
  ArrowRight,
  TrendingDown,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { IT_CONTROL_CASES, SOD_MATRIX_RULES } from "../data/advancedAccountingData";

// Forensic Dataset for Student Simulation
interface ForensicRecord {
  id: string;
  docNo: string;
  vendorName: string;
  amount: number;
  date: string;
  createdTime: string;
  creator: string;
  status: "Normal" | "Duplicate" | "Off-Hour" | "Ghost-Employee";
  isFlagged: boolean;
}

const INITIAL_FORENSIC_DATA: ForensicRecord[] = [
  {
    id: "f-1",
    docNo: "INV-2026-8801",
    vendorName: "บจก. ออฟฟิศ ซัพพลายส์ จำกัด",
    amount: 14500,
    date: "2026-03-02",
    createdTime: "10:30:12",
    creator: "user_purchasing",
    status: "Normal",
    isFlagged: false,
  },
  {
    id: "f-2",
    docNo: "INV-2026-8802",
    vendorName: "บจก. โกลบอล เทคโนโลยี",
    amount: 85000,
    date: "2026-03-05",
    createdTime: "14:15:00",
    creator: "user_acct01",
    status: "Normal",
    isFlagged: false,
  },
  {
    id: "f-3",
    docNo: "INV-2026-8802", // Duplicate invoice number & amount
    vendorName: "บจก. โกลบอล เทคโนโลยี",
    amount: 85000,
    date: "2026-03-06",
    createdTime: "15:20:44",
    creator: "user_acct02",
    status: "Duplicate",
    isFlagged: false,
  },
  {
    id: "f-4",
    docNo: "PAY-2026-041",
    vendorName: "นายสมศักดิ์ แดงดี (พนักงานลาออก 3 เดือนที่แล้ว)",
    amount: 32000,
    date: "2026-03-25",
    createdTime: "11:00:20",
    creator: "hr_manager",
    status: "Ghost-Employee",
    isFlagged: false,
  },
  {
    id: "f-5",
    docNo: "JV-2026-0919",
    vendorName: "ปรับปรุงค่าที่ปรึกษาพิเศษ",
    amount: 190000,
    date: "2026-03-08 (วันอาทิตย์)",
    createdTime: "02:45:11 (ตี 2)",
    creator: "admin_temp",
    status: "Off-Hour",
    isFlagged: false,
  },
];

export const DigitalAuditAndControlsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"controls" | "sod" | "forensic" | "benford">("controls");

  // SOD Matrix Checker State
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);

  // Forensic Scanner State
  const [records, setRecords] = useState<ForensicRecord[]>(INITIAL_FORENSIC_DATA);
  const [forensicScore, setForensicScore] = useState<number>(0);
  const [evaluationMessage, setEvaluationMessage] = useState<string | null>(null);

  const toggleFlagRecord = (id: string) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, isFlagged: !rec.isFlagged } : rec))
    );
  };

  const handleEvaluateForensics = () => {
    let score = 0;
    records.forEach((r) => {
      const isActuallySuspicious = r.status !== "Normal";
      if (isActuallySuspicious && r.isFlagged) {
        score += 25; // caught correctly
      } else if (!isActuallySuspicious && !r.isFlagged) {
        score += 10; // rightly ignored
      } else {
        score -= 10; // false positive or missed
      }
    });

    const finalScore = Math.max(0, Math.min(100, score));
    setForensicScore(finalScore);
    if (finalScore >= 80) {
      setEvaluationMessage("🎉 ยอดเยี่ยมมาก! คุณสแกนพบการทุจริตและการลงรายการผิดปกติครบถ้วนตามหลัก IT Audit");
    } else {
      setEvaluationMessage("💡 ยังมีรายการทุจริตที่หลุดรอด หรือระบุผิดพลาด ลองสังเกตเลขที่บิลซ้ำ, วันที่วันหยุด/ดึก, หรือพนักงานที่ลาออก");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-950 rounded-2xl p-6 text-white shadow-md border border-purple-900/40">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              การควบคุมภายในและการตรวจสอบบัญชีดิจิทัล (Digital Auditing & Controls)
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              ITGC & ITAC Controls, SOD Matrix & Digital Forensic Fraud Lab
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl">
              สวมบทบาทผู้ตรวจสอบบัญชีดิจิทัล (Digital Auditor): ทดสอบการแบ่งแยกหน้าที่ (SOD), ตรวจสอบการทำ 3-Way Match, และสแกนจับกลโกงใบแจ้งหนี้ซ้ำซ้อนและพนักงานผี
            </p>
          </div>

          <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 self-start md:self-center">
            <button
              onClick={() => setActiveTab("controls")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                activeTab === "controls"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 mr-1.5" />
              ITGC & ITAC Controls
            </button>
            <button
              onClick={() => setActiveTab("sod")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                activeTab === "sod"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Users2 className="w-3.5 h-3.5 mr-1.5" />
              SOD Matrix Simulator
            </button>
            <button
              onClick={() => setActiveTab("forensic")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                activeTab === "forensic"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <FileSearch className="w-3.5 h-3.5 mr-1.5" />
              Fraud Detection Lab
            </button>
            <button
              onClick={() => setActiveTab("benford")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                activeTab === "benford"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5 mr-1.5" />
              Benford's Law
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: ITGC & ITAC Controls */}
      {activeTab === "controls" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {IT_CONTROL_CASES.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.type === "ITAC"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.type === "ITGC"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {item.type === "ITAC"
                      ? "Application Control (ITAC)"
                      : item.type === "ITGC"
                      ? "General Control (ITGC)"
                      : "Fraud Case Study"}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <strong className="text-slate-800 block mb-0.5">สถานการณ์ (Scenario):</strong>
                    {item.scenario}
                  </div>

                  <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-100 text-rose-950">
                    <strong className="text-rose-900 block mb-0.5">ช่องโหว่ความเสี่ยง (Vulnerability):</strong>
                    {item.vulnerability}
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-950">
                    <strong className="text-emerald-900 block mb-0.5">การควบคุมที่ถูกต้อง (Internal Control Solution):</strong>
                    {item.controlSolution}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100">
                  ผลกระทบในชีวิตจริง: {item.realWorldImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: SOD Conflict Matrix Check */}
      {activeTab === "sod" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              การตรวจสอบความขัดแย้งของสิทธิ์ในระบบ (Segregation of Duties - SOD Conflict Checker)
            </h3>
            <p className="text-xs text-slate-500">
              จำลองการสแกนสิทธิ์ User Permissions ในระบบ ERP เพื่อค้นหาผู้ใช้ที่ถือสิทธิ์ทับซ้อนอันนำไปสู่การทุจริต
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOD_MATRIX_RULES.map((rule, idx) => {
              const isSelected = selectedRoleIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedRoleIndex(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-purple-500 bg-purple-50/40 shadow-xs ring-1 ring-purple-400"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">คู่สิทธิ์ลำดับที่ {idx + 1}</span>
                    {rule.hasConflict ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        SOD CONFLICT (เสี่ยงทุจริต)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        ALLOWED (ปลอดภัย)
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-slate-800 font-medium">สิทธิ์ A: {rule.roleA}</div>
                    <div className="text-slate-800 font-medium">สิทธิ์ B: {rule.roleB}</div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {rule.riskDescription}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Selected SOD Deep Dive */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-900">
              มาตรการควบคุมบรรเทาความเสี่ยง (Mitigating Control Required):
            </span>
            <p className="text-slate-700 leading-relaxed">
              {SOD_MATRIX_RULES[selectedRoleIndex].mitigatingControl}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Fraud Detection Lab */}
      {activeTab === "forensic" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <FileSearch className="w-4 h-4 mr-2 text-purple-600" />
                ภารกิจ: สวมบทบาทเป็นผู้ตรวจสอบบัญชีดิจิทัล (Digital Forensic Auditor)
              </h3>
              <p className="text-xs text-slate-500">
                คลิกปุ่ม "🚩 ติดธงสงสัยทุจริต" ในแถวที่มีพฤติกรรมผิดปกติ (บิลซ้ำ, ลงนอกเวลา, พนักงานผี) แล้วกดประเมินคะแนน
              </p>
            </div>

            <button
              onClick={handleEvaluateForensics}
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              ส่งผลการตรวจสอบ & ประเมินคะแนน
            </button>
          </div>

          {evaluationMessage && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
                forensicScore >= 80
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              <span>{evaluationMessage}</span>
              <span className="font-bold font-mono text-sm">คะแนน: {forensicScore}/100</span>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">เลขที่เอกสาร</th>
                  <th className="py-2.5 px-3">คู่ค้า / รายการ</th>
                  <th className="py-2.5 px-3 text-right">จำนวนเงิน</th>
                  <th className="py-2.5 px-3">วันที่ / เวลาที่สร้าง</th>
                  <th className="py-2.5 px-3">ผู้บันทึก (User)</th>
                  <th className="py-2.5 px-3 text-center">การตรวจสอบ (Audit Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {records.map((rec) => (
                  <tr
                    key={rec.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      rec.isFlagged ? "bg-rose-50/60" : ""
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-medium">{rec.docNo}</td>
                    <td className="py-2.5 px-3 font-medium">{rec.vendorName}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      ฿{rec.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <div>{rec.date}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{rec.createdTime}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{rec.creator}</td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => toggleFlagRecord(rec.id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                          rec.isFlagged
                            ? "bg-rose-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {rec.isFlagged ? "🚩 ติดธงสงสัยแล้ว" : "ตรวจสอบปกติ"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Benford's Law Digital Forensic */}
      {activeTab === "benford" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              การตรวจสอบกฎของเบนฟอร์ด (Benford's Law First-Digit Forensic Test)
            </h3>
            <p className="text-xs text-slate-500">
              เทคนิคคณิตศาสตร์สถิติขั้นสูงที่กรมสรรพากรและสำนักงาน Big 4 ใช้ตรวจจับธุรกรรมที่มนุษย์แต่งตัวเลขขึ้นเอง
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            ในชุดข้อมูลทางการเงินตามธรรมชาติ (เช่น ยอดบิล, ยอดเบิกจ่าย, เช็ค) เลขตัวแรกสุด (First Digit) จะไม่กระจายเท่ากัน 11.1% แต่เลข <strong>1</strong> จะปรากฏบ่อยที่สุดถึง <strong>30.1%</strong> ในขณะที่เลข <strong>9</strong> จะปรากฏเพียง <strong>4.6%</strong> หากตัวเลขที่สแกนเบี่ยงเบนจากเส้นทฤษฎีอย่างมีนัยสำคัญ แสดงว่ามีโอกาสสูงที่มีการตกแต่งบัญชี
          </div>

          <div className="grid grid-cols-1 md:grid-cols-9 gap-2 text-center text-xs">
            {[
              { digit: 1, theory: "30.1%", actual: "29.4%", status: "normal" },
              { digit: 2, theory: "17.6%", actual: "18.1%", status: "normal" },
              { digit: 3, theory: "12.5%", actual: "12.0%", status: "normal" },
              { digit: 4, theory: "9.7%", actual: "9.5%", status: "normal" },
              { digit: 5, theory: "7.9%", actual: "8.2%", status: "normal" },
              { digit: 6, theory: "6.7%", actual: "6.9%", status: "normal" },
              { digit: 7, theory: "5.8%", actual: "16.4%", status: "anomaly" }, // Spike!
              { digit: 8, theory: "5.1%", actual: "4.8%", status: "normal" },
              { digit: 9, theory: "4.6%", actual: "4.7%", status: "normal" },
            ].map((d) => (
              <div
                key={d.digit}
                className={`p-3 rounded-xl border space-y-1 ${
                  d.status === "anomaly"
                    ? "bg-rose-50 border-rose-300 text-rose-950 ring-1 ring-rose-400"
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <div className="text-lg font-bold font-mono">{d.digit}</div>
                <div className="text-[10px] text-slate-400">ทฤษฎี: {d.theory}</div>
                <div
                  className={`font-mono font-bold text-xs ${
                    d.status === "anomaly" ? "text-rose-600" : "text-slate-700"
                  }`}
                >
                  จริง: {d.actual}
                </div>
                {d.status === "anomaly" && (
                  <span className="text-[9px] bg-rose-200 text-rose-800 font-bold px-1 rounded block">
                    ANOMALY!
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start space-x-2">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong>ผลการตรวจจับทางนิติวิทยาศาสตร์:</strong> ตรวจพบการพุ่งสูงผิดปกติ (Spike) ของธุรกรรมที่ขึ้นต้นด้วยเลข <strong>7</strong> (16.4% เทียบกับมาตรฐาน 5.8%) ควรคัดเลือกชุดธุรกรรมที่ยอดขึ้นต้นด้วยเลข 7 (เช่น 70,000 หรือ 7,500 บาท) เพื่อสุ่มตรวจเอกสารตัวจริง (Vouching & Inspection) ทันที
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
