export function formatPrice(
  price: number | string,
  options: { currency?: "EGP"; notation?: Intl.NumberFormatOptions["notation"] } = {}
) {
  const { currency = "EGP", notation = "compact" } = options;
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}
