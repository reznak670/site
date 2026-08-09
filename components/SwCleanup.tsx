'use client'

import { useEffect } from 'react'

// Сайт никогда не регистрировал service worker, но у части посетителей он
// остался от старой версии проекта и продолжает падать в консоли (например,
// на попытке закешировать 206-ответ от медиа с Range-запросами). Снимаем
// регистрацию и чистим его кеши, чтобы избавить их от этого мусора.
export default function SwCleanup() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister())
    })

    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key))
      })
    }
  }, [])

  return null
}
