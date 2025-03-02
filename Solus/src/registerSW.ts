import { registerSW } from 'virtual:pwa-register'

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm('New content available. Reload?')) {
          updateSW(true)
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline')
      },
      onRegistered(registration: ServiceWorkerRegistration | undefined) {
        console.log('Service worker registered:', registration)
      },
      onRegisterError(error: Error) {
        console.error('Service worker registration error:', error)
      }
    })
  }
} 