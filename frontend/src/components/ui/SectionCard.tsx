export default function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="section-card glass-card rounded-2xl p-4 md:p-6 h-full transition-all hover:bg-opacity-80 overflow-hidden">
      <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2">
        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {title}
        </h3>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

