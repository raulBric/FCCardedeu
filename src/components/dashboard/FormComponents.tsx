"use client";

import { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ButtonHTMLAttributes } from "react";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

// Input Field
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function InputField({ label, error, className = "", ...props }: InputFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
          ${error ? "border-red-500" : ""} 
          ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Textarea Field
interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextareaField({ label, error, className = "", ...props }: TextareaFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
          ${error ? "border-red-500" : ""} 
          ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Select Field
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function SelectField({ label, error, options, className = "", ...props }: SelectFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
          ${error ? "border-red-500" : ""} 
          ${className}`}
        {...props}
      >
        <option value="">Selecciona una opció</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Checkbox Field
interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function CheckboxField({ label, className = "", ...props }: CheckboxFieldProps) {
  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        className={`h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded ${className}`}
        {...props}
      />
      <label className="ml-2 block text-sm text-gray-700">{label}</label>
    </div>
  );
}

// Button Component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({ 
  children, 
  variant = "primary",
  size = "md", 
  isLoading = false, 
  iconLeft, 
  iconRight,
  fullWidth = false,
  className = "", 
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center border font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  
  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const variantStyles = {
    primary: "bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 border-transparent focus:ring-gray-500",
    danger: "bg-red-500 hover:bg-red-600 text-white border-transparent focus:ring-red-500",
    success: "bg-green-500 hover:bg-green-600 text-white border-transparent focus:ring-green-500",
    outline: "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 focus:ring-red-500"
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={`
        ${baseStyle} 
        ${sizeStyles[size]}
        ${variantStyles[variant]} 
        ${isLoading || disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
      {!isLoading && iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {!isLoading && iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
}

// Card Components
interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-medium text-gray-900 ${className}`}>{children}</h3>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={`p-6 ${className}`}>{children}</div>
  );
}

// DataTable Component
interface DataTableProps<T = any> {
  columns: {
    key: string;
    header: string;
    render?: (value: any, item: T) => ReactNode;
  }[];
  data: T[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({ 
  columns, 
  data, 
  onRowClick, 
  isLoading = false,
  emptyMessage = "No hi ha dades disponibles" 
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className={onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column) => (
                  <td key={`${index}-${column.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {column.render
                      ? column.render(item[column.key as keyof typeof item] as unknown, item)
                      : (item[column.key as keyof typeof item] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// FormField Component (para formularios avanzados con iconos)
interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  required?: boolean;
}

export function FormField({ 
  label, 
  error, 
  startIcon, 
  endIcon,
  required,
  className = "", 
  ...props 
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}
        <input
          className={`w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
            ${startIcon ? 'pl-10' : 'px-3'} 
            ${endIcon ? 'pr-10' : 'pr-3'} 
            py-2
            ${error ? "border-red-500" : "border-gray-300"} 
            ${className}`}
          {...props}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// File Upload Component
interface FileUploadProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  preview?: string;
  onClear?: () => void;
}

export function FileUpload({ 
  label, 
  error, 
  preview, 
  onClear,
  ...props 
}: FileUploadProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {preview ? (
            <div className="relative">
              <Image
                src={preview}
                alt="Preview"
                width={200}
                height={128}
                className="mx-auto h-32 object-contain mb-2"
              />
              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 shadow-sm"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={props.id}
              className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
            >
              <span>Puja un fitxer</span>
              <input
                id={props.id}
                type="file"
                className="sr-only"
                {...props}
              />
            </label>
            <p className="pl-1">o arrossega i deixa anar</p>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF fins a 10MB
          </p>
        </div>
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
