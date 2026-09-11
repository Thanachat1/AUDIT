export type AccountCategory = 1 | 2 | 3 | 4 | 5;

export interface AccountCategoryInfo {
  id: AccountCategory;
  nameTh: string;
  nameEn: string;
  normalBalance: "debit" | "credit";
  color: string;
  codePrefix: string;
}

export const ACCOUNT_CATEGORIES: Record<AccountCategory, AccountCategoryInfo> = {
  1: {
    id: 1,
    nameTh: "สินทรัพย์ (Assets)",
    nameEn: "Assets",
    normalBalance: "debit",
    color: "emerald",
    codePrefix: "1",
  },
  2: {
    id: 2,
    nameTh: "หนี้สิน (Liabilities)",
    nameEn: "Liabilities",
    normalBalance: "credit",
    color: "amber",
    codePrefix: "2",
  },
  3: {
    id: 3,
    nameTh: "ส่วนของเจ้าของ (Owner's Equity)",
    nameEn: "Owner's Equity",
    normalBalance: "credit",
    color: "indigo",
    codePrefix: "3",
  },
  4: {
    id: 4,
    nameTh: "รายได้ (Revenues)",
    nameEn: "Revenues",
    normalBalance: "credit",
    color: "cyan",
    codePrefix: "4",
  },
  5: {
    id: 5,
    nameTh: "ค่าใช้จ่าย (Expenses)",
    nameEn: "Expenses",
    normalBalance: "debit",
    color: "rose",
    codePrefix: "5",
  },
};

export type SubCategory =
  | "current_asset"
  | "non_current_asset"
  | "contra_asset" // เช่น ค่าเสื่อมราคาสะสม
  | "current_liability"
  | "non_current_liability"
  | "equity_capital"
  | "equity_drawings" // ถอนใช้ส่วนตัว
  | "operating_revenue"
  | "other_revenue"
  | "cost_of_sales"
  | "operating_expense"
  | "administrative_expense"
  | "financial_cost"
  | "tax_expense";

export interface AccountItem {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  subCategory?: SubCategory;
  debit: number;
  credit: number;
  isContra?: boolean;
}

export interface JournalLine {
  id: string;
  accountId?: string;
  accountCode: string;
  accountName: string;
  category: AccountCategory;
  type: "debit" | "credit";
  amount: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference?: string;
  lines: JournalLine[];
}

export interface StatementItem {
  code: string;
  name: string;
  amount: number;
  isNegative?: boolean;
  indent?: number;
}

export interface IncomeStatementData {
  businessName: string;
  period: string;
  revenues: StatementItem[];
  totalRevenues: number;
  costOfSales: StatementItem[];
  totalCostOfSales: number;
  grossProfit: number;
  operatingExpenses: StatementItem[];
  totalOperatingExpenses: number;
  operatingProfit: number; // กำไรจากการดำเนินงาน
  financialCosts: StatementItem[];
  totalFinancialCosts: number;
  profitBeforeTax: number;
  taxExpense: number;
  netProfit: number; // กำไรสุทธิ (หรือ ขาดทุนสุทธิถ้าติดลบ)
}

export interface BalanceSheetData {
  businessName: string;
  asOfDate: string;
  currentAssets: StatementItem[];
  totalCurrentAssets: number;
  nonCurrentAssets: StatementItem[];
  totalNonCurrentAssets: number;
  totalAssets: number;

  currentLiabilities: StatementItem[];
  totalCurrentLiabilities: number;
  nonCurrentLiabilities: StatementItem[];
  totalNonCurrentLiabilities: number;
  totalLiabilities: number;

  equityItems: StatementItem[];
  netProfitForPeriod: number;
  totalEquity: number;

  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  difference: number;
}

export interface FinancialRatio {
  id: string;
  nameTh: string;
  nameEn: string;
  formula: string;
  value: number;
  unit: string;
  benchmark: string;
  interpretation: string;
  status: "good" | "neutral" | "warning";
}

export interface PracticeQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonSummaryResponse {
  title: string;
  category: string;
  overview: string;
  keyPrinciples: string[];
  computerAccountingInsights: string;
  journalExamples: Array<{
    transaction: string;
    debit: Array<{ account: string; code: string; amount: string }>;
    credit: Array<{ account: string; code: string; amount: string }>;
    explanation: string;
  }>;
  commonExamTraps: string[];
  practiceQuiz: PracticeQuizQuestion[];
}

export interface TutorChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

// Module 1: AIS & ERP System Simulation
export type ERPSoftwareType = "express" | "sap" | "flowaccount" | "peak";

export interface ERPDocumentField {
  label: string;
  key: string;
  value: string | number;
  type: "text" | "number" | "date" | "select";
  options?: string[];
}

export interface ERPDocumentSimulation {
  id: string;
  title: string;
  type: "invoice" | "receipt" | "payment" | "journal";
  software: ERPSoftwareType;
  description: string;
  fields: ERPDocumentField[];
  autoJournalGenerated: {
    drAccount: string;
    drCode: string;
    crAccount: string;
    crCode: string;
    vatAccount?: string;
    vatCode?: string;
    amount: number;
    vatAmount?: number;
  };
  keyConcept: string;
}

export interface SQLAccountingQuery {
  id: string;
  title: string;
  objective: string;
  sql: string;
  category: "General Ledger" | "Accounts Receivable" | "Accounts Payable" | "Audit & Controls";
  explanation: string;
  sampleResults: Array<Record<string, any>>;
}

// Module 2: AI Error Scanner & Audit
export interface AuditScanErrorItem {
  severity: "critical" | "warning" | "info";
  accountCode?: string;
  accountName: string;
  issueTitle: string;
  issueDescription: string;
  recommendedAdjustment: string;
  ruleReference: string;
}

export interface AuditScanResult {
  summary: string;
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  imbalanceDifference: number;
  errorCount: number;
  errors: AuditScanErrorItem[];
  correctedTrialBalanceSample?: Array<{
    code: string;
    name: string;
    category: number;
    debit: number;
    credit: number;
  }>;
  auditorTips: string;
}

// Module 3: Data Analytics & Power BI Dashboard
export interface BIMeasureItem {
  id: string;
  name: string;
  tool: "Power BI (DAX)" | "Tableau (Calculated Field)" | "SQL / Python";
  formula: string;
  businessContext: string;
  interpretation: string;
}

// Module 4: IT Audit & Digital Controls
export interface ITControlCase {
  id: string;
  title: string;
  type: "ITGC" | "ITAC" | "Fraud";
  scenario: string;
  vulnerability: string;
  controlSolution: string;
  realWorldImpact: string;
}

export interface SODRoleCheck {
  roleA: string;
  roleB: string;
  hasConflict: boolean;
  riskDescription: string;
  mitigatingControl: string;
}

// Module 5: Portfolio & Internship Preparation
export interface SkillBadge {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Master";
  iconName: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  requirements: string;
}

export interface MockInterviewResult {
  score: number;
  maxScore: number;
  overallVerdict: string;
  strengths: string[];
  areasForImprovement: string[];
  modelAnswer: string;
  followUpQuestion?: string;
}
