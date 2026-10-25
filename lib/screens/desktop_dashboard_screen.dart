import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import '../models/advisory_models.dart';
import '../providers/advisory_provider.dart';
import '../theme/app_colors.dart';
import '../widgets/app_icon.dart';
import '../widgets/deterministic_chart.dart';
import '../widgets/dynamic_unit_economics.dart';
import '../widgets/truth_flag_badge.dart';

class DesktopDashboardScreen extends StatefulWidget {
  final VoidCallback onBackToPlanner;

  const DesktopDashboardScreen({super.key, required this.onBackToPlanner});

  @override
  State<DesktopDashboardScreen> createState() => _DesktopDashboardScreenState();
}

class _DesktopDashboardScreenState extends State<DesktopDashboardScreen> {
  // 0 = Dual Cockpit (Side-by-Side), 1 = Financial Only, 2 = Advisory Only
  int _viewMode = 0;

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AdvisoryProvider>(context);
    final financials = provider.financialResult;
    final sections = provider.advisorySections;

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: Column(
        children: [
          // Desktop Header Bar
          _buildDesktopHeader(context, provider),

          // Main Responsive Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
              child: _viewMode == 0
                  ? _buildDualCockpit(context, provider, financials, sections)
                  : (_viewMode == 1
                      ? _buildFinancialColumn(context, financials)
                      : _buildAdvisoryColumn(context, provider, sections)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDesktopHeader(BuildContext context, AdvisoryProvider provider) {
    final cat = provider.selectedCategory;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
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
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Left: Back button + Profile
          Row(
            children: [
              OutlinedButton.icon(
                onPressed: widget.onBackToPlanner,
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: const BorderSide(color: Colors.white38),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.arrow_back, size: 16),
                label: const Text(
                  'Back to Planner',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                ),
              ),
              const SizedBox(width: 20),
              Container(height: 32, width: 1, color: Colors.white24),
              const SizedBox(width: 20),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.18),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: AppIcon(cat.icon, size: 16, color: Colors.white),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            cat.title,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              '₹${provider.seedCapital.toInt()} CAPITAL',
                              style: const TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Baramati Rural (18.1512° N, 74.5771° E) | OpenStreetMap Bounding Box: 5.0 km',
                        style: TextStyle(
                          fontSize: 11,
                          color: Color(0xFFD6E4F5),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),

          // Right: View Mode Toggle & Viability Score
          Row(
            children: [
              // Dual Cockpit Switcher
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.14),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    _buildViewModeButton('Dual Cockpit', 0),
                    _buildViewModeButton('Financial Only', 1),
                    _buildViewModeButton('Advisory Only', 2),
                  ],
                ),
              ),
              const SizedBox(width: 18),
              // Viability Score
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.white30),
                ),
                child: const Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          'VIABILITY SCORE',
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFFD6E4F5),
                            letterSpacing: 0.8,
                          ),
                        ),
                        Text(
                          '88 / 100',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(width: 10),
                    Icon(Icons.verified, color: Color(0xFF10B981), size: 24),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildViewModeButton(String title, int mode) {
    final isSelected = _viewMode == mode;
    return InkWell(
      onTap: () {
        setState(() {
          _viewMode = mode;
        });
      },
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          title,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: isSelected ? AppColors.ultraviolet : Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _buildDualCockpit(
    BuildContext context,
    AdvisoryProvider provider,
    FinancialStructuringResult financials,
    List<AdvisorySection> sections,
  ) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // LEFT COLUMN: Financial Structuring Cockpit (48% width)
        Expanded(
          flex: 48,
          child: _buildFinancialColumn(context, financials),
        ),

        const SizedBox(width: 24),

        // RIGHT COLUMN: 6-Part Geo-RAG Advisory Dossier (52% width)
        Expanded(
          flex: 52,
          child: _buildAdvisoryColumn(context, provider, sections),
        ),
      ],
    );
  }

  Widget _buildFinancialColumn(
    BuildContext context,
    FinancialStructuringResult financials,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Section Header
        const Row(
          children: [
            FaIcon(FontAwesomeIcons.landmark, color: AppColors.ultraviolet, size: 16),
            SizedBox(width: 10),
            Text(
              'Deterministic Financial Structuring',
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w900,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        // Recommended Scheme Banner
        _buildSchemeCard(context, financials.scheme),

        const SizedBox(height: 18),

        // Reconciled Donut Chart (Capital vs. Margin)
        DeterministicCapitalChart(financials: financials),

        const SizedBox(height: 18),

        // Deterministic Loan Structuring Table
        _buildDeterministicDataTable(context, financials),

        const SizedBox(height: 18),

        // Moratorium Period Rationale
        _buildMoratoriumInsightCard(context, financials),

        const SizedBox(height: 18),

        // Sanction Checklist
        _buildBankChecklistCard(context),

        const SizedBox(height: 30),
      ],
    );
  }

  Widget _buildAdvisoryColumn(
    BuildContext context,
    AdvisoryProvider provider,
    List<AdvisorySection> sections,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Section Header
        const Row(
          children: [
            FaIcon(FontAwesomeIcons.chartGantt, color: AppColors.glacierBlueDark, size: 16),
            SizedBox(width: 10),
            Text(
              '6-Part Geo-RAG Advisory Dossier',
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w900,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        // Interactive Dynamic Unit Economics Budgeter
        const DynamicUnitEconomicsBudgeter(),

        const SizedBox(height: 18),

        // Truth Flagging Filter Header
        _buildTruthFilterHeader(context, provider),

        const SizedBox(height: 14),

        // 6 Report Components (rendered as responsive cards)
        ...sections.map((sec) => _buildAdvisorySectionCard(context, sec)),

        const SizedBox(height: 30),
      ],
    );
  }

  Widget _buildSchemeCard(BuildContext context, GovernmentScheme scheme) {
    return Container(
      padding: const EdgeInsets.all(20),
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.ultraviolet,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'RECOMMENDED GOVERNMENT SCHEME',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: 0.8,
                  ),
                ),
              ),
              const Row(
                children: [
                  Icon(Icons.verified, size: 14, color: AppColors.truthGreen),
                  SizedBox(width: 4),
                  Text(
                    'MoF & NABARD Linkage',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.truthGreen,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            scheme.schemeName,
            style: const TextStyle(
              fontSize: 19,
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
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.mineralGreyLight),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Deterministic Loan Structuring Data',
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
          _buildCheckItem('Project Report auto-certified by Gram-Advisor AI', true),
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

  Widget _buildTruthFilterHeader(BuildContext context, AdvisoryProvider provider) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.mineralGreyLight),
        boxShadow: AppColors.softShadow,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Row(
            children: [
              Icon(Icons.filter_alt_outlined, size: 16, color: AppColors.ultraviolet),
              SizedBox(width: 8),
              Text(
                'Truth Flagging Filter:',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          Row(
            children: [
              _buildFilterChip('All Insights', 'all', provider.truthFilter, () {
                provider.setTruthFilter('all');
              }),
              const SizedBox(width: 8),
              _buildFilterChip('Hard Data (OSM)', 'hard_data', provider.truthFilter, () {
                provider.setTruthFilter('hard_data');
              }, color: AppColors.truthGreen),
              const SizedBox(width: 8),
              _buildFilterChip('AI Projections', 'ai_projection', provider.truthFilter, () {
                provider.setTruthFilter('ai_projection');
              }, color: AppColors.truthYellow),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(
    String label,
    String filterValue,
    String currentValue,
    VoidCallback onSelected, {
    Color? color,
  }) {
    final isSelected = filterValue == currentValue;
    return InkWell(
      onTap: onSelected,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? (color ?? AppColors.ultraviolet) : AppColors.surfaceLight,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected ? (color ?? AppColors.ultraviolet) : AppColors.mineralGreyLight,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
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

          // Items Grid (2 columns on wide desktop for maximum readability)
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: section.items.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 2.3,
            ),
            itemBuilder: (context, index) {
              final item = section.items[index];
              return Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.surfaceLight,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.mineralGreyLight.withOpacity(0.7)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            item.label,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        TruthFlagBadge(
                          source: item.source,
                          sourceDetail: item.sourceDetail,
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      item.value,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),

          // Strategic Recommendation Callout
          if (section.strategicRecommendation != null) ...[
            const SizedBox(height: 12),
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
