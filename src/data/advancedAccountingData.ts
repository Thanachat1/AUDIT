import {
  ERPDocumentSimulation,
  SQLAccountingQuery,
  BIMeasureItem,
  ITControlCase,
  SODRoleCheck,
  SkillBadge,
} from "../types/accounting";

// 1. ERP & Cloud Accounting Simulations
export const ERP_SIMULATIONS: ERPDocumentSimulation[] = [
  {
    id: "express-sales-iv",
    title: "Express: บันทึกใบกำกับภาษี/ใบส่งของ (ขายเชื่อ - IV)",
    type: "invoice",
    software: "express",
    description:
      "โปรแกรม Express ยอดนิยมอันดับ 1 ในไทย เมื่อเปิดบิลขายเชื่อ ระบบจะลงบัญชีเดบิตลูกหนี้การค้า เครดิตขายสินค้า และภาษีขายอัตโนมัติตามผังบัญชีที่กำหนด",
    fields: [
      { label: "เลขที่เอกสาร", key: "docNo", value: "IV6701-0085", type: "text" },
      { label: "วันที่เอกสาร", key: "docDate", value: "2026-03-15", type: "date" },
      { label: "รหัสลูกค้า", key: "customerCode", value: "C-0012 บริษัท ดิจิทัล โซลูชั่นส์ จำกัด", type: "text" },
      { label: "เครดิตเทอม (วัน)", key: "creditTerm", value: 30, type: "number" },
      { label: "มูลค่าสินค้าก่อน VAT", key: "amount", value: 100000, type: "number" },
      { label: "อัตราภาษีมูลค่าเพิ่ม (%)", key: "vatRate", value: 7, type: "number" },
    ],
    autoJournalGenerated: {
      drAccount: "ลูกหนี้การค้า (AR Trade)",
      drCode: "11300",
      crAccount: "รายได้จากการขายสินค้า (Sales Revenue)",
      crCode: "41100",
      vatAccount: "ภาษีขาย (Output VAT 7%)",
      vatCode: "21400",
      amount: 107000,
      vatAmount: 7000,
    },
    keyConcept:
      "ในระบบ Express การกำหนดรหัสสินค้าและกลุ่มสินค้าจะเชื่อมโยงกับผังบัญชีรายได้และภาษีขายล่วงหน้า ทำให้ผู้ใช้งานระดับพนักงานขายไม่ต้องรู้บัญชี แต่ระบบ ERP จะสร้างสมุดรายวันขาย (Sales Journal) ให้อัตโนมัติ",
  },
  {
    id: "sap-fiori-fb50",
    title: "SAP S/4HANA: ปรับปรุงรายการทั่วไป (T-Code: FB50 / G/L Document)",
    type: "journal",
    software: "sap",
    description:
      "การลงบันทึกรายการใน SAP ผ่านโมดูล FI (Financial Accounting) สำหรับปรับปรุงค่าเสื่อมราคาเครื่องเซิร์ฟเวอร์ประจำเดือน พร้อมระบุ Cost Center (ศูนย์ต้นทุน) ในโมดูล CO",
    fields: [
      { label: "Company Code", key: "companyCode", value: "1000 (Thailand HQ)", type: "text" },
      { label: "Document Date", key: "docDate", value: "2026-03-31", type: "date" },
      { label: "Posting Key Dr. 40", key: "drAccount", value: "521000 (ค่าเสื่อมราคาอุปกรณ์ไอที)", type: "text" },
      { label: "Cost Center", key: "costCenter", value: "CC-IT01 (แผนกโครงสร้างพื้นฐาน)", type: "text" },
      { label: "Posting Key Cr. 50", key: "crAccount", value: "121010 (ค่าเสื่อมราคาสะสมเซิร์ฟเวอร์)", type: "text" },
      { label: "Amount in THB", key: "amount", value: 12500, type: "number" },
    ],
    autoJournalGenerated: {
      drAccount: "ค่าเสื่อมราคา-อุปกรณ์คอมพิวเตอร์ (IT Depreciation Exp)",
      drCode: "52100",
      crAccount: "ค่าเสื่อมราคาสะสม-อุปกรณ์คอมพิวเตอร์ (Acc. Depr. - IT)",
      crCode: "12110",
      amount: 12500,
    },
    keyConcept:
      "SAP ผสานระบบ FI (งบการเงินภายนอก) กับ CO (การบัญชีเพื่อการจัดการ) ไว้เป็น Universal Journal (ACDOCA table) โดยระบุ Cost Center ควบคู่ไปกับ G/L Account เพื่อวิเคราะห์กำไรขาดทุนรายแผนก",
  },
  {
    id: "flowaccount-cloud-expense",
    title: "FlowAccount: บันทึกใบสำคัญจ่ายค่าบริการคลาวด์ พร้อมหัก ณ ที่จ่าย 3%",
    type: "payment",
    software: "flowaccount",
    description:
      "โปรแกรมบัญชี Cloud ยอดนิยมสำหรับ SME ยุคใหม่ มีระบบคำนวณภาษีหัก ณ ที่จ่าย (Withholding Tax - WHT) และออกใบรับรอง 50 ทวิ อัตโนมัติ",
    fields: [
      { label: "ผู้รับเงิน", key: "vendorName", value: "บจก. สยามคลาวด์ แพลตฟอร์ม", type: "text" },
      { label: "ประเภทค่าใช้จ่าย", key: "expenseCategory", value: "ค่าบริการระบบคลาวด์ & เซิร์ฟเวอร์", type: "text" },
      { label: "ยอดเงินก่อน VAT", key: "amount", value: 20000, type: "number" },
      { label: "ภาษีซื้อ (VAT 7%)", key: "vatAmount", value: 1400, type: "number" },
      { label: "ภาษีหัก ณ ที่จ่าย (WHT 3%)", key: "whtAmount", value: 600, type: "number" },
      { label: "จ่ายชำระโดย", key: "paymentMethod", value: "เงินโอนธนาคารกสิกรไทย", type: "text" },
    ],
    autoJournalGenerated: {
      drAccount: "ค่าบริการคลาวด์และโฮสติ้ง (Cloud Expense)",
      drCode: "53200",
      crAccount: "เงินฝากกระแสรายวัน/ออมทรัพย์ (Cash at Bank)",
      crCode: "11200",
      vatAccount: "ภาษีซื้อ (Input VAT 7%)",
      vatCode: "11500",
      amount: 20800,
      vatAmount: 1400,
    },
    keyConcept:
      "การจ่ายค่าบริการในไทย ต้องหักภาษี ณ ที่จ่าย 3% ตามมาตรา 3 เตรส (ยอดจ่ายจริง = ยอดก่อน VAT + VAT 7% - WHT 3%) = 20,000 + 1,400 - 600 = 20,800 บาท",
  },
  {
    id: "peak-receipt-rv",
    title: "PEAK Account: บันทึกใบเสร็จรับเงิน ชำระหนี้จากลูกหนี้การค้า (RV)",
    type: "receipt",
    software: "peak",
    description:
      "ระบบ Cloud ERP ของ PEAK เชื่อมต่อ API ธนาคาร ตรวจจับ Slip ธนาคารอัตโนมัติ (AI Slip Verification) ตัดยอดลูกหนี้การค้าและบันทึกเงินเข้าบัญชีทันที",
    fields: [
      { label: "เลขที่ใบเสร็จ", key: "receiptNo", value: "RV-2026-03-004", type: "text" },
      { label: "อ้างอิงใบแจ้งหนี้", key: "refInvoice", value: "INV-2026-02-019", type: "text" },
      { label: "ชื่อลูกหนี้", key: "customerName", value: "หจก. เอ็กซ์เพิร์ต ซอฟต์แวร์", type: "text" },
      { label: "ยอดหนี้ตามบิล", key: "invTotal", value: 53500, type: "number" },
      { label: "หัก ณ ที่จ่ายถูกหักไว้ (3% ของฐานบริการ)", key: "whtDeducted", value: 1500, type: "number" },
      { label: "ยอดเงินโอนสุทธิเข้าบัญชี", key: "netReceived", value: 52000, type: "number" },
    ],
    autoJournalGenerated: {
      drAccount: "เงินฝากธนาคาร (Cash at Bank) 52,000 + ภาษีถูกหัก ณ ที่จ่าย (WHT Receivable) 1,500",
      drCode: "11200 / 11600",
      crAccount: "ลูกหนี้การค้า (Accounts Receivable)",
      crCode: "11300",
      amount: 53500,
    },
    keyConcept:
      "ภาษีเงินได้ถูกหัก ณ ที่จ่าย (WHT Receivable 11600) ถือเป็นสินทรัพย์หมุนเวียนของกิจการ สามารถนำไปเครดิตหักลบภาษีเงินได้นิติบุคคลตอนสิ้นปี (ภ.ง.ด.50) ได้",
  },
];

// 2. Accounting SQL Sandbox Queries
export const ACCOUNTING_SQL_QUERIES: SQLAccountingQuery[] = [
  {
    id: "sql-trial-balance",
    title: "1. ดึงยอดงบทดลอง (Trial Balance Query) จากตาราง Journal Entries",
    category: "General Ledger",
    objective: "รวมยอดเดบิตและเครดิตของแต่ละรหัสบัญชีเพื่อตรวจสอบยอดดุล (Trial Balance)",
    sql: `SELECT 
    a.account_code,
    a.account_name,
    a.account_category,
    ROUND(SUM(jl.debit_amount), 2) AS total_debit,
    ROUND(SUM(jl.credit_amount), 2) AS total_credit,
    CASE 
        WHEN a.account_category IN (1, 5) 
            THEN ROUND(SUM(jl.debit_amount) - SUM(jl.credit_amount), 2)
        ELSE ROUND(SUM(jl.credit_amount) - SUM(jl.debit_amount), 2)
    END AS net_ending_balance
FROM chart_of_accounts a
LEFT JOIN journal_lines jl ON a.account_code = jl.account_code
LEFT JOIN journal_headers jh ON jl.journal_id = jh.journal_id
WHERE jh.posting_status = 'POSTED'
  AND jh.posting_date <= '2026-12-31'
GROUP BY a.account_code, a.account_name, a.account_category
ORDER BY a.account_code ASC;`,
    explanation:
      "คำสั่งนี้ใช้ GROUP BY รหัสบัญชี และใช้ฟังก์ชัน CASE WHEN คำนวณยอดคงเหลือสุทธิ (Ending Balance) ตามธรรมชาติของหมวดบัญชี (หมวด 1 และ 5 ธรรมชาติเดบิต, หมวด 2, 3, 4 ธรรมชาติเครดิต)",
    sampleResults: [
      { account_code: "11100", account_name: "เงินสดในมือ", account_category: 1, total_debit: 120000, total_credit: 45000, net_ending_balance: 75000 },
      { account_code: "11200", account_name: "เงินฝากธนาคาร", account_category: 1, total_debit: 650000, total_credit: 280000, net_ending_balance: 370000 },
      { account_code: "11300", account_name: "ลูกหนี้การค้า", account_category: 1, total_debit: 210000, total_credit: 90000, net_ending_balance: 120000 },
      { account_code: "21100", account_name: "เจ้าหนี้การค้า", account_category: 2, total_debit: 60000, total_credit: 140000, net_ending_balance: 80000 },
      { account_code: "31100", account_name: "ทุนเรือนหุ้น", account_category: 3, total_debit: 0, total_credit: 400000, net_ending_balance: 400000 },
      { account_code: "41100", account_name: "รายได้จากการบริการ", account_category: 4, total_debit: 0, total_credit: 245000, net_ending_balance: 245000 },
      { account_code: "51100", account_name: "เงินเดือนและค่าจ้าง", account_category: 5, total_debit: 160000, total_credit: 0, net_ending_balance: 160000 },
    ],
  },
  {
    id: "sql-ar-aging",
    title: "2. รายงานวิเคราะห์อายุลูกหนี้ (AR Aging Report) เพื่อตั้งค่าเผื่อหนี้สงสัยจะสูญ",
    category: "Accounts Receivable",
    objective: "จัดกลุ่มหนี้ตามช่วงเวลา 0-30 วัน, 31-60 วัน, 61-90 วัน และเกิน 90 วันตามมาตรฐาน TFRS 9",
    sql: `SELECT 
    c.customer_code,
    c.customer_name,
    SUM(inv.invoice_amount - inv.paid_amount) AS outstanding_balance,
    SUM(CASE WHEN DATEDIFF('2026-03-31', inv.due_date) <= 30 THEN (inv.invoice_amount - inv.paid_amount) ELSE 0 END) AS current_0_30_days,
    SUM(CASE WHEN DATEDIFF('2026-03-31', inv.due_date) BETWEEN 31 AND 60 THEN (inv.invoice_amount - inv.paid_amount) ELSE 0 END) AS overdue_31_60_days,
    SUM(CASE WHEN DATEDIFF('2026-03-31', inv.due_date) BETWEEN 61 AND 90 THEN (inv.invoice_amount - inv.paid_amount) ELSE 0 END) AS overdue_61_90_days,
    SUM(CASE WHEN DATEDIFF('2026-03-31', inv.due_date) > 90 THEN (inv.invoice_amount - inv.paid_amount) ELSE 0 END) AS overdue_over_90_days
FROM sales_invoices inv
JOIN customers c ON inv.customer_id = c.customer_id
WHERE inv.payment_status != 'PAID'
GROUP BY c.customer_code, c.customer_name
HAVING outstanding_balance > 0
ORDER BY overdue_over_90_days DESC;`,
    explanation:
      "รายงานนี้หัวใจสำคัญของฝ่ายสินเชื่อและผู้สอบบัญชี ใช้คำนวณ Expected Credit Loss (ECL) ตาม TFRS 9 หากหนี้เกิน 90 วันต้องเริ่มพิจารณาตั้งค่าเผื่อหนี้สงสัยจะสูญในอัตราที่สูงขึ้น",
    sampleResults: [
      { customer_code: "C-002", customer_name: "บจก. สยาม โกลบอล เทค", outstanding_balance: 95000, current_0_30_days: 0, overdue_31_60_days: 15000, overdue_61_90_days: 20000, overdue_over_90_days: 60000 },
      { customer_code: "C-008", customer_name: "หจก. โมเดิร์น ซิสเต็มส์", outstanding_balance: 42000, current_0_30_days: 12000, overdue_31_60_days: 30000, overdue_61_90_days: 0, overdue_over_90_days: 0 },
      { customer_code: "C-015", customer_name: "บจก. อินโนเวทีฟ แล็บ", outstanding_balance: 68000, current_0_30_days: 68000, overdue_31_60_days: 0, overdue_61_90_days: 0, overdue_over_90_days: 0 },
    ],
  },
  {
    id: "sql-audit-duplicate",
    title: "3. การตรวจจับใบแจ้งหนี้เจ้าหนี้ซ้ำซ้อน (Duplicate Vendor Invoices Audit)",
    category: "Audit & Controls",
    objective: "ค้นหาความผิดปกติในการจ่ายเงินซ้ำ (Duplicate Payment Fraud / Error)",
    sql: `SELECT 
    vendor_id,
    vendor_invoice_no,
    invoice_date,
    invoice_amount,
    COUNT(*) AS occurrence_count,
    GROUP_CONCAT(system_doc_no) AS duplicate_vouchers
FROM purchase_invoices
GROUP BY vendor_id, vendor_invoice_no, invoice_amount
HAVING COUNT(*) > 1;`,
    explanation:
      "แบบทดสอบสำคัญในงาน IT Audit: ตรวจสอบว่าระบบมี Application Control ป้องกันการบันทึกเลขที่ใบแจ้งหนี้ซ้ำ (Unique Constraint) จากเจ้าหนี้รายเดียวกันหรือไม่ เพื่อป้องกันการจ่ายเงินเบิ้ล 2 รอบ",
    sampleResults: [
      { vendor_id: "V-004 (บจก. เอเปกซ์ คอมพิวเตอร์)", vendor_invoice_no: "INV-9921", invoice_date: "2026-02-18", invoice_amount: 35000, occurrence_count: 2, duplicate_vouchers: "PV6702-0041, PV6702-0059" },
    ],
  },
  {
    id: "sql-off-hour-entries",
    title: "4. ตรวจจับการลงสมุดรายวันนอกเวลาทำการ (Suspicious Weekend/Night Postings)",
    category: "Audit & Controls",
    objective: "ตรวจหาสัญญาณการทุจริตหรือการตกแต่งบัญชีในวันหยุดเสาร์-อาทิตย์",
    sql: `SELECT 
    jh.journal_no,
    jh.created_by,
    jh.created_timestamp,
    DAYNAME(jh.created_timestamp) AS day_of_week,
    jl.account_code,
    jl.debit_amount,
    jl.credit_amount,
    jh.description
FROM journal_headers jh
JOIN journal_lines jl ON jh.journal_id = jl.journal_id
WHERE DAYOFWEEK(jh.created_timestamp) IN (1, 7) -- 1=Sunday, 7=Saturday
   OR HOUR(jh.created_timestamp) < 7 OR HOUR(jh.created_timestamp) > 21
ORDER BY jh.created_timestamp DESC;`,
    explanation:
      "ผู้สอบบัญชีใช้คำสั่งนี้สแกน Audit Log ในฐานข้อมูลเพื่อดูว่ามีใครแอบแก้ไขตัวเลขบัญชีตอนดึกหรือวันหยุดโดยไม่ผ่านขั้นตอนการอนุมัติหรือไม่",
    sampleResults: [
      { journal_no: "JV-2026-028", created_by: "user_finance02", created_timestamp: "2026-03-08 02:41:15", day_of_week: "Sunday", account_code: "54200 (ค่าใช้จ่ายเบ็ดเตล็ด)", debit_amount: 85000, credit_amount: 0, description: "ปรับปรุงยอดคงค้างพิเศษ" },
    ],
  },
];

// 3. Data Analytics & Power BI DAX Measures
export const BI_MEASURES: BIMeasureItem[] = [
  {
    id: "dax-revenue-ytd",
    name: "Revenue YTD (Year-to-Date)",
    tool: "Power BI (DAX)",
    formula: `Revenue YTD = 
TOTALYTD(
    SUM('Financial_Transactions'[Credit_Amount]) - SUM('Financial_Transactions'[Debit_Amount]),
    'Calendar'[Date],
    'Chart_of_Accounts'[Category] = "Revenue"
)`,
    businessContext: "คำนวณยอดขายสะสมตั้งแต่ต้นปีถึงปัจจุบัน (YTD) สำหรับเปรียบเทียบกับงบประมาณประจำปีของฝ่ายบริหาร",
    interpretation: "หาก Revenue YTD ต่ำกว่า Forecast เกิน 10% ผู้บริหารต้องเร่งวางแผนการตลาดหรือติดตามยอดลูกค้ารายใหญ่",
  },
  {
    id: "dax-gross-margin",
    name: "Gross Margin % (อัตรากำไรขั้นต้น)",
    tool: "Power BI (DAX)",
    formula: `Gross Profit Margin % = 
VAR TotalSales = CALCULATE([Total Revenue], 'Chart_of_Accounts'[Account_Type] = "Operating Revenue")
VAR CostOfGoods = CALCULATE([Total Expense], 'Chart_of_Accounts'[Account_Type] = "Cost of Goods Sold")
RETURN 
    DIVIDE(TotalSales - CostOfGoods, TotalSales, 0)`,
    businessContext: "ชี้วัดความสามารถในการตั้งราคาสินค้าเทียบกับต้นทุนขายจริง ไม่รวมค่าใช้จ่ายบริหาร",
    interpretation: "สำหรับธุรกิจไอทีซอฟต์แวร์ อัตรากำไรขั้นต้นควรอยู่ระหว่าง 40% - 70%",
  },
  {
    id: "dax-dso",
    name: "Days Sales Outstanding (DSO - ระยะเวลาเก็บหนี้เฉลี่ย)",
    tool: "Power BI (DAX)",
    formula: `DSO = 
DIVIDE(
    [Ending Accounts Receivable],
    [Total Credit Sales],
    0
) * 365`,
    businessContext: "วัดสภาพคล่องว่าธุรกิจต้องรอกี่วันกว่าจะได้รับเงินสดจากลูกค้าหลังส่งมอบของ",
    interpretation: "หาก DSO เกินเครดิตเทอมปกติ (เช่น ให้เทอม 30 วันแต่ DSO พุ่งเป็น 72 วัน) แสดงว่ามีปัญหาการติดตามหนี้",
  },
  {
    id: "dax-dupont-roe",
    name: "DuPont Framework Analysis (แตกส่วนประกอบ ROE)",
    tool: "Power BI (DAX)",
    formula: `DuPont ROE = 
[Net Profit Margin] * [Asset Turnover] * [Equity Multiplier]
// (Net Income / Sales) * (Sales / Total Assets) * (Total Assets / Total Equity)`,
    businessContext: "สูตรคลาสสิกของนักวิเคราะห์การเงิน ใช้แจกแจงว่าผลตอบแทนส่วนของเจ้าของ (ROE) สูงมาจากกำไรดี, หมุนสินทรัพย์เก่ง หรือกู้หนี้มาหนุน",
    interpretation: "ช่วยให้ผู้บริหารมองเห็นจุดอ่อนขององค์กรได้ตรงจุดมากกว่าการดูตัวเลข ROE เดี่ยวๆ",
  },
];

// 4. IT Audit, Internal Controls & Fraud Cases
export const IT_CONTROL_CASES: ITControlCase[] = [
  {
    id: "itac-3-way-matching",
    title: "1. การควบคุม 3-Way Matching ในระบบ ERP จัดซื้อ-จ่ายเงิน (P2P)",
    type: "ITAC",
    scenario:
      "บริษัทสั่งซื้อคอมพิวเตอร์ 10 เครื่อง แต่ใบส่งของ (GRN) ได้รับของจริงเพียง 8 เครื่อง จากนั้นเจ้าหนี้ส่งใบแจ้งหนี้ (Vendor Invoice) เรียกเก็บเงิน 10 เครื่องเต็มจำนวน",
    vulnerability:
      "หากไม่มีระบบ Automated 3-Way Match ระบบจะปล่อยให้ฝ่ายบัญชีจ่ายเงิน 10 เครื่อง ทำให้บริษัทสูญเสียเงินค่าสินค้า 2 เครื่องโดยไม่ได้ของ",
    controlSolution:
      "ตั้งค่า Application Control ใน ERP ให้ Match 3 จุดอัตโนมัติ: Purchase Order (PO) ↔ Goods Receipt (GRN) ↔ Vendor Invoice (VI) หากยอดจำนวนหรือราคามี Tolerance เกิน 0% ให้บล็อกการจ่ายเงินและแจ้งเตือนผู้จัดการทันที",
    realWorldImpact: "ป้องกันการทุจริตและข้อผิดพลาดในการจ่ายเงินซัพพลายเออร์ได้มากกว่า 99%",
  },
  {
    id: "itgc-sod-conflict",
    title: "2. การแบ่งแยกหน้าที่ในระบบไอที (Segregation of Duties - SOD)",
    type: "ITGC",
    scenario:
      "สมมติให้พนักงานบัญชีคนหนึ่งมีสิทธิ์สร้างรหัสเจ้าหนี้ใหม่ (Vendor Master) และมีสิทธิ์กดอนุมัติจ่ายเช็ค/โอนเงิน (Payment Approval) ในโปรแกรมบัญชีพร้อมกัน",
    vulnerability:
      "ความเสี่ยงสูงสุดของการทุจริต (Classic Embezzlement): พนักงานสามารถสร้างชื่อบริษัทปลอมของตนเอง แล้วสร้างใบแจ้งหนี้ปลอมและอนุมัติโอนเงินเข้าบัญชีตนเองได้",
    controlSolution:
      "กำหนด Role-Based Access Control (RBAC) แยกหน้าที่ Master Data Maintenance ออกจาก Transaction Processing และห้ามไม่ให้ผู้มีสิทธิ์สร้างเอกสารสามารถอนุมัติเอกสารตนเอง (Maker-Checker Principle)",
    realWorldImpact: "เป็นข้อกำหนดบังคับของ SOX 404 และการตรวจสอบระบบสารสนเทศของสภาวิชาชีพบัญชี",
  },
  {
    id: "fraud-ghost-employee",
    title: "3. กลโกงพนักงานผีในระบบเงินเดือน (Ghost Employee Payroll Fraud)",
    type: "Fraud",
    scenario:
      "หัวหน้าฝ่ายบุคคลไม่ได้ลบชื่อพนักงานที่ลาออกไปแล้วออกจากฐานข้อมูลเงินเดือน และเปลี่ยนเลขที่บัญชีธนาคารปลายทางเป็นบัญชีของตนเอง",
    vulnerability:
      "การจ่ายเงินเดือนผ่านระบบ Direct Deposit โดยไม่มีการกระทบยอดพนักงานจริงกับเวลาเข้า-ออกงาน (Fingerprint/Face Scan Time Attendance)",
    controlSolution:
      "กระทบยอดทะเบียนพนักงาน (HR Master) กับข้อมูลลงเวลาทำงาน และใช้ Data Analytics สแกนหาเลขบัญชีธนาคารหรือเลขบัตรประชาชนที่ซ้ำกันในระบบ Payroll",
    realWorldImpact: "ตรวจจับพนักงานที่ลาออกแล้วแต่ยังกินเงินเดือนองค์กรได้ทันที",
  },
  {
    id: "fraud-benford-law",
    title: "4. การวิเคราะห์กฎของเบนฟอร์ด (Benford's Law Digital Forensic)",
    type: "Fraud",
    scenario:
      "ผู้จัดการฝ่ายจัดซื้อสร้างตัวเลขเบิกจ่ายปลอมขึ้นมาเอง โดยคิดว่าสุ่มตัวเลขกลมๆ แล้วดูเป็นธรรมชาติ",
    vulnerability:
      "ตามสถิติทางธรรมชาติและวิทยาการคำนวณ ตัวเลขหลักแรกของธุรกรรมทางการเงินจริงจะมีเลข 1 นำหน้าประมาณ 30.1% และเลข 9 เพียง 4.6% หากมนุษย์แต่งตัวเลขขึ้นเอง สัดส่วนนี้จะเบี่ยงเบนผิดปกติ",
    controlSolution:
      "ใช้โปรแกรมตรวจสอบบัญชีรัน Benford's First Digit Analysis บนไฟล์ค่าใช้จ่ายเบิกจ่าย หากกราฟเบี่ยงเบนจากมาตรฐาน ให้เลือกธุรกรรมกลุ่มนั้นมาตรวจตัวจริง (Substantive Testing)",
    realWorldImpact: "เครื่องมือที่สรรพากรและผู้สอบบัญชี Big 4 ทั่วโลกใช้ตรวจจับการตกแต่งบัญชี",
  },
];

// 5. Segregation of Duties Matrix
export const SOD_MATRIX_RULES: SODRoleCheck[] = [
  {
    roleA: "สร้างรหัสเจ้าหนี้ใหม่ (Create Vendor Master)",
    roleB: "อนุมัติสั่งจ่ายเงิน (Approve Payment Voucher)",
    hasConflict: true,
    riskDescription: "ความเสี่ยงสูงมาก: อาจสร้างเจ้าหนี้ปลอมและโอนเงินเข้าบัญชีตนเอง",
    mitigatingControl: "ต้องแยกแผนกจัดซื้อและฝ่ายการเงิน และมีระบบตรวจสอบเลขประจำตัวผู้เสียภาษีกับสรรพากรก่อนสร้างรหัส",
  },
  {
    roleA: "บันทึกใบสั่งซื้อ (Create Purchase Order)",
    roleB: "ตรวจรับสินค้าเข้าคลัง (Receive Goods GRN)",
    hasConflict: true,
    riskDescription: "ความเสี่ยงสูง: อาจสั่งซื้อของให้ตนเองและเซ็นรับของเองโดยไม่มีของเข้าคลังจริง",
    mitigatingControl: "ฝ่ายคลังสินค้าต้องเป็นอิสระจากฝ่ายจัดซื้อ",
  },
  {
    roleA: "เปิดบิลขาย/ลดหนี้ (Sales Invoice & Credit Memo)",
    roleB: "รับชำระเงินและบันทึกตัดหนี้ (Cash Collection & AR Clearing)",
    hasConflict: true,
    riskDescription: "ความเสี่ยงสูง (Lapping Fraud): รับเงินสดจากลูกค้าแล้วนำไปหมุนใช้ส่วนตัว แล้วเปิดใบลดหนี้ลบหนี้ทิ้ง",
    mitigatingControl: "ใบลดหนี้ต้องได้รับอนุมัติจากผู้จัดการฝ่ายการเงินเท่านั้น ไม่ใช่พนักงานขาย",
  },
  {
    roleA: "ดูรายงานงบการเงิน (View Financial Reports)",
    roleB: "บันทึกรายการสมุดรายวันทั่วไป (Post General Journal)",
    hasConflict: false,
    riskDescription: "ไม่มีข้อขัดแย้ง: เป็นสิทธิ์การอ่านข้อมูลเพื่อตรวจสอบ",
    mitigatingControl: "ควบคุมสิทธิ์การแก้ไขข้อมูล (Read-only for reports)",
  },
];

// 6. Skill Badges for Smart Portfolio
export const INITIAL_SKILL_BADGES: SkillBadge[] = [
  {
    id: "badge-erp-expert",
    title: "ERP & Express Practitioner",
    category: "AIS & Enterprise Systems",
    level: "Advanced",
    iconName: "Server",
    isUnlocked: true,
    unlockedAt: "2026-03-01",
    requirements: "ผ่านการทดลองบันทึกเอกสารซื้อ-ขาย และเข้าใจ Auto-GL Posting ในระบบ Express และ SAP",
  },
  {
    id: "badge-accounting-sql",
    title: "Accounting SQL Data Analyst",
    category: "Data & Systems",
    level: "Intermediate",
    iconName: "Database",
    isUnlocked: true,
    unlockedAt: "2026-03-05",
    requirements: "เขียนคำสั่ง SQL ดึงงบทดลอง รายงานอายุลูกหนี้ (Aging) และสแกนหาข้อผิดพลาดในตารางบัญชี",
  },
  {
    id: "badge-powerbi-analytics",
    title: "Financial BI Dashboard Specialist",
    category: "Financial Analytics",
    level: "Advanced",
    iconName: "BarChart3",
    isUnlocked: true,
    unlockedAt: "2026-03-08",
    requirements: "ออกแบบแดชบอร์ดสรุปรายได้-ค่าใช้จ่าย วิเคราะห์ DuPont ROE และเขียนสูตร DAX สำหรับงบการเงิน",
  },
  {
    id: "badge-digital-audit",
    title: "Digital IT Auditor & Fraud Buster",
    category: "Auditing & Assurance",
    level: "Advanced",
    iconName: "ShieldCheck",
    isUnlocked: false,
    requirements: "ผ่านการทดสอบ 3-Way Matching, วิเคราะห์ความขัดแย้ง SOD Matrix และใช้กฎของเบนฟอร์ดตรวจจับทุจริต",
  },
  {
    id: "badge-tfrs-tax",
    title: "TFRS & Corporate Tax Master",
    category: "Financial Reporting",
    level: "Intermediate",
    iconName: "Award",
    isUnlocked: false,
    requirements: "ผ่านการคำนวณภาษีเงินได้นิติบุคคล ภ.ง.ด.50 ม.65 ทวิ/ตรี และมาตรฐาน TFRS 15 / TFRS 16",
  },
];

// 7. Big 4 & Accounting Firm Interview Questions
export const INTERVIEW_QUESTIONS = [
  {
    id: "q-audit-substantive",
    company: "PwC / EY (Audit Associate)",
    position: "ผู้ช่วยผู้สอบบัญชี",
    topic: "การตรวจสอบลูกหนี้การค้าและเงินสด",
    question:
      "หากคุณตรวจสอบงบทดลองสิ้นปี แล้วพบว่ายอดลูกหนี้การค้ามียอดเครดิตคงเหลือ (Credit Balance) และยอดขายเดือนธันวาคมสูงกว่าปกติถึง 3 เท่า คุณจะมีขั้นตอนการตรวจสอบ (Audit Procedures) อย่างไรบ้าง?",
    rubric:
      "ระบุเรื่องการตรวจหาสาเหตุรับเงินล่วงหน้า/ใบลดหนี้, การส่งหนังสือยืนยันยอด (Confirmation), และการตรวจ Cut-off ยอดขายช่วงสิ้นงวด",
  },
  {
    id: "q-it-audit-controls",
    company: "Deloitte / KPMG (IT Audit & Assurance)",
    position: "ผู้ตรวจสอบระบบสารสนเทศ (IT Auditor)",
    topic: "การควบคุมระบบ ERP และ SOD",
    question:
      "อธิบายความแตกต่างระหว่าง IT General Controls (ITGC) กับ Application Controls (ITAC) ในระบบ ERP พร้อมยกตัวอย่างกรณีศึกษาจริงที่ระบบงานล้มเหลวหากขาดการควบคุมทั้งสองอย่างนี้",
    rubric:
      "แยกแยะขอบเขตการควบคุมระดับภาพรวมระบบ vs ระดับธุรกรรม, ยกตัวอย่าง 3-Way Match หรือ User Access Review ชัดเจน",
  },
  {
    id: "q-corporate-tax",
    company: "Leading Public Company (Finance & Tax Accountant)",
    position: "นักวิเคราะห์การเงินและภาษีนิติบุคคล",
    topic: "ภาษีเงินได้นิติบุคคล ม.65 ทวิ/ตรี",
    question:
      "ในทางบัญชีกิจการมีกำไรสุทธิ 5,000,000 บาท แต่มีรายการค่ารับรอง 400,000 บาท, ค่าปรับทางภาษี 50,000 บาท และค่าเสื่อมราคาตัดบัญชีเร็วกว่าเกณฑ์สรรพากร 120,000 บาท อธิบายวิธีปรับปรุงกำไรสุทธิทางบัญชีให้เป็นกำไรสุทธิทางภาษีเพื่อคำนวณ ภ.ง.ด.50",
    rubric:
      "บวกกลับรายจ่ายต้องห้ามตาม ม.65 ตรี (ค่าปรับ, ค่ารับรองส่วนเกินเพดาน 0.3%) และผลต่างค่าเสื่อมราคา",
  },
  {
    id: "q-cloud-bi",
    company: "Tech Enterprise (Accounting Data Analyst)",
    position: "นักวิเคราะห์ข้อมูลทางการบัญชี (Accounting Analyst)",
    topic: "Data Analytics & Power BI",
    question:
      "หากผู้บริหารต้องการดูแดชบอร์ดสภาพคล่องกระแสเงินสดและพยากรณ์เงินสดหมุนเวียน (Cash Runway) ล่วงหน้า 6 เดือน คุณจะเชื่อมต่อข้อมูลจากระบบบัญชีอย่างไร และใช้ตัวชี้วัดใดในการนำเสนอ?",
    rubric:
      "อธิบาย Data Pipeline จาก ERP/GL, Star Schema, ตัวชี้วัด DSO, DPO, Operating Cash Flow และ Burn Rate",
  },
];
