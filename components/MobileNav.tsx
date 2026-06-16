'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { Fragment, useState, useEffect, useRef } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  const navRef = useRef(null)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current)
      } else {
        disableBodyScroll(navRef.current)
      }
      return !status
    })
  }

  useEffect(() => {
    return clearAllBodyScrollLocks
  })

  return (
    <>
      <button
        aria-label="打开导航菜单"
        aria-expanded={navShow}
        onClick={onToggleNav}
        className="rounded-full border border-white/10 bg-slate-950/35 p-2 text-white shadow-lg shadow-slate-950/20 backdrop-blur-xl transition hover:border-cyan-300/30 hover:text-cyan-200 sm:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <Transition appear show={navShow} as={Fragment} unmount={false}>
        <Dialog as="div" onClose={onToggleNav} unmount={false}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            unmount={false}
          >
            <div className="fixed inset-0 z-60 bg-slate-950/55 backdrop-blur-sm" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
            unmount={false}
          >
            <DialogPanel className="fixed top-0 right-0 z-70 h-full w-full max-w-sm border-l border-white/12 bg-slate-950/88 shadow-2xl shadow-slate-950/50 backdrop-blur-2xl duration-300">
              <nav
                ref={navRef}
                className="flex h-full basis-0 flex-col items-start overflow-y-auto px-6 pt-20 pb-8 text-left"
              >
                <p className="font-heading mb-6 text-[10px] font-bold tracking-[0.28em] text-cyan-300 uppercase">
                  Kieran Space
                </p>
                {headerNavLinks.map((link) => (
                  <div key={link.title} className="mb-3 w-full">
                    <Link
                      href={link.href}
                      className="flex min-h-[46px] items-center rounded-2xl px-3 text-xl font-light tracking-[0.18em] text-white outline outline-0 transition hover:bg-white/10 hover:text-cyan-100 sm:text-2xl"
                      onClick={onToggleNav}
                    >
                      {link.title}
                    </Link>
                    {link.children && (
                      <div className="mt-1 space-y-1 border-l border-white/12 pl-4">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex min-h-[42px] items-center rounded-xl px-3 text-sm font-bold tracking-[0.14em] text-slate-300 transition hover:bg-white/10 hover:text-cyan-100"
                            onClick={onToggleNav}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <button
                className="fixed top-4 right-4 z-80 flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white/80 backdrop-blur-xl transition hover:bg-white/15 hover:text-cyan-100"
                aria-label="关闭导航菜单"
                onClick={onToggleNav}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileNav
