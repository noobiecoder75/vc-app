import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_sk-proj-T82eIApyLJnjDrSH6oLnHG466qf0i10uWXVaUmXTeUwrtCURgmM8Shvv4rwvFgeG9fVRIFiNxXT3BlbkFJyaiEyemXi8543mYtkA9bAHru4EtuIOaw7ZDKHR3jtQljVwoRKJTlWUHDHKdeLbP1zxOXJQXjEA,
  dangerouslyAllowBrowser: true
});

export interface StartupAnalysis {
  company?: {
    name?: string;
    industry_name?: string;
    sub_industry_name?: string;
    country?: string;
    geo_region?: string;
    startup_stage?: string;
    valuation_target_usd?: number;
    funding_goal_usd?: number;
    incorporation_year?: number;
    pitch_deck_summary?: string;
  };
  founders?: Array<{
    full_name: string;
    linkedin_url?: string;
    education_history?: string[];
    domain_experience_yrs?: number;
    technical_skills?: string[];
    notable_achievements?: string;
  }>;
  pitch_deck?: {
    core_problem?: string;
    core_solution?: string;
    customer_segment?: string;
    product_summary_md?: string;
  };
  financial_model?: {
    monthly_revenue_usd?: number;
    burn_rate_usd?: number;
    ltv_cac_ratio?: number;
    runway_months?: number;
    revenue_model_notes?: string;
  };
  go_to_market?: {
    gtm_channels?: string[];
    gtm_notes_md?: string;
  };
  metrics?: Array<{
    metric_name: string;
    metric_value: number;
    metric_unit?: string;
  }>;
}

const ANALYSIS_PROMPT = `You are an AI startup analyst. Analyze the provided startup document and extract relevant information. Return a JSON object with the following structure, only including fields where you can confidently extract data:

{
  "company": {
    "name": "string - company name",
    "industry_name": "string - main industry (e.g., 'SaaS', 'FinTech', 'HealthTech')",
    "sub_industry_name": "string - specific sub-industry",
    "country": "string - country of incorporation/operation",
    "geo_region": "string - geographic region (e.g., 'North America', 'Europe')",
    "startup_stage": "string - stage (e.g., 'Pre-seed', 'Seed', 'Series A')",
    "valuation_target_usd": "number - target valuation in USD",
    "funding_goal_usd": "number - funding goal in USD", 
    "incorporation_year": "number - year incorporated",
    "pitch_deck_summary": "string - brief summary of the pitch"
  },
  "founders": [
    {
      "full_name": "string - founder name",
      "linkedin_url": "string - LinkedIn profile URL",
      "education_history": ["string array of education background"],
      "domain_experience_yrs": "number - years of domain experience",
      "technical_skills": ["string array of technical skills"],
      "notable_achievements": "string - key achievements"
    }
  ],
  "pitch_deck": {
    "core_problem": "string - main problem being solved",
    "core_solution": "string - proposed solution",
    "customer_segment": "string - target customer segment",
    "product_summary_md": "string - product description in markdown"
  },
  "financial_model": {
    "monthly_revenue_usd": "number - monthly revenue",
    "burn_rate_usd": "number - monthly burn rate",
    "ltv_cac_ratio": "number - LTV to CAC ratio",
    "runway_months": "number - runway in months",
    "revenue_model_notes": "string - revenue model description"
  },
  "go_to_market": {
    "gtm_channels": ["string array of go-to-market channels"],
    "gtm_notes_md": "string - GTM strategy notes in markdown"
  },
  "metrics": [
    {
      "metric_name": "string - metric name (e.g., 'MRR', 'CAC', 'LTV')",
      "metric_value": "number - metric value", 
      "metric_unit": "string - unit (e.g., 'USD', '%', 'users')"
    }
  ]
}

IMPORTANT GUIDELINES:
- Only include fields where you can extract meaningful data
- For financial figures, convert to USD if needed
- Be conservative - if unsure, omit the field
- For arrays, only include if you find multiple relevant items
- Ensure all numbers are valid numeric values
- If the document doesn't contain startup-related information, return an empty object {}

Document Content:`;

export async function analyzeStartupContent(
  content: string,
  contentType: string,
  metadata?: any
): Promise<StartupAnalysis> {
  try {
    console.log(`🤖 Starting ChatGPT analysis for ${contentType} content`);
    
    const enhancedContent = `
Content Type: ${contentType}
${metadata ? `Metadata: ${JSON.stringify(metadata, null, 2)}` : ''}

Content:
${content}
    `.trim();

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: ANALYSIS_PROMPT
        },
        {
          role: 'user', 
          content: enhancedContent
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    });

    const analysisText = response.choices[0]?.message?.content;
    if (!analysisText) {
      throw new Error('No response from ChatGPT');
    }

    console.log('🤖 Raw ChatGPT response:', analysisText);

    // Try to parse JSON response
    try {
      const analysis = JSON.parse(analysisText) as StartupAnalysis;
      console.log('✅ ChatGPT analysis completed:', analysis);
      return analysis;
    } catch (parseError) {
      console.error('❌ Failed to parse ChatGPT JSON response:', parseError);
      console.log('Raw response that failed to parse:', analysisText);
      
      // Return empty analysis if parsing fails
      return {};
    }

  } catch (error) {
    console.error('❌ ChatGPT analysis failed:', error);
    throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}