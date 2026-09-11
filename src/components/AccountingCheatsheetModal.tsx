import React from "react";
import { BookOpen, X, ArrowUpRight, ArrowDownRight, Check } from "lucide-react";

interface AccountingCheatsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountingCheatsheetModal: React.FC<AccountingCheatsheetModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                คลังสูตรและผังบัญชี 5 หมวด (Accounting Cheatsheet)
              </h3>
              <p className="text-xs text-slate-500">
                คู่มืออ้างอิงหลักการเดบิต-เครดิต และสูตรงบการเงินตามมาตรฐาน TFRS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs sm:text-sm">
          {/* 1. Debit & Credit Rules for 5 Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              1. หลักการเดบิต (Dr.) และ เครดิต (Cr.) ของ 5 หมวดบัญชี
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {/* Cat 1: Assets */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <div className="font-bold text-emerald-900">หมวด 1: สินทรัพย์</div>
                <div className="text-[11px] text-emerald-700 font-medium">Assets (ขึ้นต้นด้วย 1)</div>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center text-emerald-800 font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    เพิ่ม = เดบิต (Dr.)
                  </div>
                  <div className="flex items-center text-rose-700 font-semibold">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-1 text-rose-600" />
                    ลด = เครดิต (Cr.)
                  </div>
                </div>
                <div className="mt-2 pt-1 border-t border-emerald-200 text-[10px] text-emerald-700">
                  ยอดปกติ: เดบิต
                </div>
              </div>

              {/* Cat 2: Liabilities */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                <div className="font-bold text-amber-900">หมวด 2: หนี้สิน</div>
                <div className="text-[11px] text-amber-700 font-medium">Liabilities (ขึ้นต้นด้วย 2)</div>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center text-rose-700 font-semibold">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-1 text-rose-600" />
                    ลด = เดบิต (Dr.)
                  </div>
                  <div className="flex items-center text-emerald-800 font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    เพิ่ม = เครดิต (Cr.)
                  </div>
                </div>
                <div className="mt-2 pt-1 border-t border-amber-200 text-[10px] text-amber-700">
                  ยอดปกติ: เครดิต
                </div>
              </div>

              {/* Cat 3: Equity */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                <div className="font-bold text-indigo-900">หมวด 3: ส่วนของเจ้าของ</div>
                <div className="text-[11px] text-indigo-700 font-medium">Equity (ขึ้นต้นด้วย 3)</div>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center text-rose-700 font-semibold">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-1 text-rose-600" />
                    ลด = เดบิต (Dr.)
                  </div>
                  <div className="flex items-center text-emerald-800 font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    เพิ่ม = เครดิต (Cr.)
                  </div>
                </div>
                <div className="mt-2 pt-1 border-t border-indigo-200 text-[10px] text-indigo-700">
                  ยอดปกติ: เครดิต
                </div>
              </div>

              {/* Cat 4: Revenues */}
              <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl">
                <div className="font-bold text-cyan-900">หมวด 4: รายได้</div>
                <div className="text-[11px] text-cyan-700 font-medium">Revenues (ขึ้นต้นด้วย 4)</div>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center text-rose-700 font-semibold">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-1 text-rose-600" />
                    ลด = เดบิต (Dr.)
                  </div>
                  <div className="flex items-center text-emerald-800 font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    เพิ่ม = เครดิต (Cr.)
                  </div>
                </div>
                <div className="mt-2 pt-1 border-t border-cyan-200 text-[10px] text-cyan-700">
                  ยอดปกติ: เครดิต
                </div>
              </div>

              {/* Cat 5: Expenses */}
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl">
                <div className="font-bold text-rose-900">หมวด 5: ค่าใช้จ่าย</div>
                <div className="text-[11px] text-rose-700 font-medium">Expenses (ขึ้นต้นด้วย 5)</div>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center text-emerald-800 font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    เพิ่ม = เดบิต (Dr.)
                  </div>
                  <div className="flex items-center text-rose-700 font-semibold">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-1 text-rose-600" />
                    ลด = เครดิต (Cr.)
                  </div>
                </div>
                <div className="mt-2 pt-1 border-t border-rose-200 text-[10px] text-rose-700">
                  ยอดปกติ: เดบิต
                </div>
              </div>
            </div>
          </div>

          {/* 2. Core Accounting Equations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              2. สมการและสูตรการคำนวณงบการเงิน
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-semibold text-slate-900 text-xs">
                  สมการงบแสดงฐานะการเงิน (Balance Sheet Equation)
                </div>
                <div className="font-mono text-xs text-indigo-700 font-bold bg-white p-2 rounded border border-slate-200">
                  สินทรัพย์ (Assets) = หนี้สิน (Liabilities) + ส่วนของเจ้าของ (Equity)
                </div>
                <p className="text-[11px] text-slate-500">
                  * หากมีกำไรสุทธิจากงบกำไรขาดทุน ให้นำมารวมในส่วนของเจ้าของ (ทุนปลายงวด = ทุนต้นงวด + กำไรสุทธิ - ถอนใช้ส่วนตัว)
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-semibold text-slate-900 text-xs">
                  สมการงบกำไรขาดทุน (Income Statement Equation)
                </div>
                <div className="font-mono text-xs text-indigo-700 font-bold bg-white p-2 rounded border border-slate-200">
                  กำไรสุทธิ (Net Profit) = รายได้รวม (Total Revenues) - ค่าใช้จ่ายรวม (Total Expenses)
                </div>
                <p className="text-[11px] text-slate-500">
                  * สำหรับธุรกิจขายสินค้า: กำไรขั้นต้น = รายได้จากการขาย - ต้นทุนขาย
                </p>
              </div>
            </div>
          </div>

          {/* 3. Computer Accounting Chart of Accounts Reference */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              3. ตัวอย่างผังบัญชีคอมพิวเตอร์มาตรฐาน (Standard Chart of Accounts)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="font-bold text-slate-800 font-sans mb-1">หมวดสินทรัพย์ (1)</div>
                <div>11100 - เงินสดในมือ</div>
                <div>11200 - เงินฝากกระแสรายวัน/ออมทรัพย์</div>
                <div>11300 - ลูกหนี้การค้า</div>
                <div>11400 - สินค้าคงเหลือ</div>
                <div>12100 - อุปกรณ์คอมพิวเตอร์และเซิร์ฟเวอร์</div>
                <div className="text-rose-600">12110 - ค่าเสื่อมราคาสะสม (Contra-Asset หักลบ)</div>
                <div>12200 - ลิขสิทธิ์ซอฟต์แวร์ระบบงาน</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="font-bold text-slate-800 font-sans mb-1">หมวดหนี้สิน & ทุน (2 & 3)</div>
                <div>21100 - เจ้าหนี้การค้า</div>
                <div>21200 - ค่าใช้จ่ายค้างจ่าย</div>
                <div>21300 - รายได้รับล่วงหน้า</div>
                <div>22100 - เงินกู้ยืมระยะยาว</div>
                <div>31100 - ทุนเรือนหุ้น / ทุนจดทะเบียน</div>
                <div className="text-rose-600">31200 - ถอนใช้ส่วนตัว / เงินปันผล (หักทุน)</div>
                <div>31300 - กำไรสะสม</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
