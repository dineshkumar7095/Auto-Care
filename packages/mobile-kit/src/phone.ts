/** "98000 00001" / "+91 98000 00001" → "+919800000001". */
export const normaliseIndianPhone = (input: string) => {
  const digits = input.replace(/\D/g, "");
  const ten = digits.length > 10 ? digits.slice(-10) : digits;
  return `+91${ten}`;
};
