import { supabase } from './supabaseClient';
import { StartupAnalysis } from './openaiClient';

export interface DatabaseInsertResult {
  companyId?: string;
  errors: string[];
  success: boolean;
  insertedTables: string[];
}

export async function insertStartupData(
  analysis: StartupAnalysis,
  userId?: string
): Promise<DatabaseInsertResult> {
  const result: DatabaseInsertResult = {
    errors: [],
    success: false,
    insertedTables: []
  };

  try {
    console.log('💾 Starting database insertion for analysis:', analysis);

    // Validate that we have some data to insert
    if (!analysis || Object.keys(analysis).length === 0) {
      result.errors.push('No analysis data provided');
      console.warn('⚠️ No analysis data to insert');
      return result;
    }

    // Start with company data if available
    let companyId: string | undefined;
    
    if (analysis.company && Object.keys(analysis.company).length > 0) {
      try {
        // Ensure required fields have defaults
        const companyData = {
          name: analysis.company.name || 'Unnamed Startup',
          industry_name: analysis.company.industry_name || null,
          sub_industry_name: analysis.company.sub_industry_name || null,
          country: analysis.company.country || null,
          geo_region: analysis.company.geo_region || null,
          startup_stage: analysis.company.startup_stage || null,
          valuation_target_usd: analysis.company.valuation_target_usd || null,
          funding_goal_usd: analysis.company.funding_goal_usd || null,
          incorporation_year: analysis.company.incorporation_year || null,
          pitch_deck_summary: analysis.company.pitch_deck_summary || null,
          user_id: userId || null, // Now nullable
          created_at: new Date().toISOString()
        };

        console.log('💾 Inserting company data:', companyData);
        
        const { data: companyResult, error: companyError } = await supabase
          .from('companies')
          .insert([companyData])
          .select('id')
          .single();

        if (companyError) {
          result.errors.push(`Company insert failed: ${companyError.message}`);
          console.error('❌ Company insert error:', companyError);
        } else {
          companyId = companyResult.id;
          result.insertedTables.push('companies');
          console.log('✅ Company inserted with ID:', companyId);
        }
      } catch (error) {
        result.errors.push(`Company insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('❌ Company insert exception:', error);
      }
    } else {
      // Create a minimal company record if no company data but we have other data
      if (analysis.founders?.length || analysis.metrics?.length || analysis.pitch_deck || analysis.financial_model) {
        try {
          const minimalCompanyData = {
            name: 'Startup from Upload',
            user_id: userId || null,
            created_at: new Date().toISOString()
          };

          console.log('💾 Creating minimal company record:', minimalCompanyData);
          
          const { data: companyResult, error: companyError } = await supabase
            .from('companies')
            .insert([minimalCompanyData])
            .select('id')
            .single();

          if (companyError) {
            result.errors.push(`Minimal company insert failed: ${companyError.message}`);
            console.error('❌ Minimal company insert error:', companyError);
          } else {
            companyId = companyResult.id;
            result.insertedTables.push('companies');
            console.log('✅ Minimal company created with ID:', companyId);
          }
        } catch (error) {
          result.errors.push(`Minimal company insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
          console.error('❌ Minimal company insert exception:', error);
        }
      }
    }

    // Insert founders if available and we have a company
    if (analysis.founders && analysis.founders.length > 0 && companyId) {
      try {
        const foundersData = analysis.founders.map(founder => ({
          company_id: companyId,
          full_name: founder.full_name || 'Unknown Founder',
          linkedin_url: founder.linkedin_url || null,
          education_history: founder.education_history || null,
          domain_experience_yrs: founder.domain_experience_yrs || null,
          technical_skills: founder.technical_skills || null,
          notable_achievements: founder.notable_achievements || null
        }));

        console.log('💾 Inserting founders data:', foundersData);

        const { error: foundersError } = await supabase
          .from('founders')
          .insert(foundersData);

        if (foundersError) {
          result.errors.push(`Founders insert failed: ${foundersError.message}`);
          console.error('❌ Founders insert error:', foundersError);
        } else {
          result.insertedTables.push('founders');
          console.log('✅ Founders inserted successfully');
        }
      } catch (error) {
        result.errors.push(`Founders insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('❌ Founders insert exception:', error);
      }
    }

    // Insert pitch deck data if available
    if (analysis.pitch_deck && Object.keys(analysis.pitch_deck).length > 0 && companyId) {
      try {
        const pitchDeckData = {
          company_id: companyId,
          core_problem: analysis.pitch_deck.core_problem || null,
          core_solution: analysis.pitch_deck.core_solution || null,
          customer_segment: analysis.pitch_deck.customer_segment || null,
          product_summary_md: analysis.pitch_deck.product_summary_md || null,
          upload_timestamp: new Date().toISOString()
        };

        console.log('💾 Inserting pitch deck data:', pitchDeckData);

        const { error: pitchError } = await supabase
          .from('pitch_decks')
          .insert([pitchDeckData]);

        if (pitchError) {
          result.errors.push(`Pitch deck insert failed: ${pitchError.message}`);
          console.error('❌ Pitch deck insert error:', pitchError);
        } else {
          result.insertedTables.push('pitch_decks');
          console.log('✅ Pitch deck inserted successfully');
        }
      } catch (error) {
        result.errors.push(`Pitch deck insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('❌ Pitch deck insert exception:', error);
      }
    }

    // Insert financial model data if available
    if (analysis.financial_model && Object.keys(analysis.financial_model).length > 0 && companyId) {
      try {
        const financialData = {
          company_id: companyId,
          monthly_revenue_usd: analysis.financial_model.monthly_revenue_usd || null,
          burn_rate_usd: analysis.financial_model.burn_rate_usd || null,
          ltv_cac_ratio: analysis.financial_model.ltv_cac_ratio || null,
          runway_months: analysis.financial_model.runway_months || null,
          revenue_model_notes: analysis.financial_model.revenue_model_notes || null
        };

        console.log('💾 Inserting financial model data:', financialData);

        const { error: financialError } = await supabase
          .from('financial_models')
          .insert([financialData]);

        if (financialError) {
          result.errors.push(`Financial model insert failed: ${financialError.message}`);
          console.error('❌ Financial model insert error:', financialError);
        } else {
          result.insertedTables.push('financial_models');
          console.log('✅ Financial model inserted successfully');
        }
      } catch (error) {
        result.errors.push(`Financial model insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('❌ Financial model insert exception:', error);
      }
    }

    // Insert go-to-market data if available
    if (analysis.go_to_market && Object.keys(analysis.go_to_market).length > 0 && companyId) {
      try {
        const gtmData = {
          company_id: companyId,
          gtm_channels: analysis.go_to_market.gtm_channels || null,
          gtm_notes_md: analysis.go_to_market.gtm_notes_md || null
        };

        console.log('💾 Inserting GTM data:', gtmData);

        const { error: gtmError } = await supabase
          .from('go_to_market')
          .insert([gtmData]);

        if (gtmError) {
          result.errors.push(`GTM insert failed: ${gtmError.message}`);
          console.error('❌ GTM insert error:', gtmError);
        } else {
          result.insertedTables.push('go_to_market');
          console.log('✅ GTM data inserted successfully');
        }
      } catch (error) {
        result.errors.push(`GTM insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('❌ GTM insert exception:', error);
      }
    }

    // Insert metrics if available
    if (analysis.metrics && analysis.metrics.length > 0 && companyId) {
      try {
        const metricsData = analysis.metrics.map(metric => ({
          company_id: companyId,
          metric_name: metric.metric_name || 'Unknown Metric',
          metric_value: metric.metric_value || 0,
          metric_unit: metric.metric_unit || null,
          as_of_date: new Date().toISOString().split('T')[0] // Today's date
        }));

        console.log('💾 Inserting metrics data:', metricsData);

        const { error: metricsError } = await supabase
          .from('metrics')
          .insert(metricsData);

        if (metricsError) {
          result.errors.push(`Metrics insert failed: ${metricsError.message}`);
          console.error('❌ Metrics insert error:', metricsError);
        } else {
          result.insertedTables.push('metrics');
          console.log('✅ Metrics inserted successfully');
        }
      } catch (error) {
        result.errors.push(`Metrics insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('❌ Metrics insert exception:', error);
      }
    }

    result.companyId = companyId;
    result.success = result.insertedTables.length > 0;
    
    console.log('💾 Database insertion completed:', result);
    return result;

  } catch (error) {
    result.errors.push(`Database operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('❌ Database insertion failed:', error);
    return result;
  }
}