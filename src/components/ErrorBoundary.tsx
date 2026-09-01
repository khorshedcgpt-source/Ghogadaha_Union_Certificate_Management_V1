import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Application error boundary triggered:', error, errorInfo)
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-slate-800">
          <div className="max-w-lg rounded-2xl border border-red-200 bg-white p-8 shadow-lg">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              System Error
            </p>
            <h1 className="mb-4 text-3xl font-bold text-slate-900">অ্যাপ্লিকেশন লোড করতে সমস্যা হয়েছে</h1>
            <p className="mb-6 text-base text-slate-600">
              এই ব্রাউজারে কিছু ত্রুটি ঘটেছে। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন অথবা ডাটাবেসের
              অবস্থান পরীক্ষা করুন।
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
            >
              আবার লোড করুন
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
