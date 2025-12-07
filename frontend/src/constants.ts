import { SchemaField, FieldType } from './types';

export const INITIAL_SCHEMA: SchemaField[] = [
  {
    id: crypto.randomUUID(),
    key: 'vendor_name',
    description: 'Name of the company/store issuing the invoice',
    type: FieldType.STRING,
    required: true
  },
  {
    id: crypto.randomUUID(),
    key: 'invoice_date',
    description: 'Transaction date in format YYYY-MM-DD',
    type: FieldType.STRING,
    required: true
  },
  {
    id: crypto.randomUUID(),
    key: 'items',
    description: 'List of purchased items',
    type: FieldType.ARRAY,
    required: true,
    items_structure: {
      name: 'Item name',
      qty: 'Item quantity (number)',
      price: 'Unit Price'
    }
  },
  {
    id: crypto.randomUUID(),
    key: 'po_number',
    description: 'Purchase Order number associated with the invoice if available',
    type: FieldType.STRING,
    required: false
  },
  {
    id: crypto.randomUUID(),
    key: 'total_amount',
    description: 'Final total amount to be paid as per the invoice (including taxes, fees)',
    type: FieldType.NUMBER,
    required: true
  }
];