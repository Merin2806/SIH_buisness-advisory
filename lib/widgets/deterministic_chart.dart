import 'dart:math';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../models/advisory_models.dart';
import '../theme/app_colors.dart';

class DeterministicCapitalChart extends StatelessWidget {
  final FinancialStructuringResult financials;

  const DeterministicCapitalChart({super.key, required this.financials});

  @override
  Widget build(BuildContext context) {
    final double total = financials.totalProjectCost;
    final double loanPct = (financials.netBankLoanAmount / total) * 100;
    final double marginPct = (financials.promoterMarginAmount / total) * 100;
    final double subsidyPct = (financials.subsidyGrantAmount / total) * 100;

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
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 8,
            runSpacing: 8,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.ultraviolet.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const FaIcon(
                      FontAwesomeIcons.scaleBalanced,
                      color: AppColors.ultraviolet,
                      size: 16,
                    ),
                  ),
                  const SizedBox(width: 10),
                  const Flexible(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Capital vs. Margin',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        Text(
                          'Deterministic Debt-Equity',
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
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.glacierBlueSoft,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  '100% RECONCILED',
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    color: AppColors.glacierBlueDark,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          LayoutBuilder(
            builder: (context, constraints) {
              final isNarrow = constraints.maxWidth < 310;
              final donutWidget = SizedBox(
                width: 130,
                height: 130,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    CustomPaint(
                      size: const Size(130, 130),
                      painter: _DonutChartPainter(
                        loanPct: loanPct,
                        marginPct: marginPct,
                        subsidyPct: subsidyPct,
                      ),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          'TOTAL',
                          style: TextStyle(
                            fontSize: 10,
                            letterSpacing: 0.8,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textMuted,
                          ),
                        ),
                        Text(
                          '₹${total.toInt()}',
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );

              final legendWidget = Column(
                children: [
                  _buildLegendItem(
                    label: 'Net Bank Loan',
                    amount: financials.netBankLoanAmount,
                    pct: loanPct,
                    color: AppColors.ultraviolet,
                    tag: 'PMMY Debt',
                  ),
                  const SizedBox(height: 10),
                  _buildLegendItem(
                    label: 'Govt Capital Grant',
                    amount: financials.subsidyGrantAmount,
                    pct: subsidyPct,
                    color: AppColors.glacierBlue,
                    tag: 'NABARD Subsidy',
                  ),
                  const SizedBox(height: 10),
                  _buildLegendItem(
                    label: 'Promoter Margin',
                    amount: financials.promoterMarginAmount,
                    pct: marginPct,
                    color: const Color(0xFF4A90E2),
                    tag: 'Own Equity',
                  ),
                ],
              );

              if (isNarrow) {
                return Column(
                  children: [
                    Center(child: donutWidget),
                    const SizedBox(height: 18),
                    legendWidget,
                  ],
                );
              }

              return Row(
                children: [
                  donutWidget,
                  const SizedBox(width: 20),
                  Expanded(child: legendWidget),
                ],
              );
            },
          ),
          const SizedBox(height: 16),
          // Stacked Progress Bar Representation
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: SizedBox(
              height: 10,
              child: Row(
                children: [
                  Expanded(
                    flex: loanPct.toInt(),
                    child: Container(color: AppColors.ultraviolet),
                  ),
                  Expanded(
                    flex: subsidyPct.toInt(),
                    child: Container(color: AppColors.glacierBlue),
                  ),
                  Expanded(
                    flex: marginPct.toInt(),
                    child: Container(color: const Color(0xFF4A90E2)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem({
    required String label,
    required double amount,
    required double pct,
    required Color color,
    required String tag,
  }) {
    return Row(
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                tag,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 10,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '₹${amount.toInt()}',
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            Text(
              '${pct.toStringAsFixed(1)}%',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: color,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _DonutChartPainter extends CustomPainter {
  final double loanPct;
  final double marginPct;
  final double subsidyPct;

  _DonutChartPainter({
    required this.loanPct,
    required this.marginPct,
    required this.subsidyPct,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final double strokeWidth = 16.0;
    final Rect rect = Rect.fromLTWH(
      strokeWidth / 2,
      strokeWidth / 2,
      size.width - strokeWidth,
      size.height - strokeWidth,
    );

    final Paint loanPaint = Paint()
      ..color = AppColors.ultraviolet
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final Paint subsidyPaint = Paint()
      ..color = AppColors.glacierBlue
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final Paint marginPaint = Paint()
      ..color = const Color(0xFF4A90E2)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    // Angles in radians
    double startAngle = -pi / 2;
    const double gapAngle = 0.08; // gap between segments

    // Loan Segment
    double sweepAngleLoan = (loanPct / 100.0) * (2 * pi) - gapAngle;
    if (sweepAngleLoan > 0) {
      canvas.drawArc(rect, startAngle, sweepAngleLoan, false, loanPaint);
      startAngle += sweepAngleLoan + gapAngle;
    }

    // Subsidy Segment
    double sweepAngleSubsidy = (subsidyPct / 100.0) * (2 * pi) - gapAngle;
    if (sweepAngleSubsidy > 0) {
      canvas.drawArc(rect, startAngle, sweepAngleSubsidy, false, subsidyPaint);
      startAngle += sweepAngleSubsidy + gapAngle;
    }

    // Margin Segment
    double sweepAngleMargin = (marginPct / 100.0) * (2 * pi) - gapAngle;
    if (sweepAngleMargin > 0) {
      canvas.drawArc(rect, startAngle, sweepAngleMargin, false, marginPaint);
    }
  }

  @override
  bool shouldRepaint(covariant _DonutChartPainter oldDelegate) {
    return oldDelegate.loanPct != loanPct ||
        oldDelegate.marginPct != marginPct ||
        oldDelegate.subsidyPct != subsidyPct;
  }
}
