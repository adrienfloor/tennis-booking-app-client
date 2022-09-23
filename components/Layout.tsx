import React, { ReactNode, ReactElement, useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/Home.module.css'
import MobileMenu from './mobile-menu'
import { AuthContext } from '../contexts/AuthContext'
import Router, { useRouter } from 'next/router'

const Layout = ({ children }: { children: ReactNode }): ReactElement => {

  const {
    setUser,
    user,
    loadUser,
    isAutenticated,
    setIsAuthenticated
  } = useContext(AuthContext)

  const router = useRouter()
  
  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Tennis René Magnac</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.header}>
        <div className='desktop-only'>
          <Link href='/'>
            <span className={styles.titleHeader}>
              TENNIS RENÉ MAGNAC 🎾
            </span>
          </Link>
          {
            isAutenticated &&
            <div className={styles.headerRight}>
              <Link href='/'>
                <span
                  className={
                    router.pathname === '/' ?
                    styles.headerLinkActive :
                    styles.headerLink
                  }
                >
                  Réservation
                </span>
              </Link>
              {
                user.isAdmin &&
                <Link href='/admin'>
                <span
                  className={
                    router.pathname === '/admin' ?
                    styles.headerLinkActive :
                    styles.headerLink
                  }
                >
                    Admin
                  </span>
                </Link>
              }
              <Link href='/profile'>
              <span
                  className={
                    router.pathname === '/profile' ?
                    styles.headerLinkActive :
                    styles.headerLink
                  }
                >
                  Mon compte
                </span>
              </Link>
              <button
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </div>
          }
        </div>
        <div className='mobile-only tablet-only' style={{ display: 'flex' }} >
          <MobileMenu isAdmin={user.isAdmin} onLogout={() => handleLogout()} />
          <Link href='/'>
            <span className={styles.titleHeader}>
              TENNIS RENÉ MAGNAC 🎾
            </span>
          </Link>
        </div>
      </div>
      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.youtube.com/channel/UCfpEAGLvogQWWYV2m_wmGJQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          créé par{''}
          <span className={styles.logo}>
            Adrien Floor
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Layout