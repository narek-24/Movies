export default function Field({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-muted-foreground mb-0.5 block text-sm font-medium"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
