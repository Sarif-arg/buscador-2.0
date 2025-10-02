
export type Operation = 'compra' | 'alquiler';

export interface SearchCriteria {
  operation: Operation | null;
  propertyType: string | null;
  location: string | null;
  bedrooms: string | null;
}

export interface StepOptionData {
  id: string;
  label: string;
  icon?: React.ReactNode;
}
