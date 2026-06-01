import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  children: string;
}

export function StatusBadge({ children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 text-xs font-medium",
        children === "Новый" && "border-foreground bg-foreground text-background",
        children === "Активен" && "border-foreground text-foreground",
        children === "Скрыт" && "border-border bg-surface text-muted",
        children === "В обработке" && "border-neutral-400 text-foreground",
        children === "Отправлен" && "border-border bg-surface text-foreground",
        children === "Выполнен" && "border-border text-muted",
        children === "Отменён" && "border-border bg-surface text-muted"
      )}
    >
      {children}
    </span>
  );
}
