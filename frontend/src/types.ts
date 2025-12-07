export enum FieldType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY'
}

export interface ArrayItemStructure {
  [key: string]: string; // e.g., { "name": "Item name", "qty": "Item quantity" }
}

export interface SchemaField {
  id: string;
  key: string;
  description: string;
  type: FieldType;
  required: boolean;
  items_structure?: ArrayItemStructure; // For array types
}

export interface ExtractionResult {
  [key: string]: string | number | boolean | string[] | null | object;
}

export interface ProcessingResponse {
  status: string,
  filename: string,
  extraction_schema_used: JSON,
  data: ExtractionResult | null;
  raw_text: string
}
