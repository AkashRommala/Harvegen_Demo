import { Info, AlertTriangle, Lightbulb, Link as LinkIcon } from 'lucide-react'

const STYLES = {
  info: {
    container: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100',
    icon: <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />,
  },
  warning: {
    container: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-100',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />,
  },
  note: {
    container: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50 text-blue-900 dark:text-blue-100',
    icon: <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />,
  },
  resource: {
    container: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/50 text-purple-900 dark:text-purple-100',
    icon: <LinkIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />,
  }
}

export default function CalloutCard({ type = 'info', title, children }) {
  const style = STYLES[type] || STYLES.info
  
  return (
    <div className={`my-6 rounded-xl border p-4 md:p-5 flex gap-3.5 shadow-sm ${style.container}`}>
      <div className="flex-shrink-0">{style.icon}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1 text-inherit opacity-95 tracking-wide text-sm uppercase">{title}</h4>}
        <div className="text-inherit opacity-80 leading-relaxed text-[15px] [&>p]:m-0">
          {children}
        </div>
      </div>
    </div>
  )
}
