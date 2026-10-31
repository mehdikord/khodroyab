/** Client-safe limits shared by the sale-ad form and its server actions. */

export const AD_IMAGE_MAX_COUNT = 10;

export const AD_OPTION_TEXT_MAX = 255;
export const AD_OPTION_NUMBER_MAX = 30;

/** Fold Persian/Arabic-Indic digits and the decimal separator to ASCII. */
export function foldNumber(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/٫/g, ".");
}
