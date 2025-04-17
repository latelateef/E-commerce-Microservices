import { cn } from "@/lib/utils";

export const Card = ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <div
        className={cn(
          "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 group-hover:scale-105 transition-transform duration-300 ease-in-out text-center",
          className
        )}
      >
        <div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  };

  export const CardTitle = ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4 text-xl", className)}>
        {children}
      </h4>
    );
  };
  
  export const CardPrice = ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
      >
        Price: {children}
      </p>
    );
  };
    
      export const CardDescription = ({
        className,
        children,
      }: {
        className?: string;
        children: React.ReactNode;
      }) => {
        const stock = children;
        const isAvailable = Number(stock) > 0;
        const stockText = isAvailable ? "In Stock" : "Out of Stock";
        const stockClass = isAvailable ? "text-green-500" : "text-red-500";
        return (
          <p
            className={cn(
              "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
              className, stockClass
            )}
          >
             {stockText}
          </p>
        );
      };