import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import '../models/advisory_models.dart';
import '../providers/advisory_provider.dart';
import '../theme/app_colors.dart';
import '../widgets/app_icon.dart';
import '../widgets/deterministic_chart.dart';
import '../widgets/dynamic_unit_economics.dart';
import '../widgets/osm_map_preview.dart';
import '../widgets/truth_flag_badge.dart';

class DashboardScreen extends StatelessWidget {
  final VoidCallback onBackToPlanner;

  const DashboardScreen({super.key, required this.onBackToPlanner});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AdvisoryProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.surfaceLight,
      body: SafeArea(
        child: Column(
          children: [
            // Top App Bar / Summary Bar
            _buildTopProfileBar(context, provider),

            // Tab Navigation Bar (Financial Structuring vs. Advisory & Feasibility)
            _buildTabSelector(context, provider),

            // Tab Content
            Expanded(
              child: IndexedStack(
                index: provider.activeTab,
                children: [
                  _buildFinancialStructuringTab(context, provider),
                  _buildAdvisoryFeasibilityTab(context, provider),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopProfileBar(BuildContext context, AdvisoryProvider provider) {
    final cat = provider.selectedCategory;

    return Container(
      padding: const EdgeInsets.fromLTRB(18, 14, 18, 14),
      decoration: const BoxDecoration(
        gradient: AppColors.heroGradient,
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              IconButton(
                onPressed: onBackToPlanner,
                icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        AppIcon(cat.icon, size: 13, color: const Color(0xFFD6E4F5)),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            cat.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    const Text(
                      'Shivajinagar, Baramati (18.1512° N, 74.5771° E)',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 11,
                        color: Color(0xFFE2E8F5),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              // Feasibility Score Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white30),
                ),
                child: const Column(
                  children: [
                    Text(
                      'VIABILITY',
                      style: TextStyle(
                        fontSize: 8,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFFD6E4F5),
                        letterSpacing: 0.8,
                      ),
                    ),
                    Text(
                      '88 / 100',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTabSelector(BuildContext context, AdvisoryProvider provider) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 14, 16, 8),
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.mineralGreyLight.withOpacity(0.6),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Expanded(
            child: _buildTabButton(
              context: context,
              title: 'Financial Structuring',
              subtitle: 'Deterministic Calculator',
              icon: FontAwesomeIcons.landmark,
              isActive: provider.activeTab == 0,
              onTap: () => provider.setActiveTab(0),
            ),
          ),
          const SizedBox(width: 4),
          Expanded(
            child: _buildTabButton(
              context: context,
              title: 'Advisory & Feasibility',
              subtitle: '6-Part Geo-RAG Report',
              icon: FontAwesomeIcons.chartGantt,
              isActive: provider.activeTab == 1,
              onTap: () => provider.setActiveTab(1),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabButton({
    required BuildContext context,
    required String title,
    required String subtitle,
    required dynamic icon,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        decoration: BoxDecoration(
          color: isActive ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AppIcon(
                  icon,
                  size: 13,
                  color: isActive ? AppColors.ultraviolet : AppColors.textMuted,
                ),
                const SizedBox(width: 6),
                Flexible(
                  child: Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: isActive ? AppColors.ultraviolet : AppColors.textSecondary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.w600,
                color: isActive ? AppColors.glacierBlueDark : AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // TAB 1: FINANCIAL STRUCTURING (Deterministic)
  // ==========================================
  Widget _buildFinancialStructuringTab(BuildContext context, AdvisoryProvider provider) {
    final financials = provider.financialResult;
    final scheme = financials.scheme;

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Recommended Scheme Banner
          _buildSchemeCard(context, scheme),

          const SizedBox(height: 18),

          // 2. Deterministic Donut Chart (Capital vs. Margin)
          DeterministicCapitalChart(financials: financials),

          const SizedBox(height: 18),

          // 3. Strict Deterministic Math Data Table
          _buildDeterministicDataTable(context, financials),

          const SizedBox(height: 18),

          // 4. Moratorium & Amortization Insights
          _buildMoratoriumInsightCard(context, financials),

          const SizedBox(height: 18),

          // 5. Pre-Sanction Checklist (Aadhaar, CGTMSE, etc.)
          _buildBankChecklistCard(context),

          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Widget _buildSchemeCard(BuildContext context, GovernmentScheme scheme) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.ultraviolet.withOpacity(0.08),
            AppColors.glacierBlue.withOpacity(0.12),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.ultraviolet.withOpacity(0.2)),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(
            spacing: 8,
            runSpacing: 6,
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.ultraviolet,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'RECOMMENDED SCHEME',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: 0.8,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.truthGreenBg,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppColors.truthGreenBorder),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.verified, size: 12, color: AppColors.truthGreen),
                    SizedBox(width: 4),
                    Text(
                      'NABARD Gazetted',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: AppColors.truthGreen,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            scheme.schemeName,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            scheme.tier,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: AppColors.ultraviolet,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            scheme.eligibilityNote,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
              height: 1.3,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeterministicDataTable(
    BuildContext context,
    FinancialStructuringResult financials,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.mineralGreyLight),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(
            spacing: 8,
            runSpacing: 6,
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              const Text(
                'Deterministic Loan Structuring',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.glacierBlueSoft,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  'ACTUARIAL FORMULA',
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    color: AppColors.glacierBlueDark,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          _buildDataRow(
            label: 'Total Project Cost',
            value: '₹${financials.totalProjectCost.toInt()}',
            detail: 'Initial seed capital required',
            isBold: true,
          ),
          const Divider(color: AppColors.mineralGreyLight, height: 16),
          _buildDataRow(
            label: 'Promoter Margin (Equity)',
            value: '₹${financials.promoterMarginAmount.toInt()} (10%)',
            detail: 'Self-contribution under Mudra rules',
          ),
          const Divider(color: AppColors.mineralGreyLight, height: 16),
          _buildDataRow(
            label: 'NABARD Capital Subsidy',
            value: '₹${financials.subsidyGrantAmount.toInt()} (15%)',
            detail: 'Back-ended capital subsidy linkage',
            highlightColor: AppColors.truthGreen,
          ),
          const Divider(color: AppColors.mineralGreyLight, height: 16),
          _buildDataRow(
            label: 'Total Net Bank Loan Amount',
            value: '₹${financials.netBankLoanAmount.toInt()} (75%)',
            detail: 'Commercial Bank or RRB debt disbursement',
            isBold: true,
            highlightColor: AppColors.ultraviolet,
          ),
          const Divider(color: AppColors.mineralGreyLight, height: 16),
          _buildDataRow(
            label: 'Subsidized Interest Rate',
            value: '${financials.scheme.effectiveInterestRate}% p.a.',
            detail: '9.25% nominal - 2.0% Govt Interest Subvention',
            highlightColor: AppColors.glacierBlueDark,
          ),
          const Divider(color: AppColors.mineralGreyLight, height: 16),
          _buildDataRow(
            label: 'Tenure (Repayment Period)',
            value: '${financials.scheme.tenureMonths} Months',
            detail: '3 years total amortization period',
          ),
          const Divider(color: AppColors.mineralGreyLight, height: 16),
          _buildDataRow(
            label: 'Moratorium Period',
            value: '${financials.scheme.moratoriumMonths} Months',
            detail: 'Flock maturation grace period (No principal EMI)',
            highlightColor: AppColors.ultraviolet,
          ),
          const Divider(color: AppColors.mineralGreyLight, height: 16),
          _buildDataRow(
            label: 'Monthly Post-Grace EMI',
            value: '₹${financials.monthlyEmi.toStringAsFixed(0)} / mo',
            detail: 'Amortized across 30 active repayment months',
            isBold: true,
          ),
          const Divider(color: AppColors.mineralGreyLight, height: 16),
          _buildDataRow(
            label: 'Debt Service Coverage (DSCR)',
            value: '${financials.dscrRatio}x (Healthy)',
            detail: 'Benchmark > 1.5x for effortless servicing',
            highlightColor: AppColors.truthGreen,
          ),
        ],
      ),
    );
  }

  Widget _buildDataRow({
    required String label,
    required String value,
    required String detail,
    bool isBold = false,
    Color? highlightColor,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 6,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: isBold ? FontWeight.w800 : FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                detail,
                style: const TextStyle(
                  fontSize: 10,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          flex: 4,
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              color: highlightColor ?? AppColors.textPrimary,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMoratoriumInsightCard(
    BuildContext context,
    FinancialStructuringResult financials,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.glacierBlueSoft.withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.glacierBlue.withOpacity(0.3)),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          FaIcon(FontAwesomeIcons.clockRotateLeft, color: AppColors.glacierBlueDark, size: 18),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '6-Month Moratorium Justification',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: AppColors.glacierBlueDark,
                  ),
                ),
                SizedBox(height: 3),
                Text(
                  'Broiler batches require 42 days per flock plus 14 days shed sanitation. The 6-month grace period prevents working capital shock before first batch revenue is realized.',
                  style: TextStyle(fontSize: 11, color: AppColors.textPrimary, height: 1.3),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBankChecklistCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.mineralGreyLight),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Sanction Documentation Checklist',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          _buildCheckItem('Aadhaar & PAN KYC linked bank account', true),
          _buildCheckItem('Zero Collateral Guarantee (Covered under CGTMSE)', true),
          _buildCheckItem('Gram Panchayat No-Objection for poultry shed', true),
          _buildCheckItem('Project Report auto-certified by RuralBiz AI', true),
        ],
      ),
    );
  }

  Widget _buildCheckItem(String label, bool isDone) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            isDone ? Icons.check_circle : Icons.radio_button_unchecked,
            color: isDone ? AppColors.truthGreen : AppColors.mineralGrey,
            size: 16,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontSize: 12, color: AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 2: ADVISORY & FEASIBILITY (6-Part Report)
  // ==========================================
  Widget _buildAdvisoryFeasibilityTab(BuildContext context, AdvisoryProvider provider) {
    final sections = provider.advisorySections;

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Truth Flagging Filter Bar
          _buildTruthFilterHeader(context, provider),

          const SizedBox(height: 16),

          // 2. Interactive Dynamic Unit Economics Budgeter
          const DynamicUnitEconomicsBudgeter(),

          const SizedBox(height: 22),

          // 3. Section Title
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'The 6-Part Geo-RAG Advisory Dossier',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
              SizedBox(width: 8),
              Text(
                'Truth-Flagged',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: AppColors.ultraviolet,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // 4. The 6 Components Cards
          ...sections.map((sec) => _buildAdvisorySectionCard(context, sec)),

          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Widget _buildTruthFilterHeader(BuildContext context, AdvisoryProvider provider) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.mineralGreyLight),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.filter_alt_outlined, size: 14, color: AppColors.ultraviolet),
              SizedBox(width: 6),
              Expanded(
                child: Text(
                  'Truth Verification Filter',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
              SizedBox(width: 6),
              Text(
                'Sources',
                style: TextStyle(fontSize: 10, color: AppColors.textMuted),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _buildFilterChip(
                label: 'All Insights',
                filterValue: 'all',
                currentValue: provider.truthFilter,
                onSelected: () => provider.setTruthFilter('all'),
              ),
              _buildFilterChip(
                label: 'Hard Data (OSM)',
                filterValue: 'hard_data',
                currentValue: provider.truthFilter,
                color: AppColors.truthGreen,
                onSelected: () => provider.setTruthFilter('hard_data'),
              ),
              _buildFilterChip(
                label: 'AI Projections',
                filterValue: 'ai_projection',
                currentValue: provider.truthFilter,
                color: AppColors.truthYellow,
                onSelected: () => provider.setTruthFilter('ai_projection'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip({
    required String label,
    required String filterValue,
    required String currentValue,
    Color? color,
    required VoidCallback onSelected,
  }) {
    final bool isSelected = filterValue == currentValue;

    return InkWell(
      onTap: onSelected,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected
              ? (color ?? AppColors.ultraviolet)
              : AppColors.surfaceLight,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected
                ? (color ?? AppColors.ultraviolet)
                : AppColors.mineralGreyLight,
          ),
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: isSelected ? Colors.white : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }

  Widget _buildAdvisorySectionCard(BuildContext context, AdvisorySection section) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.mineralGreyLight),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Title Row
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(9),
                decoration: BoxDecoration(
                  color: AppColors.ultraviolet.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: AppIcon(section.icon, color: AppColors.ultraviolet, size: 16),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      section.title,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      section.subtitle,
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Embed OpenStreetMap Spatial Mesh for Competitor Density Analysis
          if (section.id == 'competitor_density') ...[
            const SizedBox(height: 4),
            const OsmMapPreview(
              radiusKm: 5.0,
              locationTitle: 'Shivajinagar, Baramati Rural',
              coordinates: '18.1512° N, 74.5771° E',
              height: 270,
            ),
            const SizedBox(height: 14),
          ],

          // Items with Truth Flags
          ...section.items.map((item) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surfaceLight,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.mineralGreyLight.withOpacity(0.7)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          item.label,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      TruthFlagBadge(
                        source: item.source,
                        sourceDetail: item.sourceDetail,
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    item.value,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.info_outline, size: 11, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          item.sourceDetail,
                          style: const TextStyle(
                            fontSize: 10,
                            fontStyle: FontStyle.italic,
                            color: AppColors.textMuted,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }),

          // Strategic Recommendation Callout
          if (section.strategicRecommendation != null) ...[
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.glacierBlueSoft.withOpacity(0.6),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.glacierBlue.withOpacity(0.4)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const FaIcon(
                    FontAwesomeIcons.lightbulb,
                    size: 13,
                    color: AppColors.glacierBlueDark,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Strategy: ${section.strategicRecommendation}',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppColors.glacierBlueDark,
                        height: 1.3,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
