import React, { useState } from "react";
import {
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
  Printer,
  CheckCircle2,
  Lock,
  ChevronRight,
  Send,
  Loader2,
  Building,
  Target,
  FileText,
  User,
  Star,
  BookOpen,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { INITIAL_SKILL_BADGES, INTERVIEW_QUESTIONS } from "../data/advancedAccountingData";
import { SkillBadge, MockInterviewResult } from "../types/accounting";

export const CareerPortfolioAndInterviewView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"badges" | "resume" | "interview">("badges");

  // Skill Badges State
  const [badges, setBadges] = useState<SkillBadge[]>(INITIAL_SKILL_BADGES);

  // Student Profile for Resume
  const [studentName, setStudentName] = useState("สมชาย ใจรักบัญชี");
  const [studentProgram, setStudentProgram] = useState("สาขาวิชาการบัญชีและระบบสารสนเทศ (AIS)");
  const [studentUniversity, setStudentUniversity] = useState("มหาวิทยาลัยเทคโนโลยีราชมงคล / อาชีวศึกษา");
  const [studentGpa, setStudentGpa] = useState("3.65");

  // Interview Simulator State
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [studentAnswer, setStudentAnswer] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [interviewResult, setInterviewResult] = useState<MockInterviewResult | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  const currentQuestion = INTERVIEW_QUESTIONS[selectedQuestionIndex];

  const handleEvaluateInterview = async () => {
    if (!studentAnswer.trim()) return;
    setIsEvaluating(true);
    setEvaluationError(null);

    try {
      const response = await fetch("/api/accounting/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: `${currentQuestion.company} - ${currentQuestion.position}`,
          question: currentQuestion.question,
          studentAnswer: studentAnswer,
          rubric: currentQuestion.rubric,
        }),
      });

      if (!response.ok) {
        throw new Error("ระบบประเมินการสัมภาษณ์ขัดข้องชั่วคราว");
      }

      const data: MockInterviewResult = await response.json();
      setInterviewResult(data);

      // Unlock a badge if good score!
      if (data.score >= 7) {
        setBadges((prev) =>
          prev.map((b) =>
            b.id === "badge-digital-audit" || b.id === "badge-tfrs-tax"
              ? { ...b, isUnlocked: true, unlockedAt: new Date().toISOString().split("T")[0] }
              : b
          )
        );
      }
    } catch (err: any) {
      console.error(err);
      setEvaluationError(err.message || "เกิดข้อผิดพลาดในการประเมินคำตอบ");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handlePrintResume = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md border border-emerald-900/40">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Briefcase className="w-3.5 h-3.5 mr-1" />
              คลังตัวอย่างงานจริงและการเตรียมตัวฝึกงาน (Real-World Portfolio & Internship Prep)
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Smart Resume, Skill Badges & จำลองการสัมภาษณ์งาน Big 4
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl">
              เตรียมความพร้อมสู่การเป็นนักศึกษาฝึกงานยอดเยี่ยม: สะสมเหรียญทักษะดิจิทัล ออกทรานสคริปต์รับรองความสามารถ และทดสอบสัมภาษณ์จำลองกับระบบ AI ของสำนักงานบัญชีชั้นนำ
            </p>
          </div>

          <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 self-start md:self-center">
            <button
              onClick={() => setActiveTab("badges")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                activeTab === "badges"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Award className="w-3.5 h-3.5 mr-1.5" />
              เหรียญทักษะ (Skill Badges)
            </button>
            <button
              onClick={() => setActiveTab("resume")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                activeTab === "resume"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Smart Resume & Transcript
            </button>
            <button
              onClick={() => setActiveTab("interview")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center ${
                activeTab === "interview"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Target className="w-3.5 h-3.5 mr-1.5" />
              จำลองสัมภาษณ์งาน Big 4
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Skill Badges */}
      {activeTab === "badges" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                เหรียญทักษะวิชาชีพบัญชีดิจิทัล (Verified Accounting Skill Badges)
              </h3>
              <p className="text-xs text-slate-500">
                ปลดล็อกเหรียญจากการทำแล็บ Express, เขียน SQL, สร้าง Power BI Dashboard, และสแกนข้อผิดพลาดในแอปนี้
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ปลดล็อกแล้ว {badges.filter((b) => b.isUnlocked).length} / {badges.length} เหรียญ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  badge.isUnlocked
                    ? "bg-white border-emerald-200 shadow-xs ring-1 ring-emerald-300/60"
                    : "bg-slate-50 border-slate-200 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      badge.isUnlocked
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {badge.isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      badge.isUnlocked
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {badge.level}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {badge.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{badge.title}</h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{badge.requirements}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    {badge.isUnlocked
                      ? `ปลดล็อกเมื่อ ${badge.unlockedAt}`
                      : "รอการทดสอบเพื่อปลดล็อก"}
                  </span>
                  {badge.isUnlocked && (
                    <span className="text-emerald-600 font-bold flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> ได้รับแล้ว
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Smart Resume & Digital Transcript */}
      {activeTab === "resume" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">
                ปรับแต่งข้อมูลส่วนตัวเพื่อพิมพ์ใบรับรองเรซูเม่ (Print-Ready)
              </span>
            </div>
            <button
              onClick={handlePrintResume}
              className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              พิมพ์เรซูเม่ / บันทึก PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">ชื่อ-นามสกุล:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">สาขาวิชา:</label>
              <input
                type="text"
                value={studentProgram}
                onChange={(e) => setStudentProgram(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">สถาบันการศึกษา:</label>
              <input
                type="text"
                value={studentUniversity}
                onChange={(e) => setStudentUniversity(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">เกรดเฉลี่ยสะสม (GPA):</label>
              <input
                type="text"
                value={studentGpa}
                onChange={(e) => setStudentGpa(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Printable Resume Canvas */}
          <div className="bg-white rounded-2xl border border-slate-300 p-8 shadow-sm space-y-6 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
            {/* Header */}
            <div className="border-b-2 border-indigo-600 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{studentName}</h2>
                <p className="text-sm font-medium text-indigo-700 mt-0.5">{studentProgram}</p>
                <p className="text-xs text-slate-500">{studentUniversity} | เกรดเฉลี่ย: {studentGpa}</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AuditFlow Certified 2026
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Computer Accounting Specialization</p>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                บทสรุปประวัติและความเชี่ยวชาญ (Professional Profile)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                นักศึกษาชั้นปีที่ 3 สาขาวิชาการบัญชีที่มีทักษะความชำนาญทั้งด้านมาตรฐานการบัญชี (TFRS) และเทคโนโลยีสารสนเทศทางการบัญชี (AIS & ERP) ผ่านการฝึกปฏิบัติจำลองการบันทึกรายการในโปรแกรม Express และ SAP S/4HANA, มีความสามารถในการเขียนคำสั่ง SQL เพื่อวิเคราะห์ฐานข้อมูลทางการเงิน, ออกแบบแดชบอร์ด Power BI สำหรับผู้บริหาร และเข้าใจกระบวนการตรวจสอบระบบสารสนเทศ (IT Audit & Controls)
              </p>
            </div>

            {/* Verified Digital Competencies & Badges */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                ทักษะที่ผ่านการประเมินและรับรอง (Verified Digital Skills & Badges)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start space-x-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{b.title}</div>
                      <div className="text-[11px] text-slate-500">{b.requirements}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Toolset */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                เครื่องมือและระบบที่สามารถใช้งานได้ทันที (Technical Toolset)
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  "Express Accounting Software (GL, AP, AR, IC)",
                  "SAP S/4HANA (Fiori, FB50, FS00)",
                  "FlowAccount & PEAK Cloud ERP",
                  "SQL for Accounting (PostgreSQL / MySQL)",
                  "Power BI & Tableau (DAX Formulas, Star Schema)",
                  "TFRS 15 Revenue & TFRS 16 Leases",
                  "Corporate Income Tax (ภ.ง.ด.50 ม.65 ทวิ/ตรี)",
                  "IT General & Application Controls (3-Way Matching, SOD)",
                ].map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200/80 rounded-md font-medium text-[11px]"
                  >
                    ✓ {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
              <span>ออกโดย AuditFlow Verification Engine | รหัสอ้างอิง: AF-AUDIT-2026-TH</span>
              <span>พร้อมสำหรับการยื่นสมัครฝึกงานและทำงานจริงทันที</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Big 4 & Corporate Mock Interview Simulator */}
      {activeTab === "interview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Questions List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase px-1">
              เลือกคำถามคัดเลือกเข้าทำงานจริง
            </h3>
            <div className="space-y-2">
              {INTERVIEW_QUESTIONS.map((q, idx) => {
                const isSelected = selectedQuestionIndex === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestionIndex(idx);
                      setInterviewResult(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? "bg-emerald-50/70 border-emerald-400 shadow-xs ring-1 ring-emerald-400"
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-[11px]">{q.company}</span>
                    </div>
                    <div className="font-semibold text-emerald-900 text-xs">{q.position}</div>
                    <div className="text-[11px] text-slate-500 mt-1">หัวข้อ: {q.topic}</div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-900">เกณฑ์การให้คะแนนโดย AI:</span>
              <p className="leading-relaxed">
                ระบบจะประเมินทั้ง <strong>ความถูกต้องของมาตรฐานบัญชี (Technical Accuracy)</strong>, <strong>ความเข้าใจเชิงระบบ (IT/ERP Context)</strong>, และ <strong>ทักษะการตอบอย่างมืออาชีพ</strong> เหมือนสัมภาษณ์กับ Partner ตัวจริง
              </p>
            </div>
          </div>

          {/* Right Area: Question + Answer Box + AI Verdict */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {currentQuestion.company}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  ตำแหน่ง: {currentQuestion.position}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-relaxed">
                  ❓ คำถามสัมภาษณ์: "{currentQuestion.question}"
                </h4>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  คำตอบของคุณ (ฝึกพิมพ์ตอบอย่างเป็นเหตุเป็นผลและอ้างอิงมาตรฐานบัญชี/ระบบ):
                </label>
                <textarea
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  rows={6}
                  placeholder="พิมพ์คำตอบของคุณที่นี่ เช่น หากพบลูกหนี้มียอดเครดิตคงเหลือ ขั้นตอนแรกผมจะตรวจสอบสาเหตุว่าเกิดจากเงินรับล่วงหน้า (Customer Advance Deposit) หรือเกิดจากการบันทึกใบลดหนี้ผิดพลาด..."
                  className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white resize-y leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  {studentAnswer.length} ตัวอักษร
                </span>
                <button
                  onClick={handleEvaluateInterview}
                  disabled={isEvaluating || !studentAnswer.trim()}
                  className="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      กรรมการ AI กำลังประเมิน...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      ส่งคำตอบให้กรรมการประเมิน (AI Evaluation)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {evaluationError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {evaluationError}
              </div>
            )}

            {/* AI Evaluation Result Card */}
            {interviewResult && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <h4 className="text-sm font-bold text-slate-900">
                      ผลการประเมินการสัมภาษณ์ (Interview Evaluation Verdict)
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold font-mono text-emerald-700">
                      {interviewResult.score} / {interviewResult.maxScore}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {interviewResult.overallVerdict}
                    </span>
                  </div>
                </div>

                {/* Strengths */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-emerald-800 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    จุดเด่นในคำตอบของคุณ (Strengths):
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                    {interviewResult.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                {interviewResult.areasForImprovement?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-amber-800 flex items-center">
                      <Target className="w-3.5 h-3.5 mr-1 text-amber-600" />
                      สิ่งที่ควรเสริมให้คำตอบสมบูรณ์ยิ่งขึ้น (Areas for Improvement):
                    </span>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                      {interviewResult.areasForImprovement.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Model Answer */}
                {interviewResult.modelAnswer && (
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs space-y-1.5 font-mono">
                    <span className="font-sans font-bold text-emerald-400 block">
                      💎 ตัวอย่างแนวคำตอบระดับคะแนนเต็ม (Model Answer):
                    </span>
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-200 font-sans">
                      {interviewResult.modelAnswer}
                    </p>
                  </div>
                )}

                {/* Follow-up question if any */}
                {interviewResult.followUpQuestion && (
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-900">
                    <strong>💡 คำถามที่ผู้สัมภาษณ์อาจถามเจาะลึกต่อ:</strong>{" "}
                    {interviewResult.followUpQuestion}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enterprise ERP & Developer Consultation Callout */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-lg border border-indigo-900/60 mt-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <img
              src="/assets/images/mrt_developer_portrait.jpg"
              alt="MR.T Portrait"
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-400 shadow-md shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/images/mrt_app_logo.jpg";
              }}
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                MR.T — Software Developer & ERP Consultant
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                ต้องการที่ปรึกษาหรือระบบ ERP / จัดการภาษีสำหรับองค์กรจริง?
              </h4>
              <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
                ERP, ระบบคำนวณภาษีและจัดการรายรับ-รายจ่ายตามมาตรฐานสากล พร้อมช่วยให้ธุรกิจคุณเติบโตอย่างเป็นระบบ
              </p>
            </div>
          </div>

          {/* Contact Actions & LINE QR */}
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto justify-center">
            {/* LINE QR Thumbnail */}
            <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl border border-white/10">
              <img
                src="https://qr-official.line.me/gs/M_030wgwqn_GW.png?oat_content=qr"
                alt="LINE QR"
                className="w-14 h-14 bg-white p-1 rounded-lg object-contain shadow-2xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/images/mrt_line_qr.png";
                }}
              />
              <div className="text-left text-xs pr-1">
                <div className="text-[10px] text-emerald-300 font-bold">LINE Official</div>
                <div className="font-bold text-white">ID: MR.T</div>
                <div className="text-[10px] text-slate-300">สแกนเพิ่มเพื่อน</div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <a
                href="tel:0612155870"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 mr-1.5" />
                โทร 061-215-5870
              </a>
              <a
                href="mailto:investorstar9966@gmail.com"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/10 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 mr-1.5 text-indigo-300" />
                investorstar9966@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
