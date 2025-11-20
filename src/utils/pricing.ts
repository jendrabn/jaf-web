import type { ProductDetailTypes, ProductItemTypes } from "@/types/product";

export type ProductPricingSource = ProductItemTypes | ProductDetailTypes;

export interface ProductPricingInfo {
  currentPrice: number | null;
  originalPrice: number;
  isDiscounted: boolean;
  isFlashSale: boolean;
  isScheduledFlashSale: boolean;
  discountPercent: number | null;
  displayText?: string | null;
  strikeThroughPrice?: number | null;
}

export type FlashSaleStatusOverride = "running" | "scheduled";

const parseDate = (value?: string | null) =>
  value ? new Date(value).getTime() : null;

const isAfterNow = (value?: string | null) => {
  if (!value) return true;
  const time = parseDate(value);
  if (!time) return false;
  return time > Date.now();
};

export const getProductFinalPrice = (
  product: ProductPricingSource,
  flashSaleStatus?: FlashSaleStatusOverride,
) => {
  const price = product.price ?? 0;
  const priceAfterDiscount = product.price_after_discount ?? null;
  const flashPrice =
    typeof product.flash_sale_price === "number"
      ? product.flash_sale_price
      : typeof product.flash_price === "number"
      ? product.flash_price
      : null;
  const finalPriceField =
    typeof product.final_price === "number" ? product.final_price : null;

  const isFlashSaleRunning =
    flashSaleStatus === "running"
      ? true
      : flashSaleStatus === "scheduled"
      ? false
      : Boolean(
          product.is_in_flash_sale &&
            (flashPrice != null || finalPriceField != null) &&
            isAfterNow(product.flash_sale_end_at),
        );

  if (isFlashSaleRunning) {
    if (flashPrice != null) {
      return flashPrice;
    }
    if (finalPriceField != null) {
      return finalPriceField;
    }
  }

  if (
    product.is_discounted &&
    priceAfterDiscount != null &&
    priceAfterDiscount > 0
  ) {
    return priceAfterDiscount;
  }

  if (
    priceAfterDiscount != null &&
    priceAfterDiscount > 0 &&
    priceAfterDiscount < price
  ) {
    return priceAfterDiscount;
  }

  if (finalPriceField != null && finalPriceField > 0) {
    return finalPriceField;
  }

  return price;
};

export const getProductPricingInfo = (
  product: ProductPricingSource,
  flashSaleStatus?: FlashSaleStatusOverride,
): ProductPricingInfo => {
  const price = product.price ?? 0;
  const priceAfterDiscount = product.price_after_discount ?? null;
  const flashPrice =
    typeof product.flash_sale_price === "number"
      ? product.flash_sale_price
      : typeof product.flash_price === "number"
      ? product.flash_price
      : null;
  const finalPriceField =
    typeof product.final_price === "number" ? product.final_price : null;

  const isFlashSaleRunning =
    flashSaleStatus === "running"
      ? true
      : flashSaleStatus === "scheduled"
      ? false
      : Boolean(
          product.is_in_flash_sale &&
            (flashPrice != null || finalPriceField != null) &&
            isAfterNow(product.flash_sale_end_at),
        );

  if (isFlashSaleRunning && (flashPrice != null || finalPriceField != null)) {
    const current = flashPrice ?? finalPriceField ?? price;
    const discountPercent =
      price > 0 ? Math.max(Math.round(((price - current) / price) * 100), 0) : null;
    return {
      currentPrice: current,
      originalPrice: price,
      isDiscounted: true,
      isFlashSale: true,
      isScheduledFlashSale: false,
      discountPercent,
      strikeThroughPrice: price,
    };
  }

  if (flashSaleStatus === "scheduled") {
    const maskedDisplay =
      product.is_flash_price_masked && product.flash_price_display
        ? `Rp${product.flash_price_display}`
        : null;
    const scheduledPrice =
      flashPrice ??
      finalPriceField ??
      priceAfterDiscount ??
      product.price ??
      0;
    const discountPercent =
      price > 0 && flashPrice
        ? Math.max(Math.round(((price - flashPrice) / price) * 100), 0)
        : null;
    return {
      currentPrice: maskedDisplay ? null : scheduledPrice,
      originalPrice: price,
      isDiscounted: Boolean(maskedDisplay || scheduledPrice < price),
      isFlashSale: false,
      isScheduledFlashSale: true,
      discountPercent,
      displayText: maskedDisplay,
      strikeThroughPrice: null,
    };
  }

  if (
    product.is_discounted &&
    priceAfterDiscount != null &&
    priceAfterDiscount > 0
  ) {
    const discountPercent =
      price > 0
        ? Math.max(Math.round(((price - priceAfterDiscount) / price) * 100), 0)
        : null;
    return {
      currentPrice: priceAfterDiscount,
      originalPrice: price,
      isDiscounted: true,
      isFlashSale: false,
      isScheduledFlashSale: false,
      discountPercent,
      strikeThroughPrice: price,
    };
  }

  if (
    priceAfterDiscount != null &&
    priceAfterDiscount > 0 &&
    priceAfterDiscount < price
  ) {
    const discountPercent =
      price > 0
        ? Math.max(Math.round(((price - priceAfterDiscount) / price) * 100), 0)
        : null;
    return {
      currentPrice: priceAfterDiscount,
      originalPrice: price,
      isDiscounted: true,
      isFlashSale: false,
      isScheduledFlashSale: false,
      discountPercent,
      strikeThroughPrice: price,
    };
  }

  if (finalPriceField != null && finalPriceField > 0 && finalPriceField < price) {
    const discountPercent =
      price > 0
        ? Math.max(Math.round(((price - finalPriceField) / price) * 100), 0)
        : null;
    return {
      currentPrice: finalPriceField,
      originalPrice: price,
      isDiscounted: true,
      isFlashSale: false,
      isScheduledFlashSale: false,
      discountPercent,
      strikeThroughPrice: price,
    };
  }

  return {
    currentPrice: price,
    originalPrice: price,
    isDiscounted: false,
    isFlashSale: false,
    isScheduledFlashSale: false,
    discountPercent: null,
    strikeThroughPrice: null,
  };
};
