export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return "0%"
  const percent = Math.round((value / total) * 100)
  return `${percent}%`
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString))
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return formatDate(dateString)
}

export function calculateETA(currentAmount: number, targetAmount: number, monthlyRate: number): string {
  if (monthlyRate <= 0) return "No progress"

  const remaining = targetAmount - currentAmount
  if (remaining <= 0) return "Goal reached!"

  const monthsRemaining = Math.ceil(remaining / monthlyRate)

  if (monthsRemaining === 1) return "1 month"
  if (monthsRemaining < 12) return `${monthsRemaining} months`

  const years = Math.floor(monthsRemaining / 12)
  const months = monthsRemaining % 12

  if (months === 0) return `${years} year${years > 1 ? "s" : ""}`
  return `${years}y ${months}m`
}
