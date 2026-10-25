import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import '../providers/advisory_provider.dart';
import '../theme/app_colors.dart';

class DynamicUnitEconomicsBudgeter extends StatelessWidget {
  const DynamicUnitEconomicsBudgeter({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AdvisoryProvider>(
      builder: (context, adv, child) {
        final double feedCost = adv.materialCostPerUnit;
        final double sellingPrice = adv.sellingPricePerUnit;
        final double marginPerUnit = adv.contributionMargin;
        final double marginPct = adv.contributionMarginPct;
        final double breakEvenUnits = adv.dailyBreakEvenUnits;
        final double monthlyProfit = adv.projectedMonthlyProfit;

        // Health zone logic
        final bool isSafe = marginPct >= 35.0;
        final bool isWarning = marginPct >= 20.0 && marginPct < 35.0;
        final Color zoneColor = isSafe
            ? AppColors.truthGreen
            : (isWarning ? AppColors.truthYellow : AppColors.alertRed);
        final String zoneText = isSafe
            ? 'Resilient Safe Zone'
            : (isWarning ? 'Moderate Margin Zone' : 'High Feed Risk Zone');

        return Container(
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
            border: Border.all(
              color: AppColors.glacierBlue.withOpacity(0.5),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: AppColors.glacierBlue.withOpacity(0.12),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
              ...AppColors.softShadow,
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with AI/Simulation Tag
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.glacierBlueSoft,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const FaIcon(
                            FontAwesomeIcons.sliders,
                            color: AppColors.glacierBlueDark,
                            size: 16,
                          ),
                        ),
                        const SizedBox(width: 10),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Dynamic Unit Economics Budgeter',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              Text(
                                'Interactive Local Feed & Cost Simulator',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 11,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                    decoration: BoxDecoration(
                      color: zoneColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: zoneColor.withOpacity(0.4)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 7,
                          height: 7,
                          decoration: BoxDecoration(
                            color: zoneColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 5),
                        Text(
                          zoneText,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: zoneColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Prominent Real-Time Break-Even Display Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppColors.ultraviolet.withOpacity(0.06),
                      AppColors.glacierBlue.withOpacity(0.12),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.glacierBlue.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      flex: 6,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              FaIcon(
                                FontAwesomeIcons.chartLine,
                                size: 12,
                                color: AppColors.ultraviolet,
                              ),
                              SizedBox(width: 6),
                              Text(
                                'DAILY BREAK-EVEN TARGET',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.ultraviolet,
                                  letterSpacing: 0.8,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: [
                              Text(
                                breakEvenUnits.isInfinite || breakEvenUnits > 900
                                    ? 'Unviable'
                                    : breakEvenUnits.toStringAsFixed(1),
                                style: const TextStyle(
                                  fontSize: 34,
                                  fontWeight: FontWeight.w900,
                                  color: AppColors.ultraviolet,
                                  height: 1.0,
                                ),
                              ),
                              const SizedBox(width: 6),
                              const Text(
                                'Birds / Day',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Or ~${(breakEvenUnits * 14).ceil()} Desi eggs/day to cover all fixed costs',
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      height: 56,
                      width: 1,
                      color: AppColors.mineralGreyLight,
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      flex: 4,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'NET MARGIN / UNIT',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textMuted,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '₹${marginPerUnit.toStringAsFixed(1)}',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w800,
                              color: zoneColor,
                            ),
                          ),
                          Text(
                            '${marginPct.toStringAsFixed(1)}% of Sale',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: zoneColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 22),

              // SLIDER 1: Local Material & Feed Cost
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Local Material & Feed Cost (per bird)',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Text(
                        'Drag to reflect your local dealer grain/chick rate',
                        style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.ultraviolet.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '₹${feedCost.toInt()} / bird',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: AppColors.ultraviolet,
                      ),
                    ),
                  ),
                ],
              ),
              SliderTheme(
                data: SliderTheme.of(context).copyWith(
                  activeTrackColor: AppColors.ultraviolet,
                  inactiveTrackColor: AppColors.mineralGreyLight,
                  thumbColor: AppColors.ultraviolet,
                  overlayColor: AppColors.ultraviolet.withOpacity(0.2),
                  trackHeight: 6,
                  thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 10),
                ),
                child: Slider(
                  value: feedCost,
                  min: 60.0,
                  max: 135.0,
                  divisions: 75,
                  onChanged: (val) {
                    adv.setMaterialCost(val);
                  },
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('₹60 (Subsidized Co-op)', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                    Text('₹90 (Avg Benchmark)', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                    Text('₹135 (Severe Inflation)', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                  ],
                ),
              ),

              const SizedBox(height: 18),

              // SLIDER 2: Farm-Gate Selling Price
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Farm-Gate Selling Price (per bird)',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Text(
                        'Direct consumer or local dhaba realization',
                        style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.glacierBlueSoft,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '₹${sellingPrice.toInt()} / bird',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: AppColors.glacierBlueDark,
                      ),
                    ),
                  ),
                ],
              ),
              SliderTheme(
                data: SliderTheme.of(context).copyWith(
                  activeTrackColor: AppColors.glacierBlue,
                  inactiveTrackColor: AppColors.mineralGreyLight,
                  thumbColor: AppColors.glacierBlueDark,
                  overlayColor: AppColors.glacierBlue.withOpacity(0.2),
                  trackHeight: 6,
                  thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 10),
                ),
                child: Slider(
                  value: sellingPrice,
                  min: 120.0,
                  max: 220.0,
                  divisions: 50,
                  onChanged: (val) {
                    adv.setSellingPrice(val);
                  },
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('₹120 (Wholesale Trader)', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                    Text('₹160 (Recommended)', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                    Text('₹220 (Premium Desi/Direct)', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                  ],
                ),
              ),

              const SizedBox(height: 18),
              const Divider(color: AppColors.mineralGreyLight, height: 1),
              const SizedBox(height: 14),

              // Forecast Summary Pill Box
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildQuickMetric(
                    title: 'Monthly Fixed Burden',
                    val: '₹${adv.fixedOverheadMonthly.toInt()}',
                    sub: 'Power + Vaccines + Water',
                  ),
                  _buildQuickMetric(
                    title: 'Target Sales Volume',
                    val: '${adv.targetDailyUnits} birds / day',
                    sub: 'Based on Haat demand',
                  ),
                  _buildQuickMetric(
                    title: 'Net Monthly Surplus',
                    val: '₹${monthlyProfit.toInt()}',
                    sub: 'Post-EMI cash buffer',
                    highlightColor: monthlyProfit > 0 ? AppColors.truthGreen : AppColors.alertRed,
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildQuickMetric({
    required String title,
    required String val,
    required String sub,
    Color? highlightColor,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 10,
            color: AppColors.textMuted,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          val,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: highlightColor ?? AppColors.textPrimary,
          ),
        ),
        Text(
          sub,
          style: const TextStyle(
            fontSize: 9,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }
}
