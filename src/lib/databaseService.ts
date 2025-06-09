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

  console.group('🔵 DATABASE SERVICE - Starting insertion process');
  console.log('📊 Input Analysis Object:', JSON.stringify(analysis, null, 2));
  console.log('👤 User ID:', userId || 'Anonymous');
  console.log('📋 Analysis Keys:', Object.keys(analysis));
  console.log('📏 Analysis Size:', JSON.stringify(analysis).length + ' characters');

  try {
    // Validate that we have some data to insert
    if (!analysis || Object.keys(analysis).length === 0) {
      console.error('❌ VALIDATION FAILED: No analysis data provided');
      result.errors.push('No analysis data provided');
      console.groupEnd();
      return result;
    }

    console.log('✅ VALIDATION PASSED: Analysis data exists');

    // Start with company data if available
    let companyId: string | undefined;
    
    if (analysis.company && Object.keys(analysis.company).length > 0) {
      console.group('🏢 COMPANY DATA INSERTION');
      console.log('📋 Raw company data from AI:', JSON.stringify(analysis.company, null, 2));

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
          user_id: userId || null,
          created_at: new Date().toISOString()
        };

        console.log('🔄 Prepared company data for insertion:', JSON.stringify(companyData, null, 2));
        
        const { data: companyResult, error: companyError } = await supabase
          .from('companies')
          .insert([companyData])
          .select('id')
          .single();

        if (companyError) {
          console.error('❌ Company insert error:', companyError);
          console.error('📤 Data that failed:', JSON.stringify(companyData, null, 2));
          result.errors.push(`Company insert failed: ${companyError.message}`);
        } else {
          companyId = companyResult.id;
          result.insertedTables.push('companies');
          console.log('✅ Company inserted successfully with ID:', companyId);
          console.log('📥 Returned data:', JSON.stringify(companyResult, null, 2));
        }
      } catch (error) {
        console.error('💥 Company insert exception:', error);
        result.errors.push(`Company insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      console.groupEnd();
    } else {
      console.group('🏢 MINIMAL COMPANY CREATION');
      console.log('ℹ️ No company data in analysis, checking if we need minimal company...');
      
      // Create a minimal company record if no company data but we have other data
      if (analysis.founders?.length || analysis.metrics?.length || analysis.pitch_deck || analysis.financial_model) {
        console.log('🔄 Creating minimal company record because we have other data');
        
        try {
          const minimalCompanyData = {
            name: 'Startup from Upload',
            user_id: userId || null,
            created_at: new Date().toISOString()
          };

          console.log('📤 Minimal company data:', JSON.stringify(minimalCompanyData, null, 2));
          
          const { data: companyResult, error: companyError } = await supabase
            .from('companies')
            .insert([minimalCompanyData])
            .select('id')
            .single();

          if (companyError) {
            console.error('❌ Minimal company insert error:', companyError);
            result.errors.push(`Minimal company insert failed: ${companyError.message}`);
          } else {
            companyId = companyResult.id;
            result.insertedTables.push('companies');
            console.log('✅ Minimal company created with ID:', companyId);
          }
        } catch (error) {
          console.error('💥 Minimal company insert exception:', error);
          result.errors.push(`Minimal company insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        console.log('⏭️ No related data found, skipping company creation');
      }
      console.groupEnd();
    }

    // Insert founders if available and we have a company
    if (analysis.founders && analysis.founders.length > 0 && companyId) {
      console.group('👥 FOUNDERS DATA INSERTION');
      console.log(`📊 Found ${analysis.founders.length} founders to insert`);
      console.log('📋 Raw founders data:', JSON.stringify(analysis.founders, null, 2));

      try {
        const foundersData = analysis.founders.map((founder, index) => {
          const founderData = {
            company_id: companyId,
            full_name: founder.full_name || 'Unknown Founder',
            linkedin_url: founder.linkedin_url || null,
            education_history: founder.education_history || null,
            domain_experience_yrs: founder.domain_experience_yrs || null,
            technical_skills: founder.technical_skills || null,
            notable_achievements: founder.notable_achievements || null
          };
          console.log(`🔄 Prepared founder ${index + 1}:`, JSON.stringify(founderData, null, 2));
          return founderData;
        });

        console.log('📤 Final founders array for insertion:', JSON.stringify(foundersData, null, 2));

        const { error: foundersError } = await supabase
          .from('founders')
          .insert(foundersData);

        if (foundersError) {
          console.error('❌ Founders insert error:', foundersError);
          console.error('📤 Data that failed:', JSON.stringify(foundersData, null, 2));
          result.errors.push(`Founders insert failed: ${foundersError.message}`);
        } else {
          result.insertedTables.push('founders');
          console.log('✅ All founders inserted successfully');
        }
      } catch (error) {
        console.error('💥 Founders insert exception:', error);
        result.errors.push(`Founders insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      console.groupEnd();
    } else {
      console.log('⏭️ FOUNDERS SKIPPED:', {
        hasFounders: !!analysis.founders,
        foundersCount: analysis.founders?.length || 0,
        hasCompanyId: !!companyId
      });
    }

    // Insert pitch deck data if available
    if (analysis.pitch_deck && Object.keys(analysis.pitch_deck).length > 0 && companyId) {
      console.group('📊 PITCH DECK DATA INSERTION');
      console.log('📋 Raw pitch deck data:', JSON.stringify(analysis.pitch_deck, null, 2));

      try {
        const pitchDeckData = {
          company_id: companyId,
          core_problem: analysis.pitch_deck.core_problem || null,
          core_solution: analysis.pitch_deck.core_solution || null,
          customer_segment: analysis.pitch_deck.customer_segment || null,
          product_summary_md: analysis.pitch_deck.product_summary_md || null,
          upload_timestamp: new Date().toISOString()
        };

        console.log('📤 Prepared pitch deck data:', JSON.stringify(pitchDeckData, null, 2));

        const { error: pitchError } = await supabase
          .from('pitch_decks')
          .insert([pitchDeckData]);

        if (pitchError) {
          console.error('❌ Pitch deck insert error:', pitchError);
          console.error('📤 Data that failed:', JSON.stringify(pitchDeckData, null, 2));
          result.errors.push(`Pitch deck insert failed: ${pitchError.message}`);
        } else {
          result.insertedTables.push('pitch_decks');
          console.log('✅ Pitch deck inserted successfully');
        }
      } catch (error) {
        console.error('💥 Pitch deck insert exception:', error);
        result.errors.push(`Pitch deck insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      console.groupEnd();
    } else {
      console.log('⏭️ PITCH DECK SKIPPED:', {
        hasPitchDeck: !!analysis.pitch_deck,
        pitchDeckKeys: analysis.pitch_deck ? Object.keys(analysis.pitch_deck) : [],
        hasCompanyId: !!companyId
      });
    }

    // Insert financial model data if available
    if (analysis.financial_model && Object.keys(analysis.financial_model).length > 0 && companyId) {
      console.group('💰 FINANCIAL MODEL DATA INSERTION');
      console.log('📋 Raw financial data:', JSON.stringify(analysis.financial_model, null, 2));

      try {
        const financialData = {
          company_id: companyId,
          monthly_revenue_usd: analysis.financial_model.monthly_revenue_usd || null,
          burn_rate_usd: analysis.financial_model.burn_rate_usd || null,
          ltv_cac_ratio: analysis.financial_model.ltv_cac_ratio || null,
          runway_months: analysis.financial_model.runway_months || null,
          revenue_model_notes: analysis.financial_model.revenue_model_notes || null
        };

        console.log('📤 Prepared financial data:', JSON.stringify(financialData, null, 2));

        const { error: financialError } = await supabase
          .from('financial_models')
          .insert([financialData]);

        if (financialError) {
          console.error('❌ Financial model insert error:', financialError);
          console.error('📤 Data that failed:', JSON.stringify(financialData, null, 2));
          result.errors.push(`Financial model insert failed: ${financialError.message}`);
        } else {
          result.insertedTables.push('financial_models');
          console.log('✅ Financial model inserted successfully');
        }
      } catch (error) {
        console.error('💥 Financial model insert exception:', error);
        result.errors.push(`Financial model insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      console.groupEnd();
    } else {
      console.log('⏭️ FINANCIAL MODEL SKIPPED:', {
        hasFinancialModel: !!analysis.financial_model,
        financialModelKeys: analysis.financial_model ? Object.keys(analysis.financial_model) : [],
        hasCompanyId: !!companyId
      });
    }

    // Insert go-to-market data if available
    if (analysis.go_to_market && Object.keys(analysis.go_to_market).length > 0 && companyId) {
      console.group('🎯 GO-TO-MARKET DATA INSERTION');
      console.log('📋 Raw GTM data:', JSON.stringify(analysis.go_to_market, null, 2));

      try {
        const gtmData = {
          company_id: companyId,
          gtm_channels: analysis.go_to_market.gtm_channels || null,
          gtm_notes_md: analysis.go_to_market.gtm_notes_md || null
        };

        console.log('📤 Prepared GTM data:', JSON.stringify(gtmData, null, 2));

        const { error: gtmError } = await supabase
          .from('go_to_market')
          .insert([gtmData]);

        if (gtmError) {
          console.error('❌ GTM insert error:', gtmError);
          console.error('📤 Data that failed:', JSON.stringify(gtmData, null, 2));
          result.errors.push(`GTM insert failed: ${gtmError.message}`);
        } else {
          result.insertedTables.push('go_to_market');
          console.log('✅ GTM data inserted successfully');
        }
      } catch (error) {
        console.error('💥 GTM insert exception:', error);
        result.errors.push(`GTM insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      console.groupEnd();
    } else {
      console.log('⏭️ GTM SKIPPED:', {
        hasGTM: !!analysis.go_to_market,
        gtmKeys: analysis.go_to_market ? Object.keys(analysis.go_to_market) : [],
        hasCompanyId: !!companyId
      });
    }

    // Insert metrics if available
    if (analysis.metrics && analysis.metrics.length > 0 && companyId) {
      console.group('📈 METRICS DATA INSERTION');
      console.log(`📊 Found ${analysis.metrics.length} metrics to insert`);
      console.log('📋 Raw metrics data:', JSON.stringify(analysis.metrics, null, 2));

      try {
        const metricsData = analysis.metrics.map((metric, index) => {
          const metricData = {
            company_id: companyId,
            metric_name: metric.metric_name || 'Unknown Metric',
            metric_value: metric.metric_value || 0,
            metric_unit: metric.metric_unit || null,
            as_of_date: new Date().toISOString().split('T')[0] // Today's date
          };
          console.log(`🔄 Prepared metric ${index + 1}:`, JSON.stringify(metricData, null, 2));
          return metricData;
        });

        console.log('📤 Final metrics array for insertion:', JSON.stringify(metricsData, null, 2));

        const { error: metricsError } = await supabase
          .from('metrics')
          .insert(metricsData);

        if (metricsError) {
          console.error('❌ Metrics insert error:', metricsError);
          console.error('📤 Data that failed:', JSON.stringify(metricsData, null, 2));
          result.errors.push(`Metrics insert failed: ${metricsError.message}`);
        } else {
          result.insertedTables.push('metrics');
          console.log('✅ All metrics inserted successfully');
        }
      } catch (error) {
        console.error('💥 Metrics insert exception:', error);
        result.errors.push(`Metrics insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      console.groupEnd();
    } else {
      console.log('⏭️ METRICS SKIPPED:', {
        hasMetrics: !!analysis.metrics,
        metricsCount: analysis.metrics?.length || 0,
        hasCompanyId: !!companyId
      });
    }

    result.companyId = companyId;
    result.success = result.insertedTables.length > 0;
    
    console.log('🏁 DATABASE INSERTION COMPLETE');
    console.log('📊 Final Result:', JSON.stringify(result, null, 2));
    console.log('✅ Success:', result.success);
    console.log('📋 Inserted Tables:', result.insertedTables);
    console.log('❌ Errors:', result.errors);
    console.log('🆔 Company ID:', companyId);
    console.groupEnd();
    
    return result;

  } catch (error) {
    console.error('💥 DATABASE OPERATION FAILED:', error);
    console.error('📊 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'UnknownError'
    });
    result.errors.push(`Database operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.groupEnd();
    return result;
  }
}