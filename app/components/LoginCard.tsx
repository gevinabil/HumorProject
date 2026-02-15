'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase'

export default function LoginCard() {
  const supabase = createSupabaseBrowser()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function signInWithOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) setMsg(error.message)
    else setMsg('Check your email for the magic link.')

    setLoading(false)
  }

  async function signInWithGoogle() {
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) setMsg(error.message)
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Sign in to access Week 1 & Week 2.
      </p>

      <button
        onClick={signInWithGoogle}
        disabled={loading}
        className="mt-6 w-full rounded-xl border px-4 py-3 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
      >
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs text-zinc-500">or</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <form onSubmit={signInWithOtp} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@columbia.edu"
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          required
        />
        <button
          disabled={loading}
          className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          Email me a magic link
        </button>
      </form>

      {msg && <p className="mt-4 text-sm text-zinc-700">{msg}</p>}
    </div>
  )
}
