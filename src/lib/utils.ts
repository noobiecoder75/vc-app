import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '$0';
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '0';
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toLocaleString();
}

export function getScoreColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'text-gray-500';
  if (score >= 8) return 'text-emerald-600';
  if (score >= 6) return 'text-yellow-600';
  return 'text-red-500';
}

export function getScoreBadgeVariant(score: number | null | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (score === null || score === undefined) return 'outline';
  if (score >= 8) return 'default';
  if (score >= 6) return 'secondary';
  return 'destructive';
}

export function getStageColor(stage: string | null): string {
  switch (stage?.toLowerCase()) {
    case 'pre-seed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'seed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'series a':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'series b':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'series c':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getMetricInsight(metricName: string, value: number, industry?: string): string {
  const name = metricName.toLowerCase();
  
  if (name.includes('revenue') || name.includes('mrr')) {
    if (value >= 100000) return "Strong revenue base - ready for Series A discussions";
    if (value >= 10000) return "Good traction - focus on growth acceleration";
    return "Early stage - prioritize product-market fit";
  }
  
  if (name.includes('cac') || name.includes('acquisition')) {
    if (value <= 100) return "Excellent CAC - highly efficient acquisition";
    if (value <= 500) return "Good CAC - sustainable growth model";
    return "High CAC - optimize acquisition channels";
  }
  
  if (name.includes('ltv') || name.includes('lifetime')) {
    if (value >= 1000) return "Strong LTV - indicates product stickiness";
    if (value >= 500) return "Decent LTV - room for improvement";
    return "Low LTV - focus on retention and expansion";
  }
  
  if (name.includes('churn')) {
    if (value <= 2) return "Excellent retention - best-in-class";
    if (value <= 5) return "Good retention - industry standard";
    return "High churn - urgent retention focus needed";
  }
  
  return "Track this metric against industry benchmarks";
}

export function getVCInsight(vcName: string, fitScore: number): string {
  if (fitScore >= 90) return `${vcName} is an excellent match - prioritize this relationship`;
  if (fitScore >= 80) return `${vcName} shows strong alignment - worth pursuing`;
  if (fitScore >= 70) return `${vcName} could be interested - prepare compelling pitch`;
  return `${vcName} may not be the best fit - consider other options`;
}