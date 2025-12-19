import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, id, ...props }, ref) => {
    const [checked, setChecked] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = ref || inputRef;

    const handleToggle = () => {
      const newChecked = !checked;
      setChecked(newChecked);
      onCheckedChange?.(newChecked);
    };

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={handleToggle}
        className={cn(
          "h-4 w-4 shrink-0 rounded border border-border flex items-center justify-center",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors cursor-pointer",
          checked && "bg-accent-primary border-accent-primary",
          className
        )}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {checked && (
          <Check className="h-3 w-3" style={{ color: 'var(--accent-primary-foreground)' }} />
        )}
        <input
          type="checkbox"
          ref={combinedRef as React.RefObject<HTMLInputElement>}
          id={id}
          checked={checked}
          onChange={() => {}}
          className="sr-only"
          tabIndex={-1}
        />
      </button>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
