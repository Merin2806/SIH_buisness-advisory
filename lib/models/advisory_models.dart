enum TruthSource {
  hardDataOsm,
  aiProjection,
}

class TruthItem {
  final String label;
  final String value;
  final TruthSource source;
  final String sourceDetail;
  final dynamic icon;

  const TruthItem({
    required this.label,
    required this.value,
    required this.source,
    required this.sourceDetail,
    this.icon,
  });
}

class AdvisorySection {
  final String id;
  final String title;
  final String subtitle;
  final dynamic icon;
  final List<TruthItem> items;
  final String? strategicRecommendation;

  const AdvisorySection({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.items,
    this.strategicRecommendation,
  });
}

class GovernmentScheme {
  final String schemeName;
  final String tier;
  final String ministry;
  final double maxLimit;
  final double interestSubvention;
  final double nominalInterestRate;
  final double effectiveInterestRate;
  final int tenureMonths;
  final int moratoriumMonths;
  final double promoterMarginPct;
  final double subsidyGrantPct;
  final String eligibilityNote;

  const GovernmentScheme({
    required this.schemeName,
    required this.tier,
    required this.ministry,
    required this.maxLimit,
    required this.interestSubvention,
    required this.nominalInterestRate,
    required this.effectiveInterestRate,
    required this.tenureMonths,
    required this.moratoriumMonths,
    required this.promoterMarginPct,
    required this.subsidyGrantPct,
    required this.eligibilityNote,
  });
}

class FinancialStructuringResult {
  final double totalProjectCost;
  final double promoterMarginAmount;
  final double subsidyGrantAmount;
  final double netBankLoanAmount;
  final double monthlyEmi;
  final double totalInterestPayable;
  final double dscrRatio;
  final GovernmentScheme scheme;

  const FinancialStructuringResult({
    required this.totalProjectCost,
    required this.promoterMarginAmount,
    required this.subsidyGrantAmount,
    required this.netBankLoanAmount,
    required this.monthlyEmi,
    required this.totalInterestPayable,
    required this.dscrRatio,
    required this.scheme,
  });
}

class BusinessCategoryOption {
  final String id;
  final String title;
  final String subtitle;
  final dynamic icon;
  final double suggestedCapital;

  const BusinessCategoryOption({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.suggestedCapital,
  });
}
