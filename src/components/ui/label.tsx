"use client";
import * as React from "react";

export const Label = ({ htmlFor, children, className }: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <label htmlFor={htmlFor} className={className}>
    {children}
  </label>
);
