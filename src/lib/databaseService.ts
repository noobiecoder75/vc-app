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

    // Start with company data if available
    let companyId: string | undefined;
    
    if (analysis.company && Object.keys(analysis.company).length > 0) {
      try {
        const companyData = {
          ...analysis.company,
          user_id: userId || null,
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
    }

    // Insert founders if available and we have a company
    if (analysis.founders && analysis.founders.length > 0 && companyId) {
      try {
        const foundersData = analysis.founders.map(founder => ({
          ...founder,
          company_id: companyId
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
          ...analysis.pitch_deck,
          company_id: companyId,
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
          ...analysis.financial_model,
          company_id: companyId
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
          ...analysis.go_to_market,
          company_id: companyId
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
          ...metric,
          company_id: companyId,
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