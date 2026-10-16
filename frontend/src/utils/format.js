export const categories = ["Income", "Food", "Transport", "Shopping", "Utilities", "Rent", "Health", "Education", "Other"];
export const expenseCategories = categories.filter(category => category !== "Income");
export const money = paisa => `৳${(paisa / 100).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const currentMonth = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`; };
export function toPaisa(value) {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) throw new Error("Enter a positive BDT amount with up to two decimals.");
  const [whole, fraction = ""] = value.split(".");
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(result) || result <= 0) throw new Error("Enter a valid positive amount.");
  return result;
}
