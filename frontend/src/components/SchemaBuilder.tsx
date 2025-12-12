import React, { useState } from 'react';
import { SchemaField, FieldType, ArrayItemStructure } from '../types';
import { Trash2, Plus, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';

interface SchemaBuilderProps {
  fields: SchemaField[];
  setFields: React.Dispatch<React.SetStateAction<SchemaField[]>>;
}

const SchemaBuilder: React.FC<SchemaBuilderProps> = ({ fields, setFields }) => {
  const [expandedArrays, setExpandedArrays] = useState<Set<string>>(new Set());

  const handleAddField = () => {
    const newField: SchemaField = {
      id: crypto.randomUUID(),
      key: '',
      description: '',
      type: FieldType.STRING,
      required: false,
    };
    setFields([...fields, newField]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleUpdateField = (id: string, updates: Partial<SchemaField>) => {
    setFields(
      fields.map((f) => {
        if (f.id === id) {
          const updated = { ...f, ...updates };
          if (updates.type === FieldType.ARRAY && !updated.items_structure) {
            updated.items_structure = {};
          }
          if (updates.type && updates.type !== FieldType.ARRAY) {
            delete updated.items_structure;
          }
          return updated;
        }
        return f;
      }),
    );
  };

  const handleAddArrayField = (fieldId: string) => {
    setFields(
      fields.map((f) => {
        if (f.id === fieldId && f.type === FieldType.ARRAY) {
          const newStructure = { ...f.items_structure };
          // Generate unique default name to avoid collision
          const count = Object.keys(newStructure).length + 1;
          let newKey = `field_${count}`;
          while (newStructure[newKey]) {
            newKey = `field_${Math.floor(Math.random() * 1000)}`;
          }
          newStructure[newKey] = 'Description';
          return { ...f, items_structure: newStructure };
        }
        return f;
      }),
    );
  };

  const handleRemoveArrayField = (fieldId: string, arrayKey: string) => {
    setFields(
      fields.map((f) => {
        if (f.id === fieldId && f.items_structure) {
          const newStructure = { ...f.items_structure };
          delete newStructure[arrayKey];
          return { ...f, items_structure: newStructure };
        }
        return f;
      }),
    );
  };

  const handleUpdateArrayField = (
    fieldId: string,
    oldKey: string,
    newKey: string,
    description: string,
  ) => {
    setFields(
      fields.map((f) => {
        if (f.id === fieldId && f.items_structure) {
          const newStructure: ArrayItemStructure = {};
          // Kita loop untuk mempertahankan urutan, tapi mengganti key yang sedang diedit
          Object.entries(f.items_structure).forEach(([k, v]) => {
            if (k === oldKey) {
              newStructure[newKey] = description; // Key berubah disini
            } else {
              newStructure[k] = v as string;
            }
          });
          return { ...f, items_structure: newStructure };
        }
        return f;
      }),
    );
  };

  const toggleArrayExpanded = (fieldId: string) => {
    setExpandedArrays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) newSet.delete(fieldId);
      else newSet.add(fieldId);
      return newSet;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-slate-800">Extraction Schema</h2>
          <p className="text-sm text-slate-500">Define the data structure you want to extract.</p>
        </div>
        <button
          onClick={handleAddField}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Field
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {fields.length === 0 ? (
          <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-lg">
            <p className="text-slate-400 mb-2">No fields defined yet.</p>
            <button
              onClick={handleAddField}
              className="text-blue-500 hover:underline text-sm font-medium"
            >
              Add your first field
            </button>
          </div>
        ) : (
          fields.map((field) => (
            <div
              key={field.id}
              className="group relative bg-white border border-slate-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <div className="flex gap-3 items-start">
                <div className="mt-3 text-slate-300 cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Key Name
                      </label>
                      <input
                        type="text"
                        value={field.key}
                        onChange={(e) => handleUpdateField(field.id, { key: e.target.value })}
                        placeholder="e.g. invoice_date"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div className="w-1/3">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Data Type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) =>
                          handleUpdateField(field.id, { type: e.target.value as FieldType })
                        }
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                      >
                        {Object.values(FieldType).map((t) => (
                          <option key={t} value={t}>
                            {t.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Description (for AI context)
                    </label>
                    <input
                      type="text"
                      value={field.description}
                      onChange={(e) => handleUpdateField(field.id, { description: e.target.value })}
                      placeholder="e.g. The date the invoice was issued"
                      className="w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-600 placeholder:text-slate-300"
                    />
                  </div>

                  {/* Array Structure Configuration - PERBAIKAN DI SINI */}
                  {field.type === FieldType.ARRAY && (
                    <div className="mt-3 border border-blue-100 bg-blue-50/30 rounded-lg p-3">
                      <button
                        onClick={() => toggleArrayExpanded(field.id)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-blue-700 mb-2"
                      >
                        <span className="flex items-center gap-1.5">
                          {expandedArrays.has(field.id) ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                          Array Item Structure ({Object.keys(field.items_structure || {}).length}{' '}
                          fields)
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddArrayField(field.id);
                          }}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Add array field"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </button>

                      {expandedArrays.has(field.id) && (
                        <div className="space-y-2 mt-2">
                          {field.items_structure &&
                            Object.entries(field.items_structure).map(
                              ([arrayKey, arrayDesc], index) => (
                                // PERUBAHAN PENTING: key={index}
                                // Menggunakan index menjaga elemen tetap hidup saat namanya (arrayKey) berubah
                                <div
                                  key={index}
                                  className="flex gap-2 items-center bg-white p-2 rounded border border-blue-100"
                                >
                                  <input
                                    type="text"
                                    value={arrayKey}
                                    // Pass 'arrayKey' as 'oldKey'
                                    onChange={(e) =>
                                      handleUpdateArrayField(
                                        field.id,
                                        arrayKey,
                                        e.target.value,
                                        arrayDesc as string,
                                      )
                                    }
                                    placeholder="Field name"
                                    className="flex-1 text-xs px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                                  />
                                  <input
                                    type="text"
                                    value={String(arrayDesc)}
                                    // Pass 'arrayKey' as both 'oldKey' and 'newKey' (because only desc changed)
                                    onChange={(e) =>
                                      handleUpdateArrayField(
                                        field.id,
                                        arrayKey,
                                        arrayKey,
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Description"
                                    className="flex-1 text-xs px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                                  />
                                  <button
                                    onClick={() => handleRemoveArrayField(field.id, arrayKey)}
                                    className="text-slate-400 hover:text-red-500 p-1"
                                    title="Remove field"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ),
                            )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={field.required}
                          onChange={(e) =>
                            handleUpdateField(field.id, { required: e.target.checked })
                          }
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                      </div>
                      <span
                        className={`text-xs font-medium ${field.required ? 'text-slate-700' : 'text-slate-400'}`}
                      >
                        Required
                      </span>
                    </label>

                    <button
                      onClick={() => handleRemoveField(field.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                      title="Remove field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SchemaBuilder;
