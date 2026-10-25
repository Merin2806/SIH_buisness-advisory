import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../models/advisory_models.dart';
import '../theme/app_colors.dart';

class TruthFlagBadge extends StatelessWidget {
  final TruthSource source;
  final String? sourceDetail;
  final bool showDetailOnTap;

  const TruthFlagBadge({
    super.key,
    required this.source,
    this.sourceDetail,
    this.showDetailOnTap = true,
  });

  @override
  Widget build(BuildContext context) {
    final bool isOsm = source == TruthSource.hardDataOsm;

    final Color badgeColor = isOsm ? AppColors.truthGreen : AppColors.truthYellow;
    final Color badgeBg = isOsm ? AppColors.truthGreenBg : AppColors.truthYellowBg;
    final Color badgeBorder = isOsm ? AppColors.truthGreenBorder : AppColors.truthYellowBorder;
    final String label = isOsm ? 'Hard Data (OSM)' : 'AI Projection';

    Widget badgeWidget = Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: badgeBg,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: badgeBorder, width: 1.0),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          FaIcon(
            isOsm ? FontAwesomeIcons.database : FontAwesomeIcons.brain,
            size: 9,
            color: badgeColor,
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              color: badgeColor,
              fontSize: 10,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );

    if (showDetailOnTap && sourceDetail != null && sourceDetail!.isNotEmpty) {
      return Tooltip(
        message: 'Source: $sourceDetail',
        child: InkWell(
          borderRadius: BorderRadius.circular(6),
          onTap: () {
            ScaffoldMessenger.of(context).hideCurrentSnackBar();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                backgroundColor: isOsm ? const Color(0xFF1B4D3E) : const Color(0xFF5D4037),
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                content: Row(
                  children: [
                    FaIcon(
                      isOsm ? FontAwesomeIcons.satelliteDish : FontAwesomeIcons.robot,
                      color: Colors.white,
                      size: 14,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        '$label Truth Trace: $sourceDetail',
                        style: const TextStyle(fontSize: 12, color: Colors.white),
                      ),
                    ),
                  ],
                ),
                duration: const Duration(seconds: 3),
              ),
            );
          },
          child: badgeWidget,
        ),
      );
    }

    return badgeWidget;
  }
}
