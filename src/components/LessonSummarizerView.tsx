import React, { useState } from "react";
import { LessonSummaryResponse, PracticeQuizQuestion } from "../types/accounting";
import { PRELOADED_LESSONS } from "../data/presets";
import {
  BookOpen,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Laptop,
  ArrowRight,
  ListOrdered,
  FileCheck,
} from "lucide-react";

export const LessonSummarizerView: React.FC = () => {
  const [selectedPreloadedKey, setSelectedPreloadedKey] = useState<string>("accounting_cycle");
  const [activeLesson, setActiveLesson] = useState<LessonSummaryResponse>(
    PRELOADED_LESSONS["accounting_cycle"]
  );

  // Custom AI generation state
  const [customTopic, setCustomTopic] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [educationLevel, setEducationLevel] = useState("ปวส./ป.ตรี");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quiz state: stores selected option index for each question
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const handleSelectPreloaded = (key: string) => {
    setSelectedPreloadedKey(key);
    setActiveLesson(PRELOADED_LESSONS[key]);
    setSelectedAnswers({});
    setShowExplanation({});
  };

  const handleGenerateCustomLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim() && !customNotes.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/accounting/summarize-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: customTopic,
          notes: customNotes,
          level: educationLevel,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการสรุปบทเรียน");
      }

      setActiveLesson(data);
      setSelectedPreloadedKey("custom");
      setSelectedAnswers({});
      setShowExplanation({});
    } catch (err: any) {
      setErrorMsg(err.message || "ไม่สามารถสรุปบทเรียนได้");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerQuiz = (qIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
    setShowExplanation((prev) => ({ ...prev, [qIndex]: true }));
  };

  return (
    <div id="lesson-summarizer-container" className="space-y-6">
      {/* Top Header & Preloaded Selection */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
              สรุปบทเรียนบัญชีคอมพิวเตอร์อัจฉริยะ (AI Lesson Summarizer)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              เลือกบทเรียนมาตรฐาน หรือพิมพ์หัวข้อและเลกเชอร์ที่ต้องการสรุป AI จะสกัดสาระสำคัญ รหัสบัญชี และแนวข้อสอบให้ทันที
            </p>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => handleSelectPreloaded("accounting_cycle")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedPreloadedKey === "accounting_cycle"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              1. วงจรบัญชี & ผังบัญชี
            </button>
            <button
              onClick={() => handleSelectPreloaded("adjusting_entries")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedPreloadedKey === "adjusting_entries"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              2. รายการปรับปรุง & กระดาษทำการ
            </button>
            <button
              onClick={() => handleSelectPreloaded("inventory_systems")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedPreloadedKey === "inventory_systems"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              3. สินค้า Perpetual vs Periodic
            </button>
          </div>
        </div>

        {/* Custom AI Summarizer Form Accordion */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <form onSubmit={handleGenerateCustomLesson} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                หรือสร้างสรุปบทเรียนใหม่ด้วย AI ตามที่ต้องการ:
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-500">ระดับการศึกษา:</span>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="text-xs py-0.5 px-2 border border-slate-200 rounded-md bg-white text-slate-700"
                >
                  <option value="ปวช.">ปวช. (ประกาศนียบัตรวิชาชีพ)</option>
                  <option value="ปวส.">ปวส. (ประกาศนียบัตรวิชาชีพชั้นสูง)</option>
                  <option value="ปริญญาตรี">ปริญญาตรี บัญชี / บัญชีคอมพิวเตอร์</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="หัวข้อ เช่น การกระทบยอดเงินฝากธนาคาร หรือ บัญชีต้นทุนงานสั่งทำ"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <input
                  type="text"
                  placeholder="ข้อความเลกเชอร์เพิ่มเติม หรือสิ่งที่อยากเน้น (เว้นว่างได้)"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isGenerating || (!customTopic.trim() && !customNotes.trim())}
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors flex items-center whitespace-nowrap shadow-xs"
                >
                  {isGenerating ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                  )}
                  {isGenerating ? "กำลังสรุป..." : "สรุปบทเรียน"}
                </button>
              </div>
            </div>
          </form>

          {errorMsg && (
            <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
              {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* Lesson Content Presentation */}
      <div className="space-y-6">
        {/* Title & Category Banner */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2 border border-indigo-100">
            {activeLesson.category}
          </div>
          <h1 className="text-xl font-bold text-slate-900 leading-snug">
            {activeLesson.title}
          </h1>
          <p className="text-sm text-slate-700 mt-3 leading-relaxed">
            {activeLesson.overview}
          </p>
        </div>

        {/* 2-Column Grid: Key Principles & Computer Accounting Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Principles Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center mb-3 text-indigo-950">
                <ListOrdered className="w-4 h-4 mr-2 text-indigo-600" />
                หลักการสำคัญที่ต้องจำ (Key Accounting Principles)
              </h3>
              <ul className="space-y-2.5">
                {activeLesson.keyPrinciples?.map((principle, idx) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0 mr-2.5 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{principle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Computer Accounting System Insights */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>มุมมองระบบบัญชีคอมพิวเตอร์ & ซอฟต์แวร์ ERP</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                การทำงานจริงในระบบโปรแกรมบัญชี
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeLesson.computerAccountingInsights}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-cyan-400 flex items-center">
              <span>* เชื่อมโยงความรู้เชิงวิชาการกับการทำงานจริงในสำนักงานบัญชีดิจิทัล</span>
            </div>
          </div>
        </div>

        {/* Journal Entry Examples with Double-Entry Highlight */}
        {activeLesson.journalExamples && activeLesson.journalExamples.length > 0 && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center mb-3">
              <FileCheck className="w-4 h-4 mr-2 text-indigo-600" />
              ตัวอย่างการบันทึกรายการในสมุดรายวันทั่วไป (Journal Entries)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeLesson.journalExamples.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-900 mb-2">
                      รายการ: {ex.transaction}
                    </div>

                    {/* Debit Rows */}
                    <div className="space-y-1 my-2">
                      {ex.debit?.map((dr, dIdx) => (
                        <div
                          key={`dr-${dIdx}`}
                          className="flex justify-between items-center text-xs bg-emerald-50/70 p-1.5 rounded border border-emerald-200"
                        >
                          <span className="text-emerald-900 font-medium">
                            <strong>Dr.</strong> {dr.account} ({dr.code})
                          </span>
                          <span className="font-mono font-semibold text-emerald-800">
                            {dr.amount}
                          </span>
                        </div>
                      ))}

                      {/* Credit Rows */}
                      {ex.credit?.map((cr, cIdx) => (
                        <div
                          key={`cr-${cIdx}`}
                          className="flex justify-between items-center text-xs bg-indigo-50/70 p-1.5 rounded border border-indigo-200 ml-4"
                        >
                          <span className="text-indigo-900 font-medium">
                            <strong>Cr.</strong> {cr.account} ({cr.code})
                          </span>
                          <span className="font-mono font-semibold text-indigo-800">
                            {cr.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 italic">
                    คำอธิบาย: {ex.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Exam Traps */}
        {activeLesson.commonExamTraps && activeLesson.commonExamTraps.length > 0 && (
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-amber-950 flex items-center mb-2">
              <AlertTriangle className="w-4 h-4 mr-2 text-amber-600" />
              ข้อควรระวัง & จุดหลอกที่มักออกข้อสอบ (Exam Traps)
            </h3>
            <ul className="space-y-1.5 mt-2">
              {activeLesson.commonExamTraps.map((trap, idx) => (
                <li key={idx} className="flex items-start text-xs sm:text-sm text-amber-900">
                  <span className="text-amber-600 mr-2 font-bold">•</span>
                  <span>{trap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Interactive Practice Quiz */}
        {activeLesson.practiceQuiz && activeLesson.practiceQuiz.length > 0 && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center mb-3">
              <HelpCircle className="w-4 h-4 mr-2 text-indigo-600" />
              แบบทดสอบวัดความเข้าใจประจำบทเรียน (Interactive Quiz)
            </h3>

            <div className="space-y-4">
              {activeLesson.practiceQuiz.map((quiz, qIdx) => {
                const userAnswer = selectedAnswers[qIdx];
                const isAnswered = userAnswer !== undefined;
                const isCorrect = isAnswered && userAnswer === quiz.correctIndex;

                return (
                  <div
                    key={qIdx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3"
                  >
                    <div className="text-xs sm:text-sm font-semibold text-slate-900">
                      ข้อที่ {qIdx + 1}: {quiz.question}
                    </div>

                    <div className="space-y-1.5">
                      {quiz.options.map((opt, oIdx) => {
                        const isThisSelected = userAnswer === oIdx;
                        const isThisCorrect = quiz.correctIndex === oIdx;

                        let btnClass = "bg-white border-slate-200 text-slate-700 hover:bg-slate-100";
                        if (isAnswered) {
                          if (isThisCorrect) {
                            btnClass = "bg-emerald-100 border-emerald-400 text-emerald-900 font-semibold";
                          } else if (isThisSelected) {
                            btnClass = "bg-rose-100 border-rose-300 text-rose-900";
                          } else {
                            btnClass = "bg-white border-slate-200 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerQuiz(qIdx, oIdx)}
                            disabled={isAnswered}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs sm:text-sm transition-colors flex items-center justify-between ${btnClass}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && isThisCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation[qIdx] && (
                      <div
                        className={`p-3 rounded-lg text-xs leading-relaxed ${
                          isCorrect
                            ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                            : "bg-amber-50 text-amber-900 border border-amber-200"
                        }`}
                      >
                        <div className="font-semibold mb-0.5">
                          {isCorrect ? "ถูกต้องครับ! 🎉" : "ยังไม่ถูกต้อง ลองดูเฉลยด้านล่าง:"}
                        </div>
                        <p>{quiz.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
