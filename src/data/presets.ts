import { AccountItem, LessonSummaryResponse } from "../types/accounting";

export interface BusinessPreset {
  id: string;
  name: string;
  type: "service" | "merchandising";
  description: string;
  period: string;
  accounts: AccountItem[];
}

export const BUSINESS_PRESETS: BusinessPreset[] = [
  {
    id: "it-service",
    name: "บริษัท คอมพิวเตอร์ แอนด์ เน็ตเวิร์ค ซิสเต็มส์ จำกัด",
    type: "service",
    description: "กิจการให้บริการซ่อมบำรุงคอมพิวเตอร์ วางระบบคลาวด์ และพัฒนาซอฟต์แวร์ (ธุรกิจบริการ)",
    period: "สำหรับปี สิ้นสุดวันที่ 31 ธันวาคม 2567",
    accounts: [
      // 1: Assets
      { id: "a-101", code: "11100", name: "เงินสดและรายการเทียบเท่าเงินสด", category: 1, subCategory: "current_asset", debit: 250000, credit: 0 },
      { id: "a-102", code: "11200", name: "เงินฝากกระแสรายวัน - ธนาคารกรุงไทย", category: 1, subCategory: "current_asset", debit: 420000, credit: 0 },
      { id: "a-103", code: "11300", name: "ลูกหนี้การค้า - สัญญาบริการไอที", category: 1, subCategory: "current_asset", debit: 180000, credit: 0 },
      { id: "a-104", code: "11400", name: "วัสดุอุปกรณ์สำนักงานและอะไหล่คอมพิวเตอร์", category: 1, subCategory: "current_asset", debit: 45000, credit: 0 },
      { id: "a-105", code: "11500", name: "ค่าเบี้ยประกันภัยจ่ายล่วงหน้า", category: 1, subCategory: "current_asset", debit: 24000, credit: 0 },
      { id: "a-106", code: "12100", name: "เครื่องคอมพิวเตอร์และอุปกรณ์เซิร์ฟเวอร์", category: 1, subCategory: "non_current_asset", debit: 550000, credit: 0 },
      { id: "a-107", code: "12110", name: "ค่าเสื่อมราคาสะสม - เครื่องคอมพิวเตอร์และเซิร์ฟเวอร์", category: 1, subCategory: "contra_asset", debit: 0, credit: 110000, isContra: true },
      { id: "a-108", code: "12200", name: "โปรแกรมระบบบัญชีคอมพิวเตอร์และลิขสิทธิ์ซอฟต์แวร์", category: 1, subCategory: "non_current_asset", debit: 160000, credit: 0 },
      { id: "a-109", code: "12210", name: "ค่าตัดจำหน่ายสะสม - ลิขสิทธิ์ซอฟต์แวร์", category: 1, subCategory: "contra_asset", debit: 0, credit: 32000, isContra: true },
      { id: "a-110", code: "12300", name: "อาคารและส่วนปรับปรุงสำนักงาน", category: 1, subCategory: "non_current_asset", debit: 800000, credit: 0 },
      { id: "a-111", code: "12310", name: "ค่าเสื่อมราคาสะสม - อาคารสำนักงาน", category: 1, subCategory: "contra_asset", debit: 0, credit: 80000, isContra: true },

      // 2: Liabilities
      { id: "l-201", code: "21100", name: "เจ้าหนี้การค้า - บริษัท ฮาร์ดแวร์ ดิสทริบิวชั่น จำกัด", category: 2, subCategory: "current_liability", debit: 0, credit: 125000 },
      { id: "l-202", code: "21200", name: "ค่าใช้จ่ายค้างจ่าย (เงินเดือนและค่าเซิร์ฟเวอร์)", category: 2, subCategory: "current_liability", debit: 0, credit: 48000 },
      { id: "l-203", code: "21300", name: "รายได้ค่าบริการไอทีรับล่วงหน้า", category: 2, subCategory: "current_liability", debit: 0, credit: 65000 },
      { id: "l-204", code: "22100", name: "เงินกู้ยืมระยะยาวจากสถาบันการเงิน", category: 2, subCategory: "non_current_liability", debit: 0, credit: 300000 },

      // 3: Equity
      { id: "e-301", code: "31100", name: "ทุนจดทะเบียนชำระแล้ว - หุ้นสามัญ", category: 3, subCategory: "equity_capital", debit: 0, credit: 1200000 },
      { id: "e-302", code: "31200", name: "เงินปันผลจ่าย / ถอนใช้ส่วนตัว", category: 3, subCategory: "equity_drawings", debit: 50000, credit: 0 },
      { id: "e-303", code: "31300", name: "กำไรสะสมยกมาจากปีก่อน", category: 3, subCategory: "equity_capital", debit: 0, credit: 180000 },

      // 4: Revenue
      { id: "r-401", code: "41100", name: "รายได้ค่าบริการติดตั้งและวางระบบเครือข่าย", category: 4, subCategory: "operating_revenue", debit: 0, credit: 850000 },
      { id: "r-402", code: "41200", name: "รายได้ค่าบริการสัญญาบำรุงรักษาระบบ (MA)", category: 4, subCategory: "operating_revenue", debit: 0, credit: 420000 },
      { id: "r-403", code: "42100", name: "รายได้ดอกเบี้ยรับและอื่นๆ", category: 4, subCategory: "other_revenue", debit: 0, credit: 9000 },

      // 5: Expenses
      { id: "x-501", code: "51100", name: "ต้นทุนการให้บริการทางไอทีและระบบคลาวด์", category: 5, subCategory: "cost_of_sales", debit: 310000, credit: 0 },
      { id: "x-502", code: "52100", name: "เงินเดือนและผลประโยชน์พนักงานโปรแกรมเมอร์/บัญชี", category: 5, subCategory: "operating_expense", debit: 280000, credit: 0 },
      { id: "x-503", code: "52200", name: "ค่าเช่าพื้นที่เซิร์ฟเวอร์ Cloud Data Center", category: 5, subCategory: "operating_expense", debit: 96000, credit: 0 },
      { id: "x-504", code: "52300", name: "ค่าเสื่อมราคาและค่าตัดจำหน่ายอุปกรณ์คอมพิวเตอร์", category: 5, subCategory: "operating_expense", debit: 75000, credit: 0 },
      { id: "x-505", code: "52400", name: "ค่าสาธารณูปโภคและอินเทอร์เน็ตความเร็วสูง", category: 5, subCategory: "operating_expense", debit: 42000, credit: 0 },
      { id: "x-506", code: "52500", name: "ค่าใช้จ่ายในการฝึกอบรมและสัมมนาไอที", category: 5, subCategory: "operating_expense", debit: 18000, credit: 0 },
      { id: "x-507", code: "53100", name: "ต้นทุนทางการเงิน (ดอกเบี้ยจ่ายเงินกู้)", category: 5, subCategory: "financial_cost", debit: 15000, credit: 0 },
      { id: "x-508", code: "59100", name: "ภาษีเงินได้นิติบุคคล", category: 5, subCategory: "tax_expense", debit: 43000, credit: 0 },
    ],
  },
  {
    id: "pc-shop",
    name: "ห้างหุ้นส่วนจำกัด สมาร์ท คอมพ์ & ซอฟต์แวร์ โซลูชั่นส์",
    type: "merchandising",
    description: "กิจการจำหน่ายคอมพิวเตอร์ อุปกรณ์ไอที และโปรแกรมสำเร็จรูป (ธุรกิจซื้อมาขายไป)",
    period: "สำหรับปี สิ้นสุดวันที่ 31 ธันวาคม 2567",
    accounts: [
      // 1: Assets
      { id: "b-101", code: "11100", name: "เงินสดในมือ", category: 1, subCategory: "current_asset", debit: 95000, credit: 0 },
      { id: "b-102", code: "11200", name: "เงินฝากออมทรัพย์ - ธนาคารกสิกรไทย", category: 1, subCategory: "current_asset", debit: 380000, credit: 0 },
      { id: "b-103", code: "11300", name: "ลูกหนี้การค้า", category: 1, subCategory: "current_asset", debit: 210000, credit: 0 },
      { id: "b-104", code: "11400", name: "สินค้าคงเหลือ (คอมพิวเตอร์และอุปกรณ์ไอที)", category: 1, subCategory: "current_asset", debit: 450000, credit: 0 },
      { id: "b-105", code: "11500", name: "วัสดุร้านค้าและบรรจุภัณฑ์", category: 1, subCategory: "current_asset", debit: 22000, credit: 0 },
      { id: "b-106", code: "12100", name: "อุปกรณ์และเครื่องตกแต่งหน้าร้าน", category: 1, subCategory: "non_current_asset", debit: 320000, credit: 0 },
      { id: "b-107", code: "12110", name: "ค่าเสื่อมราคาสะสม - อุปกรณ์หน้าร้าน", category: 1, subCategory: "contra_asset", debit: 0, credit: 64000, isContra: true },
      { id: "b-108", code: "12200", name: "ยานพาหนะส่งสินค้า", category: 1, subCategory: "non_current_asset", debit: 650000, credit: 0 },
      { id: "b-109", code: "12210", name: "ค่าเสื่อมราคาสะสม - ยานพาหนะ", category: 1, subCategory: "contra_asset", debit: 0, credit: 130000, isContra: true },

      // 2: Liabilities
      { id: "b-201", code: "21100", name: "เจ้าหนี้การค้า - ซัพพลายเออร์ไอที", category: 2, subCategory: "current_liability", debit: 0, credit: 260000 },
      { id: "b-202", code: "21200", name: "ภาษีมูลค่าเพิ่มค้างจ่าย (ภ.พ.30)", category: 2, subCategory: "current_liability", debit: 0, credit: 38000 },
      { id: "b-203", code: "21300", name: "ค่าจ้างค้างจ่าย", category: 2, subCategory: "current_liability", debit: 0, credit: 35000 },
      { id: "b-204", code: "22100", name: "เงินกู้ระยะยาวเพื่อการลงทุน", category: 2, subCategory: "non_current_liability", debit: 0, credit: 200000 },

      // 3: Equity
      { id: "b-301", code: "31100", name: "ทุน - หุ้นส่วนผู้จัดการ", category: 3, subCategory: "equity_capital", debit: 0, credit: 800000 },
      { id: "b-302", code: "31200", name: "ทุน - หุ้นส่วนจำกัดความรับผิด", category: 3, subCategory: "equity_capital", debit: 0, credit: 400000 },
      { id: "b-303", code: "31300", name: "ถอนใช้ส่วนตัวของหุ้นส่วน", category: 3, subCategory: "equity_drawings", debit: 60000, credit: 0 },

      // 4: Revenues
      { id: "b-401", code: "41100", name: "ขายสินค้า (คอมพิวเตอร์และอุปกรณ์เสริม)", category: 4, subCategory: "operating_revenue", debit: 0, credit: 1650000 },
      { id: "b-402", code: "41200", name: "รับคืนและส่วนลดจ่าย (หักรายได้)", category: 4, subCategory: "operating_revenue", debit: 25000, credit: 0, isContra: true },
      { id: "b-403", code: "42100", name: "รายได้ค่าติดตั้งและซ่อมบำรุง", category: 4, subCategory: "other_revenue", debit: 0, credit: 85000 },

      // 5: Expenses
      { id: "b-501", code: "51100", name: "ต้นทุนขายสินค้า (Cost of Goods Sold)", category: 5, subCategory: "cost_of_sales", debit: 980000, credit: 0 },
      { id: "b-502", code: "52100", name: "เงินเดือนและค่าคอมมิชชั่นพนักงานขาย", category: 5, subCategory: "operating_expense", debit: 240000, credit: 0 },
      { id: "b-503", code: "52200", name: "ค่าเช่าร้านค้าและค่าไฟฟ้าร้าน", category: 5, subCategory: "operating_expense", debit: 110000, credit: 0 },
      { id: "b-504", code: "52300", name: "ค่าโฆษณาออนไลน์และการตลาดดิจิทัล", category: 5, subCategory: "operating_expense", debit: 45000, credit: 0 },
      { id: "b-505", code: "52400", name: "ค่าเสื่อมราคาอุปกรณ์และยานพาหนะ", category: 5, subCategory: "operating_expense", debit: 55000, credit: 0 },
      { id: "b-506", code: "53100", name: "ดอกเบี้ยจ่ายเงินกู้", category: 5, subCategory: "financial_cost", debit: 12000, credit: 0 },
      { id: "b-507", code: "59100", name: "ภาษีเงินได้นิติบุคคล", category: 5, subCategory: "tax_expense", debit: 29000, credit: 0 },
    ],
  },
];

export const PRELOADED_LESSONS: Record<string, LessonSummaryResponse> = {
  accounting_cycle: {
    title: "วงจรบัญชีคอมพิวเตอร์และผังบัญชี (Computerized Accounting Cycle)",
    category: "ระบบสารสนเทศทางการบัญชี (AIS)",
    overview:
      "วงจรบัญชีคอมพิวเตอร์ (Computerized Accounting Cycle) คือกระบวนการบันทึก ประมวลผล และรายงานข้อมูลทางการเงินโดยใช้โปรแกรมระบบบัญชี แทนการจดลงสมุดบัญชีด้วยมือ จุดเด่นคือเมื่อป้อนรายการในสมุดรายวัน (Journal) โปรแกรมจะผ่านรายการไปยังบัญชีแยกประเภท (Ledger) และจัดทำงบทดลอง (Trial Balance) จนถึงงบการเงินให้อัตโนมัติทันที",
    keyPrinciples: [
      "การตั้งผังบัญชี (Chart of Accounts) เป็นโครงสร้างรากฐาน: ใช้ระบบรหัสตัวเลข 5 หลัก (หมวด 1-5) เพื่อให้ฐานข้อมูลจัดหมวดหมู่อัตโนมัติ",
      "หลักการบัญชีคู่ (Double-Entry System): ทุกรายการค้า ผลรวม Debit ต้องเท่ากับ Credit เสมอ หากไม่เท่ากัน ซอฟต์แวร์บัญชีจะบล็อกไม่อนุญาตให้บันทึก",
      "การกระทบยอดและตรวจสอบความถูกต้อง (Input Validation & Audit Trail): ซอฟต์แวร์จะเก็บประวัติการแก้ไข วันที่-เวลา และผู้บันทึก เพื่อความโปร่งใส",
    ],
    computerAccountingInsights:
      "ในซอฟต์แวร์บัญชี (เช่น Express, SAP, ERP Cloud) รายการค้าจะผ่านการกำหนด Post/Unpost สถานะ โดยระบบจะทำการสร้างรหัสเอกสารอัตโนมัติ (Document Running Number) เช่น ใบเสร็จรับเงิน (RV), ใบกำกับภาษีขาย (IV), ใบสำคัญจ่าย (PV)",
    journalExamples: [
      {
        transaction: "ซื้อเครื่องแม่ข่ายเซิร์ฟเวอร์และระบบเครือข่ายเป็นเงินสด 75,000 บาท",
        debit: [{ account: "อุปกรณ์คอมพิวเตอร์และเซิร์ฟเวอร์ (หมวด 1)", code: "12100", amount: "75,000.00" }],
        credit: [{ account: "เงินสดในมือ/เงินฝากธนาคาร (หมวด 1)", code: "11100", amount: "75,000.00" }],
        explanation: "สินทรัพย์ถาวรประเภทคอมพิวเตอร์เพิ่มขึ้น (Dr.) และสินทรัพย์หมุนเวียนเงินสดลดลง (Cr.) ในมูลค่าเท่ากัน",
      },
      {
        transaction: "ให้บริการติดตั้งระบบสารสนเทศแก่ลูกค้า ได้รับเงินสด 40,000 บาท",
        debit: [{ account: "เงินสด (หมวด 1)", code: "11100", amount: "40,000.00" }],
        credit: [{ account: "รายได้ค่าบริการไอที (หมวด 4)", code: "41100", amount: "40,000.00" }],
        explanation: "สินทรัพย์เงินสดเพิ่มขึ้น (Dr.) และรายได้จากงานบริการเพิ่มขึ้น (Cr.) ส่งผลให้กำไรและส่วนของเจ้าของสูงขึ้น",
      },
    ],
    commonExamTraps: [
      "จำสับสนระหว่าง 'สินทรัพย์ประเภทลิขสิทธิ์ซอฟต์แวร์' ซึ่งเป็นสินทรัพย์ไม่มีตัวตน (Intangible Asset) กับ 'ค่าใช้จ่ายซอฟต์แวร์แบบรายเดือน SaaS' ซึ่งบันทึกเป็นค่าใช้จ่ายดำเนินงานทันที",
      "ลืมตรวจเช็คความสัมพันธ์: สินทรัพย์ = หนี้สิน + ส่วนของเจ้าของ (A = L + OE)",
    ],
    practiceQuiz: [
      {
        question: "ในโปรแกรมระบบบัญชีคอมพิวเตอร์ หากป้อนรายการสมุดรายวันทั่วไปแล้วยอด Debit ไม่เท่ากับ Credit ระบบควรมีมาตรการควบคุมใด?",
        options: [
          "ก. ปัดเศษตัวเลขให้เท่ากันอัตโนมัติ",
          "ข. ปฏิเสธการบันทึกรายการ (Error Validation) และแจ้งเตือนให้ผู้ใช้แก้ไข",
          "ค. โอนส่วนต่างเข้าบัญชีค่าใช้จ่ายเบ็ดเตล็ดทันที",
          "ง. บันทึกได้ตามปกติ แล้วค่อยคำนวณใหม่สิ้นปี",
        ],
        correctIndex: 1,
        explanation:
          "หลักการควบคุมความถูกต้องของข้อมูล (Input Controls) ในซอฟต์แวร์บัญชีต้องป้องกันไม่ให้บันทึกรายการที่ไม่สมดุล เพื่อป้องกันความผิดพลาดในงบทดลอง",
      },
      {
        question: "รหัสบัญชีหมวดที่ 3 ในผังบัญชีมาตรฐาน หมายถึงหมวดใด?",
        options: ["ก. สินทรัพย์", "ข. หนี้สิน", "ค. ส่วนของเจ้าของ (ทุน)", "ง. รายได้"],
        correctIndex: 2,
        explanation: "หมวด 1 = สินทรัพย์, 2 = หนี้สิน, 3 = ส่วนของเจ้าของ, 4 = รายได้, 5 = ค่าใช้จ่าย",
      },
    ],
  },
  adjusting_entries: {
    title: "รายการปรับปรุงบัญชีสิ้นงวดและกระดาษทำการ (Adjusting Entries & Worksheet)",
    category: "การบัญชีการเงิน (Financial Accounting)",
    overview:
      "รายการปรับปรุง (Adjusting Entries) ทำขึ้น ณ วันสิ้นงวดบัญชี เพื่อปรับปรุงรายได้และค่าใช้จ่ายให้ถูกต้องตาม 'เกณฑ์คงค้าง' (Accrual Basis) เพื่อให้งบการเงินสะท้อนผลการดำเนินงานและฐานะการเงินที่แท้จริง ประกอบด้วย: ค่าใช้จ่ายค้างจ่าย, ค่าใช้จ่ายล่วงหน้า, รายได้ค้างรับ, รายได้รับล่วงหน้า, ค่าเสื่อมราคา และหนี้สงสัยจะสูญ",
    keyPrinciples: [
      "เกณฑ์คงค้าง (Accrual Basis): รับรู้รายได้เมื่อส่งมอบงาน/ขายสินค้าแล้ว แม้ยังไม่ได้รับเงิน และรับรู้ค่าใช้จ่ายเมื่อเกิดขึ้นแล้ว แม้ยังไม่ได้จ่ายเงิน",
      "ค่าเสื่อมราคาคอมพิวเตอร์และอุปกรณ์ (Depreciation): การปันส่วนราคาทุนของสินทรัพย์ถาวรเป็นค่าใช้จ่ายตามอายุการใช้งาน (คอมพิวเตอร์มาตรฐานมักตัด 3 - 5 ปี)",
      "กระดาษทำการ (Worksheet): เครื่องมือร่างการคำนวณเพื่อเตรียมจัดทำงบการเงิน 6 ช่อง หรือ 8 ช่อง",
    ],
    computerAccountingInsights:
      "ในซอฟต์แวร์บัญชีคอมพิวเตอร์ส่วนใหญ่มีโมดูล 'สินทรัพย์ถาวร (Fixed Asset Module)' ที่สามารถคำนวณค่าเสื่อมราคาอัตโนมัติตามวิธีเส้นตรง (Straight-Line) พร้อมส่งรายการบันทึกสมุดรายวันปรับปรุง (Auto JV) ให้ผู้จัดการอนุมัติคลิกเดียว",
    journalExamples: [
      {
        transaction: "ปรับปรุงค่าเสื่อมราคาเครื่องคอมพิวเตอร์ประจำงวด 15,000 บาท",
        debit: [{ account: "ค่าเสื่อมราคา - เครื่องคอมพิวเตอร์ (หมวด 5)", code: "52400", amount: "15,000.00" }],
        credit: [{ account: "ค่าเสื่อมราคาสะสม - เครื่องคอมพิวเตอร์ (หมวด 1 Contra)", code: "12110", amount: "15,000.00" }],
        explanation: "Dr. ค่าใช้จ่ายในงบกำไรขาดทุน และ Cr. บัญชีปรับมูลค่าสินทรัพย์ (Contra-Asset) เพื่อลดยอดสุทธิในงบแสดงฐานะการเงิน",
      },
      {
        transaction: "ปรับปรุงค่าบริการอินเทอร์เน็ตและคลาวด์ค้างจ่ายสิ้นงวด 4,500 บาท",
        debit: [{ account: "ค่าบริการอินเทอร์เน็ตและคลาวด์ (หมวด 5)", code: "52500", amount: "4,500.00" }],
        credit: [{ account: "ค่าใช้จ่ายค้างจ่าย (หมวด 2)", code: "21200", amount: "4,500.00" }],
        explanation: "รับรู้ค่าใช้จ่ายงวดปัจจุบันทันที และบันทึกเป็นหนี้สินหมุนเวียนรอจ่ายเงินในงวดถัดไป",
      },
    ],
    commonExamTraps: [
      "นำ 'ค่าเสื่อมราคาสะสม' ไปบวกเพิ่มในสินทรัพย์ แทนที่จะเป็นตัวหักลบ",
      "สับสนระหว่างค่าใช้จ่ายจ่ายล่วงหน้า (เป็นสินทรัพย์หมุนเวียน) กับ ค่าใช้จ่ายค้างจ่าย (เป็นหนี้สินหมุนเวียน)",
    ],
    practiceQuiz: [
      {
        question: "บัญชี 'ค่าเสื่อมราคาสะสม-เครื่องคอมพิวเตอร์' แสดงในงบการเงินใดและในตำแหน่งใด?",
        options: [
          "ก. งบกำไรขาดทุน เป็นค่าใช้จ่ายในการบริหาร",
          "ข. งบแสดงฐานะการเงิน เป็นรายการหักออกจากราคาทุนของเครื่องคอมพิวเตอร์",
          "ค. งบแสดงฐานะการเงิน ในหมวดหนี้สินระยะยาว",
          "ง. งบแสดงการเปลี่ยนแปลงส่วนของเจ้าของ",
        ],
        correctIndex: 1,
        explanation:
          "ค่าเสื่อมราคาสะสมเป็นบัญชีปรับมูลค่าสินทรัพย์ (Contra-Asset Account) แสดงในงบแสดงฐานะการเงิน โดยนำไปหักออกจากราคาทุนของสินทรัพย์เพื่อแสดงมูลค่าตามบัญชีสุทธิ (Book Value)",
      },
    ],
  },
  inventory_systems: {
    title: "การบันทึกบัญชีสินค้าคงเหลือ: Perpetual vs Periodic ในระบบคอมพิวเตอร์",
    category: "การบัญชีสินค้าและซอฟต์แวร์ ERP",
    overview:
      "การบันทึกบัญชีสินค้าคงเหลือมี 2 ระบบหลัก คือ แบบต่อเนื่อง (Perpetual Inventory System) และแบบสิ้นงวด (Periodic Inventory System) ในยุคบัญชีคอมพิวเตอร์และระบบบาร์โค้ด/POS กิจการนิยมใช้แบบ Perpetual เพราะซอฟต์แวร์จะคำนวณและตัดสต็อกพร้อมบันทึกต้นทุนขายให้ทันทีทุกครั้งที่ขายสินค้า",
    keyPrinciples: [
      "Perpetual (ต่อเนื่อง): บันทึกเข้าบัญชี 'สินค้าคงเหลือ' โดยตรง เมื่อซื้อ Dr. สินค้าคงเหลือ, เมื่อขาย Dr. ต้นทุนขาย Cr. สินค้าคงเหลือ ทราบยอดคงเหลือได้ตลอดเวลา",
      "Periodic (สิ้นงวด): บันทึกเข้าบัญชี 'ซื้อสินค้า' เมื่อสิ้นงวดต้องตรวจนับและคำนวณ: ต้นทุนขาย = สินค้าต้นงวด + ซื้อสุทธิ - สินค้าปลายงวด",
      "วิธีตีราคาสินค้า: FIFO (เข้าก่อน-ออกก่อน), ถัวเฉลี่ยถ่วงน้ำหนัก (Weighted Average) หรือ Moving Average ที่คอมพิวเตอร์คำนวณทุกการรับเข้า",
    ],
    computerAccountingInsights:
      "ระบบ POS และ ERP เชื่อมต่อโมดูลคลังสินค้า (Inventory) เข้ากับโมดูลบัญชีแยกประเภท (GL) แบบ Real-time เมื่อแคชเชียร์สแกนบาร์โค้ดขาย ระบบจะบันทึกบัญชีคู่ทันที 2 ขา: ขารายได้ (Dr.เงินสด/ลูกหนี้ Cr.ขาย) และขาต้นทุน (Dr.ต้นทุนขาย Cr.สินค้าคงเหลือ)",
    journalExamples: [
      {
        transaction: "ขายคอมพิวเตอร์โน้ตบุ๊กเป็นเงินสด 35,000 บาท (ต้นทุนเครื่องละ 24,000 บาท) แบบ Perpetual",
        debit: [
          { account: "เงินสด (หมวด 1)", code: "11100", amount: "35,000.00" },
          { account: "ต้นทุนขาย (หมวด 5)", code: "51100", amount: "24,000.00" },
        ],
        credit: [
          { account: "ขายสินค้า (หมวด 4)", code: "41100", amount: "35,000.00" },
          { account: "สินค้าคงเหลือ (หมวด 1)", code: "11400", amount: "24,000.00" },
        ],
        explanation: "ในระบบ Perpetual ทุกการขายจะมี 2 ขั้นตอนพร้อมกันเสมอ: บันทึกราคาขายและตัดยอดสต็อกเป็นต้นทุนขาย",
      },
    ],
    commonExamTraps: [
      "ในวิธี Periodic ห้ามบันทึกบัญชี 'ต้นทุนขาย' ตอนขายของเด็ดขาด ต้องรอคำนวณปรับปรุงเมื่อสิ้นงวดเท่านั้น",
      "ลืมบวกค่าขนส่งเข้า (เป็นส่วนหนึ่งของต้นทุนสินค้า) และลืมหักส่วนลดรับ/ส่งคืน",
    ],
    practiceQuiz: [
      {
        question: "เหตุใดระบบบัญชีคอมพิวเตอร์ในปัจจุบันจึงนิยมใช้ระบบ Perpetual มากกว่า Periodic?",
        options: [
          "ก. เพราะระบบ Periodic ผิดกฎหมายสรรพากร",
          "ข. เพราะคอมพิวเตอร์และระบบสแกนบาร์โค้ดช่วยตัดยอดและคำนวณต้นทุนขายอัตโนมัติ ทำให้ทราบสต็อกและกำไรได้ทันที Real-time",
          "ค. เพราะ Perpetual ไม่จำเป็นต้องมีการควบคุมภายใน",
          "ง. เพราะประหยัดพื้นที่จัดเก็บข้อมูลบนฮาร์ดดิสก์",
        ],
        correctIndex: 1,
        explanation:
          "เทคโนโลยีคอมพิวเตอร์ช่วยลดภาระการคำนวณที่ซับซ้อน ทำให้ระบบ Perpetual ทำงานได้รวดเร็ว ช่วยให้ผู้บริหารเห็นยอดสต็อกและต้นทุนขายแบบเรียลไทม์",
      },
    ],
  },
};
