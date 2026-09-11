import {
  AccountItem,
  AccountCategory,
  IncomeStatementData,
  BalanceSheetData,
  FinancialRatio,
  StatementItem,
} from "../types/accounting";

// Formatter for Thai Baht
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "0.00";
  return amount.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Determine if account is current asset based on code or name
export function isCurrentAsset(account: AccountItem): boolean {
  if (account.category !== 1) return false;
  if (account.subCategory === "current_asset") return true;
  if (account.subCategory === "non_current_asset") return false;

  const code = account.code.trim();
  const name = account.name.toLowerCase();

  if (code.startsWith("11") || code.startsWith("10")) return true;
  if (
    name.includes("เงินสด") ||
    name.includes("เงินฝาก") ||
    name.includes("ลูกหนี้") ||
    name.includes("สินค้าคงเหลือ") ||
    name.includes("วัสดุ") ||
    name.includes("จ่ายล่วงหน้า") ||
    name.includes("ค้างรับ")
  ) {
    return true;
  }
  return false;
}

// Determine if account is current liability
export function isCurrentLiability(account: AccountItem): boolean {
  if (account.category !== 2) return false;
  if (account.subCategory === "current_liability") return true;
  if (account.subCategory === "non_current_liability") return false;

  const code = account.code.trim();
  const name = account.name.toLowerCase();

  if (code.startsWith("21") || code.startsWith("20")) return true;
  if (
    name.includes("เจ้าหนี้") ||
    name.includes("ค้างจ่าย") ||
    name.includes("รับล่วงหน้า") ||
    name.includes("ระยะสั้น")
  ) {
    return true;
  }
  return false;
}

// Determine if account is Cost of Goods Sold / Cost of Services
export function isCostOfSales(account: AccountItem): boolean {
  if (account.category !== 5) return false;
  if (account.subCategory === "cost_of_sales") return true;
  const code = account.code.trim();
  const name = account.name.toLowerCase();

  if (code.startsWith("51")) return true;
  if (
    name.includes("ต้นทุนขาย") ||
    name.includes("ต้นทุนการให้บริการ") ||
    name.includes("ซื้อสินค้า") ||
    name.includes("ค่าขนส่งเข้า")
  ) {
    return true;
  }
  return false;
}

// Calculate net balance of an account based on its normal balance
export function getAccountBalance(account: AccountItem): number {
  if (account.category === 1 || account.category === 5) {
    // Normal balance is Debit
    return account.debit - account.credit;
  } else {
    // Normal balance is Credit
    return account.credit - account.debit;
  }
}

// Compute Income Statement
export function computeIncomeStatement(
  accounts: AccountItem[],
  businessName: string = "บริษัท บัญชีคอมพิวเตอร์เซอร์วิส จำกัด",
  period: string = "สำหรับปี สิ้นสุดวันที่ 31 ธันวาคม 2567"
): IncomeStatementData {
  const revenues: StatementItem[] = [];
  let totalRevenues = 0;

  const costOfSales: StatementItem[] = [];
  let totalCostOfSales = 0;

  const operatingExpenses: StatementItem[] = [];
  let totalOperatingExpenses = 0;

  const financialCosts: StatementItem[] = [];
  let totalFinancialCosts = 0;

  let taxExpense = 0;

  for (const acc of accounts) {
    const balance = getAccountBalance(acc);
    if (Math.abs(balance) < 0.001) continue;

    if (acc.category === 4) {
      // Revenues (Credit normal balance)
      revenues.push({
        code: acc.code,
        name: acc.name,
        amount: balance,
      });
      totalRevenues += balance;
    } else if (acc.category === 5) {
      // Expenses (Debit normal balance)
      const name = acc.name.toLowerCase();
      if (isCostOfSales(acc)) {
        costOfSales.push({
          code: acc.code,
          name: acc.name,
          amount: balance,
        });
        totalCostOfSales += balance;
      } else if (
        name.includes("ดอกเบี้ยจ่าย") ||
        name.includes("ค่าธรรมเนียมการเงิน") ||
        acc.subCategory === "financial_cost"
      ) {
        financialCosts.push({
          code: acc.code,
          name: acc.name,
          amount: balance,
        });
        totalFinancialCosts += balance;
      } else if (name.includes("ภาษีเงินได้") || acc.subCategory === "tax_expense") {
        taxExpense += balance;
      } else {
        operatingExpenses.push({
          code: acc.code,
          name: acc.name,
          amount: balance,
        });
        totalOperatingExpenses += balance;
      }
    }
  }

  const grossProfit = totalRevenues - totalCostOfSales;
  const operatingProfit = grossProfit - totalOperatingExpenses;
  const profitBeforeTax = operatingProfit - totalFinancialCosts;
  const netProfit = profitBeforeTax - taxExpense;

  return {
    businessName,
    period,
    revenues,
    totalRevenues,
    costOfSales,
    totalCostOfSales,
    grossProfit,
    operatingExpenses,
    totalOperatingExpenses,
    operatingProfit,
    financialCosts,
    totalFinancialCosts,
    profitBeforeTax,
    taxExpense,
    netProfit,
  };
}

// Compute Balance Sheet
export function computeBalanceSheet(
  accounts: AccountItem[],
  netProfit: number,
  businessName: string = "บริษัท บัญชีคอมพิวเตอร์เซอร์วิส จำกัด",
  asOfDate: string = "ณ วันที่ 31 ธันวาคม 2567"
): BalanceSheetData {
  const currentAssets: StatementItem[] = [];
  let totalCurrentAssets = 0;

  const nonCurrentAssets: StatementItem[] = [];
  let totalNonCurrentAssets = 0;

  const currentLiabilities: StatementItem[] = [];
  let totalCurrentLiabilities = 0;

  const nonCurrentLiabilities: StatementItem[] = [];
  let totalNonCurrentLiabilities = 0;

  const equityItems: StatementItem[] = [];
  let rawEquitySum = 0;

  for (const acc of accounts) {
    if (acc.category === 1) {
      // Asset
      const isContra =
        acc.isContra ||
        acc.name.includes("ค่าเสื่อมราคาสะสม") ||
        acc.name.includes("ค่าเผื่อหนี้สงสัยจะสูญ");

      let balance = acc.debit - acc.credit;

      if (isCurrentAsset(acc)) {
        currentAssets.push({
          code: acc.code,
          name: acc.name,
          amount: balance,
          isNegative: balance < 0,
        });
        totalCurrentAssets += balance;
      } else {
        // Non-current asset
        if (isContra && balance > 0) {
          balance = -balance;
        }
        nonCurrentAssets.push({
          code: acc.code,
          name: acc.name,
          amount: Math.abs(balance),
          isNegative: isContra || balance < 0,
        });
        totalNonCurrentAssets += balance;
      }
    } else if (acc.category === 2) {
      // Liability
      const balance = acc.credit - acc.debit;
      if (isCurrentLiability(acc)) {
        currentLiabilities.push({
          code: acc.code,
          name: acc.name,
          amount: balance,
        });
        totalCurrentLiabilities += balance;
      } else {
        nonCurrentLiabilities.push({
          code: acc.code,
          name: acc.name,
          amount: balance,
        });
        totalNonCurrentLiabilities += balance;
      }
    } else if (acc.category === 3) {
      // Equity
      const isDrawings =
        acc.name.includes("ถอนใช้ส่วนตัว") ||
        acc.name.includes("เงินปันผล") ||
        acc.subCategory === "equity_drawings";

      let balance = acc.credit - acc.debit;
      if (isDrawings && balance < 0) {
        // drawings decreases equity
        equityItems.push({
          code: acc.code,
          name: acc.name,
          amount: Math.abs(balance),
          isNegative: true,
        });
        rawEquitySum += balance;
      } else {
        equityItems.push({
          code: acc.code,
          name: acc.name,
          amount: balance,
          isNegative: balance < 0,
        });
        rawEquitySum += balance;
      }
    }
  }

  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
  const totalEquity = rawEquitySum + netProfit;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  const difference = Math.abs(totalAssets - totalLiabilitiesAndEquity);
  const isBalanced = difference < 0.01;

  return {
    businessName,
    asOfDate,
    currentAssets,
    totalCurrentAssets,
    nonCurrentAssets,
    totalNonCurrentAssets,
    totalAssets,
    currentLiabilities,
    totalCurrentLiabilities,
    nonCurrentLiabilities,
    totalNonCurrentLiabilities,
    totalLiabilities,
    equityItems,
    netProfitForPeriod: netProfit,
    totalEquity,
    totalLiabilitiesAndEquity,
    isBalanced,
    difference,
  };
}

// Compute Key Financial Ratios with Educational Interpretations
export function computeFinancialRatios(
  incomeStatement: IncomeStatementData,
  balanceSheet: BalanceSheetData,
  accounts: AccountItem[]
): FinancialRatio[] {
  const { totalRevenues, grossProfit, operatingProfit, netProfit } = incomeStatement;
  const {
    totalCurrentAssets,
    totalCurrentLiabilities,
    totalAssets,
    totalLiabilities,
    totalEquity,
  } = balanceSheet;

  // Inventory value (สินค้าคงเหลือ)
  const inventoryAccount = accounts.find(
    (a) => a.category === 1 && a.name.includes("สินค้าคงเหลือ")
  );
  const inventoryAmount = inventoryAccount ? getAccountBalance(inventoryAccount) : 0;

  // 1. Current Ratio (อัตราส่วนเงินทุนหมุนเวียน/สภาพคล่อง)
  const currentRatio =
    totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : 0;

  // 2. Quick Ratio (อัตราส่วนสภาพคล่องหมุนเร็ว) = (สินทรัพย์หมุนเวียน - สินค้าคงเหลือ) / หนี้สินหมุนเวียน
  const quickAssets = Math.max(0, totalCurrentAssets - inventoryAmount);
  const quickRatio =
    totalCurrentLiabilities > 0 ? quickAssets / totalCurrentLiabilities : 0;

  // 3. Gross Profit Margin (%) = (กำไรขั้นต้น / รายได้รวม) * 100
  const grossMargin = totalRevenues > 0 ? (grossProfit / totalRevenues) * 100 : 0;

  // 4. Net Profit Margin (%) = (กำไรสุทธิ / รายได้รวม) * 100
  const netMargin = totalRevenues > 0 ? (netProfit / totalRevenues) * 100 : 0;

  // 5. Debt to Equity Ratio (D/E) = หนี้สินรวม / ส่วนของเจ้าของ
  const deRatio = totalEquity > 0 ? totalLiabilities / totalEquity : 0;

  // 6. Return on Assets (ROA) (%) = (กำไรสุทธิ / สินทรัพย์รวม) * 100
  const roa = totalAssets > 0 ? (netProfit / totalAssets) * 100 : 0;

  // 7. Return on Equity (ROE) (%) = (กำไรสุทธิ / ส่วนของเจ้าของ) * 100
  const roe = totalEquity > 0 ? (netProfit / totalEquity) * 100 : 0;

  return [
    {
      id: "current-ratio",
      nameTh: "อัตราส่วนสภาพคล่อง (Current Ratio)",
      nameEn: "Current Ratio",
      formula: "สินทรัพย์หมุนเวียน ÷ หนี้สินหมุนเวียน",
      value: currentRatio,
      unit: "เท่า (times)",
      benchmark: "≥ 1.5 - 2.0 เท่า",
      status: currentRatio >= 1.5 ? "good" : currentRatio >= 1.0 ? "neutral" : "warning",
      interpretation:
        currentRatio >= 1.5
          ? `กิจการมีสภาพคล่องดีมาก มีสินทรัพย์หมุนเวียน ${currentRatio.toFixed(2)} บาท สำหรับชำระหนี้สินหมุนเวียนทุกๆ 1 บาท`
          : currentRatio >= 1.0
          ? `สภาพคล่องอยู่ในระดับพอใช้ มีสินทรัพย์หมุนเวียน ${currentRatio.toFixed(2)} บาทต่อหนี้สิน 1 บาท ควรบริหารลูกหนี้และเงินสดให้ระมัดระวัง`
          : `สภาพคล่องมีความเสี่ยง (ต่ำกว่า 1 เท่า) อาจมีปัญหาชำระหนี้ระยะสั้นได้ทันเวลา`,
    },
    {
      id: "quick-ratio",
      nameTh: "อัตราส่วนสภาพคล่องหมุนเร็ว (Quick Ratio)",
      nameEn: "Quick Ratio",
      formula: "(สินทรัพย์หมุนเวียน - สินค้าคงเหลือ) ÷ หนี้สินหมุนเวียน",
      value: quickRatio,
      unit: "เท่า (times)",
      benchmark: "≥ 1.0 เท่า",
      status: quickRatio >= 1.0 ? "good" : quickRatio >= 0.8 ? "neutral" : "warning",
      interpretation:
        quickRatio >= 1.0
          ? `สภาพคล่องหมุนเร็วแข็งแกร่ง มีสินทรัพย์สภาพคล่องสูงพร้อมจ่ายหนี้ได้ทันทีโดยไม่ต้องรอขายสินค้า`
          : `หากเกิดวิกฤติ กิจการอาจต้องเร่งระบายสินค้าเพื่อนำเงินมาจ่ายหนี้หมุนเวียน`,
    },
    {
      id: "net-profit-margin",
      nameTh: "อัตรากำไรสุทธิ (Net Profit Margin)",
      nameEn: "Net Profit Margin",
      formula: "(กำไรสุทธิ ÷ รายได้รวม) × 100",
      value: netMargin,
      unit: "%",
      benchmark: "≥ 10 - 15%",
      status: netMargin >= 15 ? "good" : netMargin >= 5 ? "neutral" : "warning",
      interpretation:
        netMargin >= 10
          ? `ประสิทธิภาพการทำกำไรสูง ทุกๆ รายได้ 100 บาท เหลือกำไรสุทธิเข้ากิจการ ${netMargin.toFixed(2)} บาท`
          : netMargin > 0
          ? `มีกำไรสุทธิ ${netMargin.toFixed(2)}% ควรวิเคราะห์จุดควบคุมค่าใช้จ่ายในการดำเนินงานเพิ่มเติม`
          : `กิจการมีผลการดำเนินงานขาดทุนสุทธิ (${netMargin.toFixed(2)}%) ต้องเร่งเพิ่มยอดขายและลดต้นทุน`,
    },
    {
      id: "de-ratio",
      nameTh: "อัตราส่วนหนี้สินต่อทุน (D/E Ratio)",
      nameEn: "Debt to Equity Ratio",
      formula: "หนี้สินรวม ÷ ส่วนของเจ้าของ",
      value: deRatio,
      unit: "เท่า (times)",
      benchmark: "≤ 1.0 - 1.5 เท่า",
      status: deRatio <= 1.0 ? "good" : deRatio <= 2.0 ? "neutral" : "warning",
      interpretation:
        deRatio <= 1.0
          ? `โครงสร้างทางการเงินปลอดภัย หนี้สินเพียง ${deRatio.toFixed(2)} เท่าของทุน ความเสี่ยงทางการเงินต่ำ`
          : deRatio <= 2.0
          ? `มีภาระหนี้สินในระดับปานกลาง ${deRatio.toFixed(2)} เท่าของทุน ยังสามารถบริหารจัดการได้`
          : `ภาระหนี้สินสูง (${deRatio.toFixed(2)} เท่า) ความเสี่ยงทางการเงินสูง เจ้าหนี้มีสิทธิเรียกร้องเหนือกว่าเจ้าของ`,
    },
    {
      id: "roa",
      nameTh: "อัตราผลตอบแทนจากสินทรัพย์ (ROA)",
      nameEn: "Return on Assets",
      formula: "(กำไรสุทธิ ÷ สินทรัพย์รวม) × 100",
      value: roa,
      unit: "%",
      benchmark: "≥ 5 - 10%",
      status: roa >= 8 ? "good" : roa >= 3 ? "neutral" : "warning",
      interpretation: `สินทรัพย์ทุกๆ 100 บาท สามารถสร้างกำไรสุทธิได้ ${roa.toFixed(2)} บาท แสดงถึงประสิทธิภาพการใช้สินทรัพย์คอมพิวเตอร์และอุปกรณ์`,
    },
    {
      id: "roe",
      nameTh: "อัตราผลตอบแทนต่อส่วนของเจ้าของ (ROE)",
      nameEn: "Return on Equity",
      formula: "(กำไรสุทธิ ÷ ส่วนของเจ้าของ) × 100",
      value: roe,
      unit: "%",
      benchmark: "≥ 12 - 15%",
      status: roe >= 12 ? "good" : roe >= 5 ? "neutral" : "warning",
      interpretation: `ผลตอบแทนสำหรับเงินลงทุนของเจ้าของคือ ${roe.toFixed(2)}% ยิ่งสูงแสดงว่าเงินลงทุนของเจ้าของสร้างมูลค่าได้ดี`,
    },
  ];
}
