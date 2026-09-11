import React, { useState } from "react";
import {
  X,
  Phone,
  Mail,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Layers,
  Calculator,
  Smartphone,
  Sparkles,
  Award,
  CheckCircle2,
  Maximize2,
  Eye,
} from "lucide-react";

interface DeveloperProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperProfileModal: React.FC<DeveloperProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showFullPoster, setShowFullPoster] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon / Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-7">
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Developer Avatar / Photo */}
            <div className="relative shrink-0 group">
              <button
                type="button"
                onClick={() => setShowFullPoster(true)}
                title="คลิกเพื่อดูรูปภาพและโปสเตอร์เต็มใบ"
                className="relative block rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                <img
                  src="/assets/images/mrt_developer_portrait.jpg"
                  alt="MR.T - Software Developer"
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-lg ring-4 ring-indigo-500/40 border border-white/20 transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to logo if portrait load issue
                    (e.target as HTMLImageElement).src = "/assets/images/mrt_app_logo.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1 rounded-2xl">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>ดูภาพเต็ม</span>
                </div>
              </button>
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md pointer-events-none">
                DEV ACTIVE
              </span>
            </div>

            {/* Developer Title & Slogan */}
            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>MR.T — Software Developer</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                <span>ระบบบัญชี | ภาษี | ธุรกิจ</span>
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200 font-medium leading-relaxed">
                “พัฒนาระบบบัญชีและภาษี ให้ธุรกิจคุณง่ายขึ้น ปลอดภัย และเติบโตอย่างยั่งยืน”
              </p>
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-slate-300">
                <span className="bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">Code • Build • Grow</span>
                <span className="text-indigo-300">ระบบดี ธุรกิจโต ไปด้วยกัน</span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Caption Bar */}
        <div className="bg-indigo-50 dark:bg-indigo-950/60 border-y border-indigo-100 dark:border-indigo-900/60 px-6 py-3 text-indigo-950 dark:text-indigo-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            ERP, ระบบคำนวณภาษีและจัดการรายรับ-รายจ่ายตามมาตรฐานสากล พร้อมช่วยให้ธุรกิจคุณเติบโตอย่างเป็นระบบ
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[68vh] overflow-y-auto">
          {/* Developer Bio & Specialization */}
          <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-1.5" />
              เกี่ยวกับนักพัฒนา (MR.T Developer Profile)
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              ผู้เชี่ยวชาญด้านการออกแบบและพัฒนาระบบบัญชี ภาษี และกระบวนการทางธุรกิจ (AIS/ERP) รับออกแบบและพัฒนาซอฟต์แวร์ ERP ครบวงจร, ระบบคำนวณภาษีหัก ณ ที่จ่าย ภ.ง.ด. และ VAT 7%, เว็บแอปพลิเคชัน และโมบายล์แอป PWA สำหรับการจัดการรายรับ-รายจ่ายขององค์กร ระบบมีความเสถียร ปลอดภัยตามมาตรฐานสากล พร้อมช่วยขับเคลื่อนธุรกิจของคุณให้เติบโตอย่างเป็นระบบ
            </p>
          </div>

          {/* 4 Core Pillars */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              ขอบเขตความเชี่ยวชาญและบริการ (Core Solutions)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-1 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">ERP System</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">ระบบวางแผนทรัพยากร</div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-1 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center font-bold">
                  <Calculator className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Tax Calculator</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">คำนวณภาษี & VAT</div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-1 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Web & Mobile</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">แอปมือถือ & PWA</div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-1 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Secure & Stable</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">ปลอดภัยมาตรฐานสากล</div>
              </div>
            </div>
          </div>

          {/* Contact Section with QR Code */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* LINE QR Code */}
              <div className="flex flex-col items-center shrink-0 text-center bg-white p-3 rounded-xl shadow-md border border-slate-200">
                <img
                  src="https://qr-official.line.me/gs/M_030wgwqn_GW.png?oat_content=qr"
                  alt="LINE QR Code MR.T"
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 object-contain"
                  onError={(e) => {
                    // Local fallback
                    (e.target as HTMLImageElement).src = "/assets/images/mrt_line_qr.png";
                  }}
                />
                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>LINE ID: MR.T</span>
                </div>
                <span className="text-[9px] text-slate-500">สแกนเพื่อเพิ่มเพื่อน</span>
              </div>

              {/* Direct Contact Details */}
              <div className="flex-1 space-y-3 w-full">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                    ติดต่อสอบถาม / ปรึกษาได้เลยครับ
                  </span>
                  <h4 className="text-lg font-bold text-white">ช่องทางติดต่อผู้พัฒนาโดยตรง</h4>
                </div>

                {/* Phone Call */}
                <div className="flex items-center justify-between bg-white/10 hover:bg-white/15 p-2.5 rounded-xl transition-colors border border-white/10">
                  <a
                    href="tel:0612155870"
                    className="flex items-center gap-3 text-white hover:text-emerald-300 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 shadow-xs">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-300">เบอร์โทรศัพท์ (สายตรง)</div>
                      <div className="text-sm font-bold tracking-wide font-mono">061-215-5870 (0612155870)</div>
                    </div>
                  </a>
                  <button
                    onClick={() => handleCopy("0612155870", "phone")}
                    title="คัดลอกเบอร์โทร"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors text-xs flex items-center gap-1"
                  >
                    {copiedKey === "phone" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[10px] hidden sm:inline">{copiedKey === "phone" ? "คัดลอกแล้ว" : "คัดลอก"}</span>
                  </button>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between bg-white/10 hover:bg-white/15 p-2.5 rounded-xl transition-colors border border-white/10">
                  <a
                    href="mailto:investorstar9966@gmail.com"
                    className="flex items-center gap-3 text-white hover:text-indigo-300 transition-colors truncate"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-xs shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-slate-300">อีเมล (Gmail)</div>
                      <div className="text-xs sm:text-sm font-bold font-mono truncate">investorstar9966@gmail.com</div>
                    </div>
                  </a>
                  <button
                    onClick={() => handleCopy("investorstar9966@gmail.com", "email")}
                    title="คัดลอกอีเมล"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors text-xs flex items-center gap-1 shrink-0 ml-2"
                  >
                    {copiedKey === "email" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[10px] hidden sm:inline">{copiedKey === "email" ? "คัดลอกแล้ว" : "คัดลอก"}</span>
                  </button>
                </div>

                {/* LINE Contact */}
                <div className="flex items-center justify-between bg-white/10 hover:bg-white/15 p-2.5 rounded-xl transition-colors border border-white/10">
                  <a
                    href="https://line.me/R/ti/p/@030wgwqn"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-white hover:text-emerald-300 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#06C755] flex items-center justify-center text-white shadow-xs">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-300">LINE Official / ID</div>
                      <div className="text-sm font-bold tracking-wide">MR.T (@030wgwqn)</div>
                    </div>
                  </a>
                  <button
                    onClick={() => handleCopy("MR.T", "line")}
                    title="คัดลอก LINE ID"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors text-xs flex items-center gap-1"
                  >
                    {copiedKey === "line" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[10px] hidden sm:inline">{copiedKey === "line" ? "คัดลอกแล้ว" : "คัดลอก ID"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 dark:bg-slate-800 px-6 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <img
              src="/assets/images/mrt_app_logo.jpg"
              alt="MR.T"
              className="w-5 h-5 rounded-md object-cover"
            />
            <span className="font-semibold text-slate-800 dark:text-white">MR.T Software Developer</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFullPoster(true)}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ดูโปสเตอร์แนะนำตัว</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>

      {/* Full Poster Lightbox Modal */}
      {showFullPoster && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            e.stopPropagation();
            setShowFullPoster(false);
          }}
        >
          <div
            className="relative max-w-xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 py-2 text-white">
              <span className="text-xs font-bold flex items-center gap-1.5 text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                MR.T Developer — Official Profile Poster
              </span>
              <button
                onClick={() => setShowFullPoster(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src="/assets/images/mrt_developer_portrait.jpg"
              alt="MR.T - Full Poster"
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            <div className="p-3 text-center text-xs text-slate-300 flex items-center justify-between">
              <span>MR.T Software Developer | 0612155870</span>
              <a
                href="/assets/images/mrt_developer_portrait.jpg"
                download="mrt_developer_portrait.jpg"
                className="text-indigo-400 hover:text-indigo-300 font-medium underline"
              >
                ดาวน์โหลดรูปภาพ
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
