import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  // fallback if randomUUID is not available
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateId(length: number = 8): string {
  const chars = "0123456789abcdef";
  let id = "";
  const randomValues = new Uint8Array(length);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    // fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256);
    }
  }

  for (let i = 0; i < length; i++) {
    id += chars[randomValues[i] % chars.length];
  }

  return id;
}

export function formatDate(
  isoString: string,
  format:
    | "DDMMYYYY"
    | "DD-MM-YYYY"
    | "MM/DD/YYYY"
    | "YYYY-MM-DD"
    | "YYYYMMDD"
    | "DD/MM/YYYY HH:mm:ss"
    | "YYYY-MM-DD HH:mm"
    | "HH:mm:ss"
    | "HH:mm"
    | "MMMM DD, YYYY"
) {
  try {
    const date = new Date(isoString);

    if (!date) {
      throw new Error("Invalid ISO string provided.");
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    switch (format) {
      case "DDMMYYYY":
        return `${day}${month}${year}`;
      case "DD-MM-YYYY":
        return `${day}-${month}-${year}`;
      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`;
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "YYYYMMDD":
        return `${year}${month}${day}`;
      case "DD/MM/YYYY HH:mm:ss":
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      case "YYYY-MM-DD HH:mm":
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      case "HH:mm:ss":
        return `${hours}:${minutes}:${seconds}`;
      case "HH:mm":
        return `${hours}:${minutes}`;
      case "MMMM DD, YYYY": // Example: January 01, 2024
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return `${monthNames[date.getMonth()]} ${day}, ${year}`;
      // Add more cases as needed
      default:
        return "Invalid format specified.";
    }
  } catch (error: any) {
    return error.message; // Return the error message
  }
}
