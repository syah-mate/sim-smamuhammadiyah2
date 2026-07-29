import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'time' | 'select' | 'textarea' | 'file';
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  disabled?: boolean;
  className?: string;
  accept?: string;
}

export function FormField({
  label, name, type = 'text', value, onChange, placeholder, required, options, rows = 3, disabled, className = '', accept,
}: FormFieldProps) {
  const inputId = `field-${name}`;
  const baseInputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500';

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'select' ? (
        <select id={inputId} name={name} value={value} onChange={onChange} disabled={disabled} className={baseInputClass}>
          <option value="">{placeholder || 'Pilih...'}</option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={inputId} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} disabled={disabled} className={baseInputClass} />
      ) : type === 'file' ? (
        <input
          id={inputId}
          name={name}
          type="file"
          onChange={onChange}
          accept={accept}
          disabled={disabled}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      ) : (
        <input id={inputId} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className={baseInputClass} />
      )}
    </div>
  );
}

interface FormActionsProps {
  onCancel: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function FormActions({ onCancel, submitLabel = 'Simpan', isSubmitting }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
      <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        Batal
      </button>
      <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
        {submitLabel}
      </button>
    </div>
  );
}
