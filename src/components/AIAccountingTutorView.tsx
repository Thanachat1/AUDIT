import React, { useState, useRef, useEffect } from "react";
import { TutorChatMessage, BalanceSheetData, IncomeStatementData } from "../types/accounting";
import {
  HelpCircle,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  Trash2,
  BookOpen,
} from "lucide-react";

interface AIAccountingTutorViewProps {
  balanceSheet: BalanceSheetData;
  incomeStatement: IncomeStatementData;
}

export const AIAccountingTutorView: React.FC<AIAccountingTutorViewProps> = ({
  balanceSheet,
  incomeStatement,
}) => {
  const [messages, setMessages] = useState<TutorChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: "สวัสดีครับนักศึกษา! ยินดีต้อนรับสู่ติวเตอร์ AI ประจำวิชาการบัญชีคอมพิวเตอร์ 💻📊 มีข้อสงสัยเรื่องการลงบัญชีคู่ เดบิต/เครดิต รายการปรับปรุง งบการเงิน หรือระบบโปรแกรมบัญชี สามารถสอบถามได้เลยครับ!",
      timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickQuestions = [
    "ซื้อเครื่องแม่ข่ายและโปรแกรมลิขสิทธิ์ บันทึกเดบิต-เครดิตอย่างไร?",
    "งบทดลองไม่เท่ากัน (ไม่ดุล) มีเทคนิคการตรวจหาข้อผิดพลาดอย่างไร?",
    "อธิบายความต่างระหว่าง Perpetual vs Periodic ในระบบ ERP ให้เข้าใจง่าย",
    "ค่าเสื่อมราคาสะสม อยู่ในงบไหน และหักลบอย่างไร?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: TutorChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsLoading(true);

    try {
      const currentContext = {
        businessName: balanceSheet.businessName,
        totalAssets: balanceSheet.totalAssets,
        totalLiabilities: balanceSheet.totalLiabilities,
        totalEquity: balanceSheet.totalEquity,
        netProfit: incomeStatement.netProfit,
        isBalanced: balanceSheet.isBalanced,
      };

      const res = await fetch("/api/accounting/ask-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          context: currentContext,
        }),
      });

      const data = await res.json();
      const botMsg: TutorChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: data.answer || data.error || "ขออภัย ไม่สามารถสร้างคำตอบได้",
        timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: TutorChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${err.message}`,
        timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "msg-welcome-reset",
        sender: "assistant",
        text: "ล้างประวัติการสนทนาเรียบร้อยครับ มีข้อสงสัยข้อไหนถามเข้ามาใหม่ได้เลยครับ!",
        timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div id="ai-tutor-container" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              ติวเตอร์บัญชีคอมพิวเตอร์ AI (Interactive Tutor)
            </h2>
            <p className="text-xs text-slate-500">
              ถาม-ตอบปัญหาบัญชี อธิบายหลักเกณฑ์ TFRS ตรวจเดบิต/เครดิต และระบบซอฟต์แวร์สารสนเทศ
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          title="ล้างข้อความทั้งหมด"
          className="text-xs text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          <span className="hidden sm:inline">ล้างแชท</span>
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-500 flex items-center whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-500" />
          คำถามยอดนิยม:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-xs bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Panel */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs h-[480px] flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${
                  isUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs ${
                    isUser ? "bg-slate-800" : "bg-indigo-600"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-slate-900 text-white rounded-tr-none"
                      : "bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none whitespace-pre-line"
                  }`}
                >
                  <div>{msg.text}</div>
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      isUser ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-slate-500 text-xs pl-9">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>อาจารย์ติวเตอร์กำลังคิดและพิมพ์คำอธิบาย...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-slate-50 border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="พิมพ์คำถาม เช่น ทำไมสินค้าคงเหลือปลายงวดถึงส่งผลต่อกำไรสุทธิ..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-sans"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center shadow-xs transition-colors"
          >
            <Send className="w-4 h-4 mr-1.5" />
            ถามติวเตอร์
          </button>
        </form>
      </div>
    </div>
  );
};
