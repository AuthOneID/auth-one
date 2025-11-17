export function AppCard({ name, icon, url }: { name: string; icon?: string; url?: string }) {
  return (
    <a href={url || '#'} className="group cursor-pointer">
      <div className="bg-card border border-border rounded-lg p-8 h-full transition-all duration-300 hover:border-primary hover:shadow-lg hover:-translate-y-1">
        {/* Icon Container */}
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors overflow-hidden">
          {icon ? (
            <img src={icon} alt={`${name} icon`} className="w-12 h-12 object-contain" />
          ) : (
            <span className="text-3xl">�</span>
          )}
        </div>

        {/* App Name */}
        <h3 className="text-xl font-semibold text-card-foreground mb-2">{name}</h3>

        {/* Description Placeholder */}
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 hidden">
          Access all features and tools in one place
        </p>

        {/* CTA Link */}
        <div className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 gap-1 transition-all">
          Open App
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  )
}
