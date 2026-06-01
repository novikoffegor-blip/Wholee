import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const controlClass =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground transition-colors placeholder:text-muted focus:border-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

interface FieldShellProps {
  label: string;
  error?: string;
  children: ReactNode;
}

function FieldShell({ label, error, children }: FieldShellProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-2 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, className, ...props }: TextFieldProps) {
  return (
    <FieldShell label={label} error={error}>
      <input className={cn(controlClass, className)} {...props} />
    </FieldShell>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  placeholder?: string;
}

export function SelectField({ label, error, placeholder, children, className, ...props }: SelectFieldProps) {
  return (
    <FieldShell label={label} error={error}>
      <select className={cn(controlClass, className)} {...props}>
        {placeholder ? <option value="">{placeholder}</option> : null}
        {children}
      </select>
    </FieldShell>
  );
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextareaField({ label, error, className, ...props }: TextareaFieldProps) {
  return (
    <FieldShell label={label} error={error}>
      <textarea className={cn(controlClass, "min-h-28 py-3", className)} {...props} />
    </FieldShell>
  );
}
