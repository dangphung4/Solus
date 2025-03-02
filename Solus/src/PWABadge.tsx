import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

/**
 * A functional component that displays a badge for Progressive Web App (PWA) updates.
 * The badge informs users when the app is ready to work offline or when a new version is available.
 * It utilizes service workers to check for updates periodically.
 *
 * @returns {JSX.Element | null} Returns a JSX element representing the badge if there are updates or offline readiness,
 *                                otherwise returns null.
 *
 * @example
 * // Usage within a React component
 * function App() {
 *   return (
 *     <div>
 *       <PWABadge />
 *       {/* Other components */
function PWABadge() {
  // check for updates every hour
  const period = 60 * 60 * 1000

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return
      if (r?.active?.state === 'activated') {
        registerPeriodicSync(period, swUrl, r)
      }
      else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker
          if (sw.state === 'activated')
            registerPeriodicSync(period, swUrl, r)
        })
      }
    },
  })

  function close() {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-[420px]" role="alert">
      <Alert variant={needRefresh ? "destructive" : "default"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {needRefresh ? "Update Available" : "App Ready"}
        </AlertTitle>
        <AlertDescription>
          {needRefresh 
            ? "A new version is available. Click reload to update."
            : "App is ready to work offline."
          }
        </AlertDescription>
        <div className={cn(
          "mt-3 flex gap-3",
          needRefresh ? "justify-between" : "justify-end"
        )}>
          {needRefresh && (
            <Button 
              variant="destructive"
              size="sm"
              onClick={() => updateServiceWorker(true)}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reload
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={close}
          >
            Close
          </Button>
        </div>
      </Alert>
    </div>
  )
}

export default PWABadge

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine)
      return

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        'cache': 'no-store',
        'cache-control': 'no-cache',
      },
    })

    if (resp?.status === 200)
      await r.update()
  }, period)
}