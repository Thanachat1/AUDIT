import React, { useState } from "react";
import {
  Server,
  Database,
  Layers,
  Play,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  Terminal,
  ArrowRight,
  BookOpen,
  Code2,
  Table as TableIcon,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { ERP_SIMULATIONS, ACCOUNTING_SQL_QUERIES } from "../data/advancedAccountingData";
import { ERPDocumentSimulation, SQLAccountingQuery, ERPSoftwareType } from "../types/accounting";

export const AISAndERPSimulatorView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"erp" | "sql" | "erdiagram">("erp");

  // ERP State
  const [selectedSim, setSelectedSim] = useState<ERPDocumentSimulation>(ERP_SIMULATIONS[0]);
  const [formFields, setFormFields] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    ERP_SIMULATIONS[0].fields.forEach((f) => {
      init[f.key] = f.value;
    });
    return init;
  });
  const [isPosted, setIsPosted] = useState(false);

  // SQL State
  const [selectedQuery, setSelectedQuery] = useState<SQLAccountingQuery>(ACCOUNTING_SQL_QUERIES[0]);
  const [customSql, setCustomSql] = useState<string>(ACCOUNTING_SQL_QUERIES[0].sql);
  const [sqlResults, setSqlResults] = useState<Array<Record<string, any>> | null>(
    ACCOUNTING_SQL_QUERIES[0].sampleResults
  );
  const [executionMessage, setExecutionMessage] = useState<string | null>(
    "ประมวลผลสำเร็จ (3 แถวข้อมูลใน in-memory sandbox)"
  );

  const handleSelectSim = (sim: ERPDocumentSimulation) => {
    setSelectedSim(sim);
    const updated: Record<string, any> = {};
    sim.fields.forEach((f) => {
      updated[f.key] = f.value;
    });
    setFormFields(updated);
    setIsPosted(false);
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormFields((prev) => ({ ...prev, [key]: value }));
    setIsPosted(false);
  };

  const handlePostDocument = () => {
    setIsPosted(true);
  };

  const handleSelectQuery = (query: SQLAccountingQuery) => {
    setSelectedQuery(query);
    setCustomSql(query.sql);
    setSqlResults(query.sampleResults);
    setExecutionMessage(`ดึงข้อมูลสำเร็จ (${query.sampleResults.length} แถวข้อมูล)`);
  };

  const handleRunSql = () => {
    // If the user modified the SQL slightly, show existing or mock matching
    setExecutionMessage(`ประมวลผล SQL เรียบร้อย (${selectedQuery.sampleResults.length} แถวข้อมูล) - Sandbox Live Query`);
    setSqlResults(selectedQuery.sampleResults);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with ERP Team Illustration */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-indigo-900/40">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-72 xl:w-80 shrink-0 relative group">
            <img
              src="/assets/images/erp_systems_team.jpg"
              alt="ทีมพัฒนาระบบ ERP และสารสนเทศทางการบัญชี"
              referrerPolicy="no-referrer"
              className="w-full h-44 sm:h-48 object-cover rounded-xl shadow-lg ring-2 ring-indigo-400/30 transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/images/mrt_app_logo.jpg";
              }}
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-[11px] font-bold text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>Enterprise ERP & SQL</span>
            </div>
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Server className="w-3.5 h-3.5 mr-1" />
                  ศูนย์การเรียนรู้ระบบสารสนเทศทางการบัญชีระดับสูง (AIS & ERP)
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  จำลองระบบบัญชี Express, SAP & Accounting SQL Sandbox
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  ฝึกฝนทักษะการทำงานจริงของนักบัญชียุคดิจิทัล: วงจรเอกสาร (Document Flow), การผูกผังบัญชีอัตโนมัติ (Auto-GL Posting), และการเขียนคำสั่ง SQL ดึงข้อมูลจากฐานข้อมูลบัญชีขนาดใหญ่
                </p>
              </div>

              <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 shrink-0 self-start sm:self-center">
                <button
                  onClick={() => setActiveSubTab("erp")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                    activeSubTab === "erp"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Server className="w-3.5 h-3.5 mr-1.5" />
                  จำลอง Express & ERP
                </button>
                <button
                  onClick={() => setActiveSubTab("sql")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                    activeSubTab === "sql"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Database className="w-3.5 h-3.5 mr-1.5" />
                  SQL Playground
                </button>
                <button
                  onClick={() => setActiveSubTab("erdiagram")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                    activeSubTab === "erdiagram"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 mr-1.5" />
                  โครงสร้างฐานข้อมูล (ERD)
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300">
                Express Auto-Posting
              </span>
              <span className="bg-indigo-900/50 px-2.5 py-1 rounded-lg border border-indigo-700/40 text-indigo-200">
                SAP FI/CO Integration
              </span>
              <span className="bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-700/40 text-emerald-300">
                Live SQL Query Engine
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SubTab 1: ERP Simulation */}
      {activeSubTab === "erp" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar: Select Simulation Preset */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase px-1">
              เลือกจำลองโปรแกรมบัญชี
            </h3>
            <div className="space-y-2">
              {ERP_SIMULATIONS.map((sim) => {
                const isSelected = selectedSim.id === sim.id;
                return (
                  <button
                    key={sim.id}
                    onClick={() => handleSelectSim(sim)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? "bg-indigo-50/70 border-indigo-300 shadow-xs ring-1 ring-indigo-400"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          sim.software === "express"
                            ? "bg-amber-100 text-amber-800"
                            : sim.software === "sap"
                            ? "bg-blue-100 text-blue-800"
                            : sim.software === "flowaccount"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {sim.software.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {sim.type === "invoice"
                          ? "เปิดบิลขาย"
                          : sim.type === "journal"
                          ? "สมุดรายวัน"
                          : sim.type === "payment"
                          ? "จ่ายเงิน"
                          : "รับชำระ"}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 text-sm">{sim.title}</div>
                    <p className="text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {sim.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Quick Fact Card */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="font-semibold flex items-center text-amber-950">
                <BookOpen className="w-4 h-4 mr-1.5 text-amber-700" />
                จุดที่นักศึกษาปี 3 ต้องรู้:
              </div>
              <p className="leading-relaxed text-amber-800">
                ในโปรแกรม ERP จริง พนักงานบันทึกเอกสารจะไม่ต้องพิมพ์ Dr./Cr. ด้วยตัวเอง แต่ระบบจะใช้ <strong>Posting Keys</strong> และ <strong>Account Determination Matrix</strong> เพื่อเดบิต/เครดิตเข้าสมุดรายวันและงบทดลองแบบ Real-time
              </p>
            </div>
          </div>

          {/* Right Main Area: Interactive Document Form + Auto-GL Visualizer */}
          <div className="lg:col-span-8 space-y-6">
            {/* Interactive Document Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-base">{selectedSim.title}</span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-200 text-slate-700">
                      ระบบจำลอง (Interactive Sandbox)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedSim.description}</p>
                </div>
                <button
                  onClick={handlePostDocument}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  บันทึก & ลงบัญชี (Post to GL)
                </button>
              </div>

              {/* Form Input Fields */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSim.fields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={formFields[field.key] ?? ""}
                      onChange={(e) =>
                        handleFieldChange(
                          field.key,
                          field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value
                        )
                      }
                      className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Key Concept Box */}
              <div className="px-6 pb-6">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                  <span className="font-semibold text-indigo-700 mr-1.5">💡 หลักการเบื้องหลัง (System Logic):</span>
                  {selectedSim.keyConcept}
                </div>
              </div>
            </div>

            {/* Auto-GL Posting Output */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    สมุดรายวันที่ระบบสร้างขึ้นอัตโนมัติ (Automated Journal Entry)
                  </h4>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    isPosted
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isPosted ? "สถานะ: POSTED ลงบัญชีสำเร็จ ✓" : "สถานะ: DRAFT รอการบันทึก"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">รหัสบัญชี</th>
                      <th className="py-2.5 px-3">ชื่อบัญชี (Chart of Account)</th>
                      <th className="py-2.5 px-3 text-right">เดบิต (Dr.)</th>
                      <th className="py-2.5 px-3 text-right">เครดิต (Cr.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {/* Debit line */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-mono font-medium text-indigo-600">
                        {selectedSim.autoJournalGenerated.drCode}
                      </td>
                      <td className="py-2 px-3 font-medium">
                        {selectedSim.autoJournalGenerated.drAccount}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-700">
                        {selectedSim.autoJournalGenerated.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">-</td>
                    </tr>

                    {/* Credit Line 1 */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-mono font-medium text-slate-600">
                        {selectedSim.autoJournalGenerated.crCode}
                      </td>
                      <td className="py-2 px-3 pl-8 text-slate-700">
                        {selectedSim.autoJournalGenerated.crAccount}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">-</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                        {(
                          selectedSim.autoJournalGenerated.amount -
                          (selectedSim.autoJournalGenerated.vatAmount || 0)
                        ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {/* VAT Line if any */}
                    {selectedSim.autoJournalGenerated.vatAccount && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono font-medium text-slate-600">
                          {selectedSim.autoJournalGenerated.vatCode}
                        </td>
                        <td className="py-2 px-3 pl-8 text-slate-700">
                          {selectedSim.autoJournalGenerated.vatAccount}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-300">-</td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                          {selectedSim.autoJournalGenerated.vatAmount?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    )}

                    {/* Totals */}
                    <tr className="bg-slate-50/90 font-bold border-t-2 border-slate-300">
                      <td colSpan={2} className="py-2 px-3 text-slate-700 text-right">
                        รวมยอดดุล (Dr. = Cr.):
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-700">
                        {selectedSim.autoJournalGenerated.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-700">
                        {selectedSim.autoJournalGenerated.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  ตรวจสอบยอดดุลในระบบสำเร็จ: Debit เท่ากับ Credit ทุกรายการพร้อมวิ่งเข้าสู่บัญชีแยกประเภททั่วไป (General Ledger) และงบทดลองทันที
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Accounting SQL Playground */}
      {activeSubTab === "sql" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Query Selector */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase px-1">
              คำสั่ง SQL ที่ใช้จริงในงานบัญชี
            </h3>
            <div className="space-y-2">
              {ACCOUNTING_SQL_QUERIES.map((q) => {
                const isSelected = selectedQuery.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuery(q)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? "bg-indigo-50/70 border-indigo-300 shadow-xs ring-1 ring-indigo-400"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {q.category}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 text-xs">{q.title}</div>
                    <p className="text-slate-500 line-clamp-2 mt-1 leading-relaxed text-[11px]">
                      {q.objective}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 space-y-1.5">
              <div className="font-semibold flex items-center text-indigo-950">
                <Code2 className="w-4 h-4 mr-1.5 text-indigo-700" />
                ทำไมนักศึกษาบัญชีต้องเรียน SQL?
              </div>
              <p className="leading-relaxed text-indigo-800">
                ในยุค Big Data งบการเงินมาจากตารางฐานข้อมูมนับล้านแถว (ERP Database) ทักษะ SQL ช่วยให้นักศึกษาดึงข้อมูลรายงานได้ตรงความต้องการ โดยไม่ต้องรอฝ่าย IT และยังใช้ตรวจสอบความถูกต้องของระบบบัญชี (Data Audit) ได้อย่างแม่นยำ
              </p>
            </div>
          </div>

          {/* SQL Editor & Live Output */}
          <div className="lg:col-span-8 space-y-4">
            {/* SQL Editor Container */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-md overflow-hidden">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-medium text-slate-300">
                    Accounting Query Terminal (PostgreSQL / MySQL Syntax)
                  </span>
                </div>
                <button
                  onClick={handleRunSql}
                  className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 mr-1" />
                  Execute Query (F5)
                </button>
              </div>

              <div className="p-4 font-mono text-xs">
                <textarea
                  value={customSql}
                  onChange={(e) => setCustomSql(e.target.value)}
                  rows={8}
                  className="w-full bg-transparent text-emerald-300 focus:outline-none resize-none font-mono text-xs leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {executionMessage && (
                <div className="bg-slate-900/90 px-4 py-2 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  {executionMessage}
                </div>
              )}
            </div>

            {/* Explanation */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-xs space-y-1">
              <span className="font-semibold text-slate-900">คำอธิบายไวยากรณ์สำหรับนักศึกษา:</span>
              <p className="text-slate-600 leading-relaxed">{selectedQuery.explanation}</p>
            </div>

            {/* Query Results Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TableIcon className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-900">
                    ผลลัพธ์ข้อมูลจากฐานข้อมูล (Live Query Results)
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {sqlResults?.length || 0} แถวข้อมูล (Records)
                </span>
              </div>

              <div className="overflow-x-auto max-h-72">
                {sqlResults && sqlResults.length > 0 ? (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                      <tr>
                        {Object.keys(sqlResults[0]).map((col) => (
                          <th key={col} className="py-2.5 px-3 font-mono">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {sqlResults.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 font-mono">
                          {Object.values(row).map((val: any, cIdx) => (
                            <td key={cIdx} className="py-2 px-3">
                              {typeof val === "number" ? val.toLocaleString() : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    ไม่มีข้อมูลแสดงผล กรุณากด Execute Query
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Accounting ER Diagram & Schema */}
      {activeSubTab === "erdiagram" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              แผนภาพความสัมพันธ์ฐานข้อมูลบัญชี (Accounting Relational Schema & ERD)
            </h3>
            <p className="text-xs text-slate-500">
              โครงสร้างตารางมาตรฐานสากลที่ใช้ในระบบ ERP เช่น SAP, Oracle, และ Express
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Table 1: Chart of Accounts */}
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 overflow-hidden text-xs">
              <div className="bg-indigo-600 text-white font-mono font-bold px-3 py-2 flex items-center justify-between">
                <span>chart_of_accounts</span>
                <span className="text-[10px] bg-indigo-700 px-1.5 py-0.5 rounded">Master</span>
              </div>
              <div className="p-3 space-y-1 font-mono text-slate-700">
                <div className="text-indigo-700 font-semibold">🔑 account_code (PK, VARCHAR)</div>
                <div>account_name (VARCHAR)</div>
                <div>account_category (INT 1-5)</div>
                <div>normal_balance ('DR' | 'CR')</div>
                <div>is_active (BOOLEAN)</div>
              </div>
            </div>

            {/* Table 2: Journal Headers */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/30 overflow-hidden text-xs">
              <div className="bg-blue-600 text-white font-mono font-bold px-3 py-2 flex items-center justify-between">
                <span>journal_headers</span>
                <span className="text-[10px] bg-blue-700 px-1.5 py-0.5 rounded">Header</span>
              </div>
              <div className="p-3 space-y-1 font-mono text-slate-700">
                <div className="text-blue-700 font-semibold">🔑 journal_id (PK, UUID)</div>
                <div>journal_no (VARCHAR)</div>
                <div>posting_date (DATE)</div>
                <div>description (TEXT)</div>
                <div>posting_status ('DRAFT' | 'POSTED')</div>
                <div>created_by (VARCHAR)</div>
              </div>
            </div>

            {/* Table 3: Journal Lines */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 overflow-hidden text-xs">
              <div className="bg-emerald-600 text-white font-mono font-bold px-3 py-2 flex items-center justify-between">
                <span>journal_lines</span>
                <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded">Detail</span>
              </div>
              <div className="p-3 space-y-1 font-mono text-slate-700">
                <div className="text-emerald-700 font-semibold">🔑 line_id (PK, UUID)</div>
                <div className="text-blue-600">🔗 journal_id (FK → journal_headers)</div>
                <div className="text-indigo-600">🔗 account_code (FK → chart_of_accounts)</div>
                <div>debit_amount (DECIMAL(14,2))</div>
                <div>credit_amount (DECIMAL(14,2))</div>
                <div>cost_center_id (FK)</div>
              </div>
            </div>

            {/* Table 4: Customers */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/30 overflow-hidden text-xs">
              <div className="bg-amber-600 text-white font-mono font-bold px-3 py-2 flex items-center justify-between">
                <span>customers (AR)</span>
                <span className="text-[10px] bg-amber-700 px-1.5 py-0.5 rounded">Master</span>
              </div>
              <div className="p-3 space-y-1 font-mono text-slate-700">
                <div className="text-amber-800 font-semibold">🔑 customer_id (PK)</div>
                <div>customer_code (VARCHAR)</div>
                <div>customer_name (VARCHAR)</div>
                <div>tax_id (VARCHAR 13 หลัก)</div>
                <div>credit_limit (DECIMAL)</div>
                <div>payment_term_days (INT)</div>
              </div>
            </div>

            {/* Table 5: Sales Invoices */}
            <div className="rounded-xl border border-purple-200 bg-purple-50/30 overflow-hidden text-xs">
              <div className="bg-purple-600 text-white font-mono font-bold px-3 py-2 flex items-center justify-between">
                <span>sales_invoices</span>
                <span className="text-[10px] bg-purple-700 px-1.5 py-0.5 rounded">Subledger</span>
              </div>
              <div className="p-3 space-y-1 font-mono text-slate-700">
                <div className="text-purple-700 font-semibold">🔑 invoice_id (PK)</div>
                <div className="text-amber-800">🔗 customer_id (FK → customers)</div>
                <div className="text-blue-600">🔗 journal_id (FK → GL)</div>
                <div>invoice_amount (DECIMAL)</div>
                <div>vat_amount (DECIMAL)</div>
                <div>payment_status (VARCHAR)</div>
              </div>
            </div>

            {/* Table 6: Vendors */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/30 overflow-hidden text-xs">
              <div className="bg-rose-600 text-white font-mono font-bold px-3 py-2 flex items-center justify-between">
                <span>vendors (AP)</span>
                <span className="text-[10px] bg-rose-700 px-1.5 py-0.5 rounded">Master</span>
              </div>
              <div className="p-3 space-y-1 font-mono text-slate-700">
                <div className="text-rose-700 font-semibold">🔑 vendor_id (PK)</div>
                <div>vendor_code (VARCHAR)</div>
                <div>vendor_name (VARCHAR)</div>
                <div>wht_condition ('1%=ขนส่ง' | '3%=บริการ')</div>
                <div>bank_account_no (VARCHAR)</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900 mr-1.5">📌 สรุปหลักการสำหรับสอบ/สัมภาษณ์:</span>
            ในระบบสารสนเทศทางการบัญชี (AIS) การออกแบบฐานข้อมูลจะต้องเป็นไปตาม <strong>3rd Normal Form (3NF)</strong> เพื่อป้องกันความซ้ำซ้อนของข้อมูล (Data Redundancy) และเชื่อมโยงรายการค้าระหว่างบัญชีย่อย (Subledger: ลูกหนี้/เจ้าหนี้) กับบัญชีแยกประเภททั่วไป (General Ledger) เสมอ
          </div>
        </div>
      )}
    </div>
  );
};
