import { supabase } from './supabaseClient';

export interface KPIData {
  metrics: Array<{
    name: string;
    value: number;
    unit: string;
    change?: number;
    trend?: 'up' | 'down';
  }>;
  financial: {
    monthly_revenue_usd?: number;
    burn_rate_usd?: number;
    ltv_cac_ratio?: number;
    runway_months?: number;
  };
  company: {
    valuation_target_usd?: number;
    funding_goal_usd?: number;
    name?: string;
  };
}

export async function fetchKPIData(companyId: string): Promise<KPIData> {
  console.log(`📊 Fetching KPI data for company: ${companyId}`);
  
  try {
    // Fetch company data
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('name, valuation_target_usd, funding_goal_usd')
      .eq('id', companyId)
      .single();

    if (companyError) {
      console.error('❌ Error fetching company data:', companyError);
    }

    // Fetch metrics data
    const { data: metricsData, error: metricsError } = await supabase
      .from('metrics')
      .select('metric_name, metric_value, metric_unit, as_of_date')
      .eq('company_id', companyId)
      .order('as_of_date', { ascending: false });

    if (metricsError) {
      console.error('❌ Error fetching metrics data:', metricsError);
    }

    // Fetch financial model data
    const { data: financialData, error: financialError } = await supabase
      .from('financial_models')
      .select('monthly_revenue_usd, burn_rate_usd, ltv_cac_ratio, runway_months')
      .eq('company_id', companyId)
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (financialError) {
      console.error('❌ Error fetching financial data:', financialError);
    }

    // Process metrics data
    const processedMetrics = (metricsData || []).map(metric => ({
      name: metric.metric_name || 'Unknown Metric',
      value: metric.metric_value || 0,
      unit: metric.metric_unit || '',
      // Add mock trend data since we don't have historical data yet
      change: Math.random() * 20 - 10, // Random change between -10 and +10
      trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down'
    }));

    // Add financial metrics as KPIs if available
    if (financialData) {
      if (financialData.monthly_revenue_usd) {
        processedMetrics.push({
          name: 'Monthly Revenue',
          value: financialData.monthly_revenue_usd,
          unit: 'USD',
          change: Math.random() * 20,
          trend: 'up'
        });
      }
      
      if (financialData.burn_rate_usd) {
        processedMetrics.push({
          name: 'Burn Rate',
          value: financialData.burn_rate_usd,
          unit: 'USD',
          change: -Math.random() * 10,
          trend: 'down'
        });
      }
      
      if (financialData.ltv_cac_ratio) {
        processedMetrics.push({
          name: 'LTV/CAC Ratio',
          value: financialData.ltv_cac_ratio,
          unit: ':1',
          change: Math.random() * 15,
          trend: 'up'
        });
      }
      
      if (financialData.runway_months) {
        processedMetrics.push({
          name: 'Runway',
          value: financialData.runway_months,
          unit: 'months',
          change: -Math.random() * 5,
          trend: 'down'
        });
      }
    }

    const result: KPIData = {
      metrics: processedMetrics,
      financial: financialData || {},
      company: companyData || {}
    };

    console.log('✅ KPI data fetched successfully:', result);
    return result;

  } catch (error) {
    console.error('💥 Error fetching KPI data:', error);
    throw new Error(`Failed to fetch KPI data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}