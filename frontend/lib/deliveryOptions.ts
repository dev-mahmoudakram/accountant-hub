export interface DeliveryOption {
  value: string;
  label: string;
  days: number;
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  { value: '1 week',   label: '1 week',   days: 7 },
  { value: '2 weeks',  label: '2 weeks',  days: 14 },
  { value: '3 weeks',  label: '3 weeks',  days: 21 },
  { value: '1 month',  label: '1 month',  days: 30 },
  { value: '6 weeks',  label: '6 weeks',  days: 42 },
  { value: '2 months', label: '2 months', days: 60 },
  { value: '3 months', label: '3 months', days: 90 },
];

export function deliveryDays(value: string): number {
  return DELIVERY_OPTIONS.find((o) => o.value === value)?.days ?? 0;
}

/** Options at or below the given cap value. */
export function deliveryOptionsUpTo(cap: string): DeliveryOption[] {
  const capDays = deliveryDays(cap);
  if (capDays === 0) return DELIVERY_OPTIONS;
  return DELIVERY_OPTIONS.filter((o) => o.days <= capDays);
}
