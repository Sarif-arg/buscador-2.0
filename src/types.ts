export type Operation = 'compra' | 'alquiler';

export interface SearchCriteria {
  operation: Operation | null;
  propertyType: string | null;
  location: string | null;
  bedrooms: string | null;
  isMortgageCredit: boolean | null;
}

export interface StepOptionData {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface Loteo {
  id: string;
  name: string;
  imageUrl: string;
  url: string;
}
