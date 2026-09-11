import React, { useState } from "react";
import {
  AccountItem,
  AccountCategory,
  ACCOUNT_CATEGORIES,
} from "../types/accounting";
import { formatCurrency } from "../utils/financialCalculations";
import {
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  FileText,
  Check,
  AlertTriangle,
  RotateCcw,
  Download,
  FileSpreadsheet,
} from "lucide-react";

interface JournalAndTrialBalanceEditorProps {
  accounts: AccountItem[];
  onUpdateAccounts: (newAccounts: AccountItem[]) => void;
  businessName: string;
  onChangeBusinessName: (name: string) => void;
  period: string;
  onChangePeriod: (period: string) => void;
  onResetToPreset: () => void;
}

export const JournalAndTrialBalanceEditor: React.FC<
  JournalAndTrialBalanceEditorProps
> = ({
  accounts,
  onUpdateAccounts,
  businessName,
  onChangeBusinessName,
  period,
  onChangePeriod,
  onResetToPreset,
}) => {
  const [showAiModal, setShowAiModal] = useState(false);
  const [problemText, setProblemText] = useState("");
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // New account form state
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<AccountCategory>(1);
  const [newDebit, setNewDebit] = useState<string>("");
  const [newCredit, setNewCredit] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const totalDebit = accounts.reduce((sum, a) => sum + (Number(a.debit) || 0), 0);
  const totalCredit = accounts.reduce((sum, a) => sum + (Number(a.credit) || 0), 0);
  const diff = Math.abs(totalDebit - totalCredit);
  const isBalanced = diff < 0.01;

  // Export to CSV with UTF-8 BOM
  const exportToCSV = () => {
    try {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10);
      const formattedDate = today.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const categoryLabels: Record<number, string> = {
        1: "1. สินทรัพย์ (Assets)",
        2: "2. หนี้สิน (Liabilities)",
        3: "3. ส่วนของเจ้าของ (Owner's Equity)",
        4: "4. รายได้ (Revenues)",
        5: "5. ค่าใช้จ่าย (Expenses)"
      };

      const rows: (string | number)[][] = [
        [`"บริษัท / กิจการ"`, `"${businessName.replace(/"/g, '""')}"`],
        [`"งวดบัญชี"`, `"${period.replace(/"/g, '""')}"`],
        [`"รายงาน"`, `"งบทดลองก่อนปรับปรุง (Trial Balance Worksheet)"`],
        [`"วันที่จัดทำรายงาน"`, `"${formattedDate}"`],
        [`"สถานะความสมดุล"`, `"${isBalanced ? 'ดุลสมบูรณ์ (Debit = Credit)' : 'ไม่ดุล (ผลต่าง: ฿' + diff.toFixed(2) + ')'}"`],
        [],
        [`"รหัสบัญชี"`, `"ชื่อบัญชี"`, `"หมวดบัญชี"`, `"เดบิต (Debit - ฿)"`, `"เครดิต (Credit - ฿)"`]
      ];

      accounts.forEach((acc) => {
        const catLabel = categoryLabels[acc.category] || `หมวด ${acc.category}`;
        const dr = Number(acc.debit || 0);
        const cr = Number(acc.credit || 0);
        rows.push([
          `"${acc.code}"`,
          `"${acc.name.replace(/"/g, '""')}"`,
          `"${catLabel}"`,
          dr > 0 ? dr.toFixed(2) : "0.00",
          cr > 0 ? cr.toFixed(2) : "0.00"
        ]);
      });

      rows.push([]);
      rows.push([
        `"รวมยอดงบทดลอง (Trial Balance Total)"`,
        `""`,
        `""`,
        totalDebit.toFixed(2),
        totalCredit.toFixed(2)
      ]);
      rows.push([
        `"ผลต่างเดบิต-เครดิต (Difference)"`,
        `""`,
        `""`,
        `""`,
        diff.toFixed(2)
      ]);
      rows.push([
        `"ข้อสรุปการตรวจสอบ"`,
        `"${isBalanced ? 'ยอดเดบิตเท่ากับยอดเครดิตถูกต้องตามหลักการบัญชีคู่' : 'ยอดเดบิตไม่เท่ากับเครดิต กรุณาตรวจสอบการบันทึกรายการ'}"`
      ]);

      const csvContent = rows.map((r) => r.join(",")).join("\r\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const safeBizName = businessName.replace(/[\/\\?%*:|"<>]/g, "_").trim() || "Trial_Balance";
      const filename = `Trial_Balance_${safeBizName}_${dateStr}.csv`;

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      triggerToast(`ดาวน์โหลดไฟล์ CSV เรียบร้อยแล้ว (${filename})`);
    } catch (e) {
      console.error(e);
      triggerToast("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์ CSV");
    }
  };

  // Export to Excel (.xls HTML table)
  const exportToExcel = () => {
    try {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10);
      const formattedDate = today.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const categoryLabels: Record<number, string> = {
        1: "1. สินทรัพย์",
        2: "2. หนี้สิน",
        3: "3. ส่วนของเจ้าของ",
        4: "4. รายได้",
        5: "5. ค่าใช้จ่าย"
      };

      const rowsHtml = accounts
        .map((acc, idx) => {
          const catLabel = categoryLabels[acc.category] || `หมวด ${acc.category}`;
          const dr = Number(acc.debit || 0);
          const cr = Number(acc.credit || 0);
          const bg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
          return `
            <tr style="background-color: ${bg};">
              <td style="border: 1px solid #cbd5e1; padding: 6px 10px; text-align: center; mso-number-format: '\\@';">${acc.code}</td>
              <td style="border: 1px solid #cbd5e1; padding: 6px 10px;">${acc.name}</td>
              <td style="border: 1px solid #cbd5e1; padding: 6px 10px; text-align: center;">${catLabel}</td>
              <td style="border: 1px solid #cbd5e1; padding: 6px 10px; text-align: right; mso-number-format: '#,##0.00';">${dr > 0 ? dr.toFixed(2) : "0.00"}</td>
              <td style="border: 1px solid #cbd5e1; padding: 6px 10px; text-align: right; mso-number-format: '#,##0.00';">${cr > 0 ? cr.toFixed(2) : "0.00"}</td>
            </tr>
          `;
        })
        .join("");

      const excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Trial Balance</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <style>
            body { font-family: 'Sarabun', Tahoma, Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th { background-color: #4338ca; color: #ffffff; font-weight: bold; border: 1px solid #312e81; padding: 8px 10px; text-align: center; font-size: 11pt; }
            td { font-size: 10pt; vertical-align: middle; }
            .title { font-size: 16pt; font-weight: bold; color: #1e1b4b; }
            .sub-title { font-size: 11pt; color: #475569; }
            .total-row { background-color: #e0e7ff; font-weight: bold; border-top: 2px solid #4338ca; border-bottom: 3px double #4338ca; }
          </style>
        </head>
        <body>
          <table>
            <tr><td colspan="5" class="title" style="padding: 8px 0;">${businessName}</td></tr>
            <tr><td colspan="5" class="sub-title">งบทดลองก่อนปรับปรุง (Trial Balance Worksheet) - งวด: ${period}</td></tr>
            <tr><td colspan="5" class="sub-title" style="padding-bottom: 12px;">วันที่ออกรายงาน: ${formattedDate} | สถานะ: ${isBalanced ? "ดุลสมบูรณ์" : "ไม่ดุล (ผลต่าง: ฿" + diff.toFixed(2) + ")"}</td></tr>
            <tr>
              <th style="width: 100px;">รหัสบัญชี</th>
              <th style="width: 280px;">ชื่อบัญชี</th>
              <th style="width: 160px;">หมวดบัญชี</th>
              <th style="width: 160px;">เดบิต (Debit - ฿)</th>
              <th style="width: 160px;">เครดิต (Credit - ฿)</th>
            </tr>
            ${rowsHtml}
            <tr class="total-row">
              <td colspan="3" style="border: 1px solid #cbd5e1; padding: 10px; text-align: right; font-weight: bold; color: #1e1b4b;">รวมยอดงบทดลองทั้งสิ้น (Total):</td>
              <td style="border: 1px solid #cbd5e1; padding: 10px; text-align: right; font-weight: bold; color: #312e81; mso-number-format: '#,##0.00';">${totalDebit.toFixed(2)}</td>
              <td style="border: 1px solid #cbd5e1; padding: 10px; text-align: right; font-weight: bold; color: #312e81; mso-number-format: '#,##0.00';">${totalCredit.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 6px 10px; text-align: right; font-size: 9pt; color: #64748b;">ผลต่าง (Difference):</td>
              <td colspan="2" style="padding: 6px 10px; text-align: right; font-size: 9pt; font-weight: bold; color: ${isBalanced ? "#059669" : "#e11d48"};">฿${diff.toFixed(2)} (${isBalanced ? "ยอดสมดุล" : "ยอดไม่สมดุล"})</td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob(["\uFEFF" + excelContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
      const safeBizName = businessName.replace(/[\/\\?%*:|"<>]/g, "_").trim() || "Trial_Balance";
      const filename = `Trial_Balance_${safeBizName}_${dateStr}.xls`;

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      triggerToast(`ดาวน์โหลดไฟล์ Excel เรียบร้อยแล้ว (${filename})`);
    } catch (e) {
      console.error(e);
      triggerToast("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์ Excel");
    }
  };

  // Handle account field update
  const handleFieldChange = (
    id: string,
    field: "code" | "name" | "category" | "debit" | "credit",
    value: any
  ) => {
    const updated = accounts.map((acc) => {
      if (acc.id === id) {
        if (field === "debit" || field === "credit") {
          return { ...acc, [field]: parseFloat(value) || 0 };
        }
        if (field === "category") {
          return { ...acc, category: Number(value) as AccountCategory };
        }
        return { ...acc, [field]: value };
      }
      return acc;
    });
    onUpdateAccounts(updated);
  };

  // Delete account
  const handleDeleteAccount = (id: string) => {
    onUpdateAccounts(accounts.filter((a) => a.id !== id));
  };

  // Add account
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;

    const newItem: AccountItem = {
      id: `custom-${Date.now()}`,
      code: newCode.trim(),
      name: newName.trim(),
      category: newCategory,
      debit: parseFloat(newDebit) || 0,
      credit: parseFloat(newCredit) || 0,
    };

    onUpdateAccounts([...accounts, newItem]);
    setNewCode("");
    setNewName("");
    setNewDebit("");
    setNewCredit("");
  };

  // AI Parse Transactions
  const handleAnalyzeWithAi = async () => {
    if (!problemText.trim()) return;
    setIsProcessingAi(true);
    setAiError(null);

    try {
      const res = await fetch("/api/accounting/analyze-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemText }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการประมวลผล");
      }

      if (data.businessName) {
        onChangeBusinessName(data.businessName);
      }
      if (data.period) {
        onChangePeriod(data.period);
      }

      if (data.trialBalanceAccounts && Array.isArray(data.trialBalanceAccounts)) {
        const mappedAccounts: AccountItem[] = data.trialBalanceAccounts.map(
          (item: any, idx: number) => ({
            id: `ai-${idx}-${Date.now()}`,
            code: item.code || `${item.category}0000`,
            name: item.name,
            category: (item.category as AccountCategory) || 1,
            debit: Number(item.debit) || 0,
            credit: Number(item.credit) || 0,
          })
        );
        onUpdateAccounts(mappedAccounts);
        setShowAiModal(false);
        setProblemText("");
      } else {
        throw new Error("โครงสร้างข้อมูลที่ส่งกลับมาไม่ถูกต้อง");
      }
    } catch (err: any) {
      setAiError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsProcessingAi(false);
    }
  };

  // Sample homework prompt for quick testing
  const sampleHomework1 = `วันที่ 1 ม.ค. นายชาญชัย นำเงินสด 400,000 บาท และเครื่องคอมพิวเตอร์แม่ข่ายมูลค่า 150,000 บาท มาลงทุนเปิดร้าน 'เทควัน คอมพิวเตอร์ แอนด์ ดาต้า'
วันที่ 4 ม.ค. จ่ายค่าเช่าสำนักงานเดือนแรกเป็นเงินสด 18,000 บาท
วันที่ 8 ม.ค. ซื้ออุปกรณ์เน็ตเวิร์กและสายสัญญาณเป็นเงินเชื่อจาก บริษัท ดิจิทัล ซัพพลาย จำกัด 65,000 บาท
วันที่ 15 ม.ค. ให้บริการติดตั้งระบบคอมพิวเตอร์แก่ลูกค้า ได้รับเงินสด 85,000 บาท
วันที่ 20 ม.ค. ให้บริการวางระบบคลาวด์แก่บริษัทแห่งหนึ่ง เป็นเงินเชื่อ 120,000 บาท ยังไม่ได้รับเงิน
วันที่ 25 ม.ค. จ่ายชำระหนี้ค่าอุปกรณ์เน็ตเวิร์กให้ บริษัท ดิจิทัล ซัพพลาย จำกัด 40,000 บาท
วันที่ 28 ม.ค. จ่ายเงินเดือนพนักงานช่างเทคนิค 32,000 บาท และค่าไฟฟ้าร้าน 6,500 บาท
วันที่ 31 ม.ค. นายชาญชัยถอนเงินสดไปใช้ส่วนตัว 15,000 บาท`;

  return (
    <div id="trial-balance-editor-container" className="space-y-6">
      {/* Header Info & Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              การจัดการงบทดลองและแก้ไขรายการบัญชี (Trial Balance Editor)
            </h2>
            <p className="text-xs text-slate-500">
              นักศึกษาสามารถปรับเปลี่ยนตัวเลขยอดคงเหลือ เพิ่มบัญชีใหม่ หรือใช้ AI ช่วยแปลงโจทย์การบ้านเป็นงบทดลองได้อัตโนมัติ
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              id="export-csv-btn"
              onClick={exportToCSV}
              className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
              title="ดาวน์โหลดเป็นไฟล์ CSV (UTF-8 BOM สำหรับ Excel และ Google Sheets)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
              ส่งออก CSV
            </button>

            <button
              id="export-excel-btn"
              onClick={exportToExcel}
              className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              title="ดาวน์โหลดเป็นไฟล์ Excel (.xls) พร้อมตารางจัดรูปแบบและผลรวม"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              ส่งออก Excel
            </button>

            <button
              id="ai-parse-transactions-btn"
              onClick={() => setShowAiModal(true)}
              className="inline-flex items-center px-3.5 py-2 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-lg shadow-xs transition-all"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-amber-300" />
              AI แปลงโจทย์รายการค้าอัตโนมัติ
            </button>

            <button
              id="reset-accounts-btn"
              onClick={onResetToPreset}
              className="inline-flex items-center px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              คืนค่ายอดเดิม
            </button>
          </div>
        </div>

        {/* Business Name & Period Editable Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              ชื่อกิจการ (Business Name):
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => onChangeBusinessName(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              งวดบัญชี (Period / As of Date):
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => onChangePeriod(e.target.value)}
              className="w-full text-xs font-medium px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Trial Balance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-bold text-slate-800">
            รายการบัญชีทั้งหมด ({accounts.length} บัญชี)
          </span>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-600">
              รวมเดบิต:{" "}
              <strong className="font-mono text-slate-900">
                ฿{formatCurrency(totalDebit)}
              </strong>
            </span>
            <span className="text-slate-600">
              รวมเครดิต:{" "}
              <strong className="font-mono text-slate-900">
                ฿{formatCurrency(totalCredit)}
              </strong>
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                isBalanced
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isBalanced ? "เดบิต = เครดิต (ดุลแล้ว)" : `ต่างกัน ฿${formatCurrency(diff)}`}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-24">รหัสบัญชี</th>
                <th className="py-2.5 px-3 min-w-[200px]">ชื่อบัญชี</th>
                <th className="py-2.5 px-3 w-36">หมวดบัญชี</th>
                <th className="py-2.5 px-3 w-36 text-right">เดบิต (บาท)</th>
                <th className="py-2.5 px-3 w-36 text-right">เครดิต (บาท)</th>
                <th className="py-2.5 px-3 w-16 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={acc.code}
                      onChange={(e) => handleFieldChange(acc.id, "code", e.target.value)}
                      className="w-full font-mono text-xs px-2 py-1 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={acc.name}
                      onChange={(e) => handleFieldChange(acc.id, "name", e.target.value)}
                      className="w-full text-xs font-medium px-2 py-1 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <select
                      value={acc.category}
                      onChange={(e) => handleFieldChange(acc.id, "category", e.target.value)}
                      className="w-full text-xs py-1 px-1.5 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value={1}>1: สินทรัพย์</option>
                      <option value={2}>2: หนี้สิน</option>
                      <option value={3}>3: ทุน/ส่วนของเจ้าของ</option>
                      <option value={4}>4: รายได้</option>
                      <option value={5}>5: ค่าใช้จ่าย</option>
                    </select>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <input
                      type="number"
                      step="any"
                      value={acc.debit || ""}
                      placeholder="0.00"
                      onChange={(e) => handleFieldChange(acc.id, "debit", e.target.value)}
                      className="w-full font-mono text-xs text-right px-2 py-1 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3 text-right">
                    <input
                      type="number"
                      step="any"
                      value={acc.credit || ""}
                      placeholder="0.00"
                      onChange={(e) => handleFieldChange(acc.id, "credit", e.target.value)}
                      className="w-full font-mono text-xs text-right px-2 py-1 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleDeleteAccount(acc.id)}
                      title="ลบบัญชีนี้"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Account Row Form */}
        <form
          onSubmit={handleAddAccount}
          className="p-3 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-6 gap-2 items-center text-xs"
        >
          <div>
            <input
              type="text"
              placeholder="รหัส เช่น 11110"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="ชื่อบัญชีใหม่..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(Number(e.target.value) as AccountCategory)}
              className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={1}>1: สินทรัพย์</option>
              <option value={2}>2: หนี้สิน</option>
              <option value={3}>3: ทุน</option>
              <option value={4}>4: รายได้</option>
              <option value={5}>5: ค่าใช้จ่าย</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <input
              type="number"
              placeholder="เดบิต"
              value={newDebit}
              onChange={(e) => setNewDebit(e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white font-mono text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="เครดิต"
              value={newCredit}
              onChange={(e) => setNewCredit(e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white font-mono text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition-colors flex items-center justify-center"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              เพิ่มบัญชี
            </button>
          </div>
        </form>
      </div>

      {/* AI Modal for parsing raw homework text */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
                  AI แปลงโจทย์รายการค้าเป็นงบทดลองและงบการเงิน
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  วางข้อความโจทย์การบ้านหรือรายการค้าของกิจการ AI จะวิเคราะห์เดบิต-เครดิต จัดทำงบทดลอง และคำนวณงบการเงินให้อัตโนมัติ
                </p>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    ข้อความโจทย์รายการค้า:
                  </label>
                  <button
                    type="button"
                    onClick={() => setProblemText(sampleHomework1)}
                    className="text-[11px] text-indigo-600 hover:underline"
                  >
                    + ใส่โจทย์ตัวอย่างอัตโนมัติ
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder="เช่น:
วันที่ 1 ม.ค. นำเงินสด 500,000 บาท มาลงทุน
วันที่ 3 ม.ค. ซื้อคอมพิวเตอร์และเซิร์ฟเวอร์เงินสด 80,000 บาท
วันที่ 10 ม.ค. ให้บริการวางระบบคลาวด์ ได้รับเงินสด 45,000 บาท..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-sans"
                />
              </div>

              {aiError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  disabled={isProcessingAi}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleAnalyzeWithAi}
                  disabled={isProcessingAi || !problemText.trim()}
                  className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors"
                >
                  {isProcessingAi ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-1.5 text-amber-300" />
                  )}
                  {isProcessingAi ? "กำลังประมวลผลบัญชีคู่..." : "ประมวลผลและสร้างงบการเงิน"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification for Exports */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs flex items-center space-x-2.5 z-50 animate-bounce">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium leading-snug">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
