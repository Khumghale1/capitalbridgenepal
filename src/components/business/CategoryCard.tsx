import { Link } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  href: string;
}

export function CategoryCard({
  name,
  icon: Icon,
  count,
  href,
}: CategoryCardProps) {
  return (
    <Link
      to={href}
      className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 transition-all duration-300 group-hover:bg-primary group-hover:shadow-glow">
        <Icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
      </div>
      <h3 className="mb-1 font-semibold text-foreground transition-colors group-hover:text-primary">
        {name}
      </h3>
      <p className="text-sm text-muted-foreground">{count} businesses</p>
    </Link>
  );
}
