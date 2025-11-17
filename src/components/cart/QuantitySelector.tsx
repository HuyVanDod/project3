"use client";

import { Button } from "@/components/ui/Button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) => {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={value <= min}
        className="w-8 h-8"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <span className="w-8 text-center font-medium">{value}</span>

      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={value >= max}
        className="w-8 h-8"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
