import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, before: number = 6, after: number = 4) {
  return address.slice(0, before) + "..." + address.slice(-after)
}

export function truncateLongText(text: string, maxLength: number = 12) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

export function roundLongDecimalInBalance(balance: string, maxLength: number = 6) {
  const balanceString = balance.toString();
  const decimalIndex = balanceString.indexOf('.');
  if (decimalIndex === -1) {
    return balanceString;
  }
  const decimalPart = balanceString.slice(decimalIndex + 1);
  if (decimalPart.length <= maxLength) {
    return balanceString;
  }
  const roundedDecimalPart = decimalPart.slice(0, maxLength);
  return balanceString.slice(0, decimalIndex) + "." + roundedDecimalPart;
}

