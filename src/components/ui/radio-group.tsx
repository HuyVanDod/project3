"use client";
import * as React from "react";

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const RadioGroup = ({ value, onValueChange, children }: RadioGroupProps) => {
  return (
    <div onChange={(e) => {
      const target = e.target as HTMLInputElement;
      if (target.type === "radio" && onValueChange) onValueChange(target.value);
    }}>
      {children}
    </div>
  );
};

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

export const RadioGroupItem = ({ id, ...props }: RadioGroupItemProps) => (
  <input id={id} type="radio" name="radio-group" {...props} />
);
