import 'dart:math';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../models/advisory_models.dart';

class MockAdvisoryRepository {
  static final List<BusinessCategoryOption> categories = [
    const BusinessCategoryOption(
      id: 'poultry',
      title: 'Poultry & Layer Farming',
      subtitle: 'Broiler meat, indigenous Desi eggs & organic manure',
      icon: FontAwesomeIcons.egg,
      suggestedCapital: 50000,
    ),
    const BusinessCategoryOption(
      id: 'tailoring',
      title: 'Tailoring & Apparel Craft',
      subtitle: 'Custom stitching, school uniforms & local boutique',
      icon: FontAwesomeIcons.scissors,
      suggestedCapital: 40000,
    ),
    const BusinessCategoryOption(
      id: 'kirana',
      title: 'Kirana & Daily Provisions',
      subtitle: 'FMCG, staples, digital recharge & micro-retail',
      icon: FontAwesomeIcons.store,
      suggestedCapital: 75000,
    ),
    const BusinessCategoryOption(
      id: 'dairy',
      title: 'Dairy & Milk Collection',
      subtitle: 'Cross-breed bovine milk, ghee & bulk co-op supply',
      icon: FontAwesomeIcons.cow,
      suggestedCapital: 90000,
    ),
  ];

  static FinancialStructuringResult calculateFinancials({
    required double capital,
    required String categoryId,
  }) {
    // Deterministic rule: Under 50k is Shishu, above 50k is Kishore
    final bool isShishu = capital <= 50000;
    
    final scheme = GovernmentScheme(
      schemeName: isShishu
          ? 'Pradhan Mantri Mudra Yojana (PMMY)'
          : 'PMMY with NABARD Agri-Venture Subvention',
      tier: isShishu ? 'Shishu Tier (₹0 - ₹50,000)' : 'Kishore Tier (₹50,000 - ₹5,00,000)',
      ministry: 'Ministry of Finance & NABARD PVCF Framework',
      maxLimit: isShishu ? 50000 : 500000,
      interestSubvention: 2.0,
      nominalInterestRate: 9.25,
      effectiveInterestRate: 7.25,
      tenureMonths: 36,
      moratoriumMonths: 6, // 6 months flock ramp-up grace period
      promoterMarginPct: 10.0, // 10% self equity
      subsidyGrantPct: 15.0, // 15% NABARD back-ended capital subsidy
      eligibilityNote: 'Zero collateral required. Guarantee covered under CGTMSE/CGFMU.',
    );

    final double promoterMargin = capital * (scheme.promoterMarginPct / 100.0);
    final double subsidyGrant = capital * (scheme.subsidyGrantPct / 100.0);
    final double loanAmount = capital - promoterMargin - subsidyGrant;

    // Monthly interest calculation (amortized over remaining tenure after moratorium)
    // Tenure = 36 months, repayment months = 30
    final int repaymentMonths = scheme.tenureMonths - scheme.moratoriumMonths;
    final double monthlyRate = (scheme.effectiveInterestRate / 100.0) / 12.0;

    double monthlyEmi = 0.0;
    if (monthlyRate > 0 && repaymentMonths > 0) {
      final double factor = pow(1 + monthlyRate, repaymentMonths).toDouble();
      monthlyEmi = (loanAmount * monthlyRate * factor) / (factor - 1);
    } else {
      monthlyEmi = loanAmount / (repaymentMonths > 0 ? repaymentMonths : 1);
    }

    final double totalPayable = monthlyEmi * repaymentMonths;
    final double totalInterest = totalPayable - loanAmount;

    // DSCR = (Projected Net Cashflow / EMI) ~ 1.84 healthy
    const double dscr = 1.88;

    return FinancialStructuringResult(
      totalProjectCost: capital,
      promoterMarginAmount: promoterMargin,
      subsidyGrantAmount: subsidyGrant,
      netBankLoanAmount: loanAmount,
      monthlyEmi: monthlyEmi,
      totalInterestPayable: totalInterest > 0 ? totalInterest : 0,
      dscrRatio: dscr,
      scheme: scheme,
    );
  }

  static List<AdvisorySection> getPoultryAdvisorySections() {
    return [
      const AdvisorySection(
        id: 'market_reach',
        title: '1. Market Reach & Footfall',
        subtitle: 'Spatial distribution of consumers, bazaars & transport links',
        icon: FontAwesomeIcons.mapLocationDot,
        strategicRecommendation:
            'Focus on Bi-Weekly Haat clusters on Tuesdays & Saturdays within 2.5km to maximize direct cash sales.',
        items: [
          TruthItem(
            label: 'Haat Bazaar Access',
            value: '2 weekly village markets within 2.1 km radius',
            source: TruthSource.hardDataOsm,
            sourceDetail: 'OSM Way #391823 (Baramati Rural Haat)',
            icon: Icons.storefront,
          ),
          TruthItem(
            label: 'Arterial Transport Feeder',
            value: 'All-weather access road 450m connecting to SH-10',
            source: TruthSource.hardDataOsm,
            sourceDetail: 'OSM Highway: Secondary (Paved)',
            icon: Icons.add_road,
          ),
          TruthItem(
            label: 'Captive Consumer Base',
            value: '165 household cluster within 3.5 km delivery radius',
            source: TruthSource.aiProjection,
            sourceDetail: 'Llama-3 Spatial Density Modeling (92% CI)',
            icon: Icons.people_outline,
          ),
          TruthItem(
            label: 'Weekend Demand Surge',
            value: '+42% poultry meat volume increase on weekends',
            source: TruthSource.aiProjection,
            sourceDetail: 'Regional Consumer Spending Patterns',
            icon: Icons.trending_up,
          ),
        ],
      ),
      const AdvisorySection(
        id: 'underserved_niches',
        title: '2. Underserved Niches',
        subtitle: 'High-margin hyper-local unmet opportunities',
        icon: FontAwesomeIcons.bullseye,
        strategicRecommendation:
            'Introduce a 20% flock allocation to indigenous Kadaknath/Aseel birds for 2.4x margin realization.',
        items: [
          TruthItem(
            label: 'Indigenous Poultry Gap',
            value: '0 dedicated Desi / free-range egg suppliers within 8 km',
            source: TruthSource.hardDataOsm,
            sourceDetail: 'OSM Amenity Query: Zero Agriculture Sellers tagged',
            icon: Icons.verified_outlined,
          ),
          TruthItem(
            label: 'Agri-Compost Monetization',
            value: '6 commercial grape vineyards located within 5 km',
            source: TruthSource.hardDataOsm,
            sourceDetail: 'OSM Landuse: Vineyard (Baramati Agro Cluster)',
            icon: Icons.eco,
          ),
          TruthItem(
            label: 'Desi Egg Premium Pricing',
            value: '₹14-16/egg realization vs ₹6.5 for caged broiler eggs',
            source: TruthSource.aiProjection,
            sourceDetail: 'Synthetic Willingness-To-Pay (WTP) Index',
            icon: Icons.monetization_on_outlined,
          ),
          TruthItem(
            label: 'Poultry Litter Manure Revenue',
            value: '₹3,200 additional recurring monthly revenue via bagged manure',
            source: TruthSource.aiProjection,
            sourceDetail: 'Local Soil Nutrient Deficit Calculation',
            icon: Icons.recycling,
          ),
        ],
      ),
      const AdvisorySection(
        id: 'swot_analysis',
        title: '3. SWOT Analysis',
        subtitle: 'Strengths, Weaknesses, Opportunities & Threats matrix',
        icon: FontAwesomeIcons.chartPie,
        strategicRecommendation:
            'Leverage nearby government veterinary dispensaries to vaccinate on day 7 & 14 to eliminate disease mortality.',
        items: [
          TruthItem(
            label: 'Strength: Clinical Infrastructure',
            value: '2 licensed veterinary clinics within 3.4 km radius',
            source: TruthSource.hardDataOsm,
            sourceDetail: 'OSM Amenity: Veterinary (Govt Pashu Chikitsalay)',
            icon: Icons.health_and_safety,
          ),
          TruthItem(
            label: 'Strength: Power Grid Stability',
            value: '3-phase feeder line with 18.5 hrs daily supply recorded',
            source: TruthSource.hardDataOsm,
            sourceDetail: 'MSEDCL Rural Feeder Telemetry Node',
            icon: Icons.bolt,
          ),
          TruthItem(
            label: 'Weakness: Initial Cash Conversion',
            value: '42-day working capital lockup until first batch matures',
            source: TruthSource.aiProjection,
            sourceDetail: 'Broiler Growth Cycle Cashflow Simulation',
            icon: Icons.hourglass_top,
          ),
          TruthItem(
            label: 'Opportunity: B2B Dhaba Tie-ups',
            value: '4 highway eateries seeking direct farm-gate supply contract',
            source: TruthSource.aiProjection,
            sourceDetail: 'FastAPI Geo-Clustering of Highway Amenities',
            icon: Icons.handshake_outlined,
          ),
        ],
      ),
      const AdvisorySection(
        id: 'local_threats',
        title: '4. Local Threats & Mitigation',
        subtitle: 'Geo-spatial vulnerability, weather & market exposure',
        icon: FontAwesomeIcons.triangleExclamation,
        strategicRecommendation:
            'Install low-cost gunny-bag water curtains to prevent May heat stress mortality.',
        items: [
          TruthItem(
            label: 'Cold-Chain Void',
            value: 'Nearest refrigerated storage facility is 19.8 km away',
            source: TruthSource.hardDataOsm,
            sourceDetail: 'OSM Tag: Cold Storage distance metric',
            icon: Icons.ac_unit,
          ),
          TruthItem(
            label: 'Floodplain Safety Margin',
            value: 'Seasonal stream is 1.2 km away; site elevation is safe (+14m)',
            source: TruthSource.hardDataOsm,
            sourceDetail: 'SRTM Digital Elevation Model & OSM Waterway',
            icon: Icons.waves,
          ),
          TruthItem(
            label: 'Summer Heat Stress Risk',
            value: 'Peak temperatures exceed 41°C in May (mortality risk +8%)',
            source: TruthSource.aiProjection,
            sourceDetail: 'IMD Historical Microclimate Trends',
            icon: Icons.wb_sunny,
          ),
          TruthItem(
            label: 'Feed Price Volatility',
            value: 'Soya-meal and maize input prices projected to rise 7.2% in Q3',
            source: TruthSource.aiProjection,
            sourceDetail: 'Commodity Index Forecasting via Llama 3',
            icon: Icons.price_change_outlined,
          ),
        ],
      ),
      const AdvisorySection(
        id: 'competitor_density',
        title: '5. Competitor Density Analysis',
        subtitle: 'Spatial distribution of existing poultry operators',
        icon: FontAwesomeIcons.shopLock,
        strategicRecommendation:
            'Existing layer farm caters exclusively to urban wholesale; retail local vacuum is 72% open.',
        items: [
          TruthItem(
            label: 'Large Scale Layer Farm',
            value: '1 commercial facility (12,000 birds) located 3.8 km south-east',
            source: TruthSource.hardDataOsm,
            sourceDetail: 'OSM Building: Agriculture / Poultry',
            icon: Icons.domain,
          ),
          TruthItem(
            label: 'Registered Backyard Coops',
            value: '3 micro-coops registered under Gram Panchayat Ward 4',
            source: TruthSource.hardDataOsm,
            sourceDetail: 'Local Panchayat Agricultural Registry',
            icon: Icons.cottage,
          ),
          TruthItem(
            label: 'Hyper-Local Saturation Index',
            value: '26 / 100 (Low saturation - High Expansion Viability)',
            source: TruthSource.aiProjection,
            sourceDetail: 'Spatial Poisson Kernel Density Estimate',
            icon: Icons.speed,
          ),
          TruthItem(
            label: 'Price War Probability',
            value: 'Low (Retail demand exceeds village capacity by ~400 kg/week)',
            source: TruthSource.aiProjection,
            sourceDetail: 'Micro-Market Equilibrium Calculation',
            icon: Icons.balance,
          ),
        ],
      ),
      const AdvisorySection(
        id: 'suggested_pricing',
        title: '6. Suggested Unit Pricing & Margins',
        subtitle: 'Optimal price discovery based on hyper-local benchmarks',
        icon: FontAwesomeIcons.tags,
        strategicRecommendation:
            'Price live birds at ₹155/kg to undercut urban retail (₹175/kg) while retaining a healthy 31% operating margin.',
        items: [
          TruthItem(
            label: 'APMC Mandi Wholesale Benchmark',
            value: '₹136 - ₹142 / kg live bird wholesale rate',
            source: TruthSource.hardDataOsm,
            sourceDetail: 'APMC Baramati Real-Time Mandi Bulletin',
            icon: Icons.receipt_long,
          ),
          TruthItem(
            label: 'Local Village Retail Price',
            value: '₹170 - ₹185 / kg in nearby town center butcher stalls',
            source: TruthSource.hardDataOsm,
            sourceDetail: 'OSM Shop: Butcher / Meat Stall Survey',
            icon: Icons.store,
          ),
          TruthItem(
            label: 'Optimal Farm-Gate Price',
            value: '₹155 / kg (Recommended sweet-spot)',
            source: TruthSource.aiProjection,
            sourceDetail: 'Demand Elasticity Matrix via Llama 3',
            icon: Icons.price_check,
          ),
          TruthItem(
            label: 'Net Operating Margin Target',
            value: '31.4% gross profit per batch after feed & medicine',
            source: TruthSource.aiProjection,
            sourceDetail: 'Dynamic Cashflow Financial Model',
            icon: Icons.pie_chart_outline,
          ),
        ],
      ),
    ];
  }

  static List<String> getGeoRagPipelineLogs() {
    return [
      'Pinging GPS: 18.1512° N, 74.5771° E (Accuracy: ±3.8m)...',
      'Locking Gram Panchayat: Shivajinagar, Block: Baramati Rural...',
      'Extracting OpenStreetMap Infrastructure bounding box (5.0 km radius)...',
      'OSM Overpass API: Found 2 veterinary dispensaries & 1 agro-feeder road.',
      'OSM Overpass API: Querying agricultural landuse & rural weekly Haat nodes...',
      'Generating Synthetic Competitor Density via Spatial Poisson Process...',
      'Computing buffer distance to high-tension powerlines and water bodies...',
      'Querying Llama 3 8B via FastAPI (Inference temperature=0.15, RAG context=14 chunks)...',
      'Cross-referencing NABARD Poultry Venture Capital Fund (PVCF) Guidelines...',
      'Evaluating PMMY Shishu vs. Kishore collateral-free eligibility rules...',
      'Tagging empirical OSM attributes with Truth Flag [Hard Data]...',
      'Synthesizing probabilistic forecasts with Truth Flag [AI Projection]...',
      'Compiling final 6-Part Hyper-Local Dossier & Financial Structuring...',
    ];
  }
}
