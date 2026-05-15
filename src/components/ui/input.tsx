import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "bg-input border-input-border focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-danger/50 aria-invalid:border-danger-text file:text-foreground placeholder:text-input-placeholder h-9 w-full min-w-0 rounded-full border px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-2 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
