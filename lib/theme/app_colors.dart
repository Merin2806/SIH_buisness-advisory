import 'package:flutter/material.dart';

/// STRICT ADHERENCE COLOR PALETTE:
/// - Glacier Blue: #BFE9FF (Highlights / Info Badges / Map Accent)
/// - Ultraviolet: #6F3DFF (Primary CTA / Active States / Focus / Metrics)
/// - Mineral Grey: #B7B7B7 (Borders / Secondary Text / Neutral Surfaces)
class AppColors {
  // Official Triad
  static const Color glacierBlue = Color(0xFFBFE9FF);
  static const Color ultraviolet = Color(0xFF6F3DFF);
  static const Color mineralGrey = Color(0xFFB7B7B7);

  // Extended Tones for Readability
  static const Color ultravioletDark = Color(0xFF4D26C4);
  static const Color ultravioletLight = Color(0xFFEDE7FF);
  static const Color glacierBlueSoft = Color(0xFFEBF7FF);
  static const Color glacierBlueDark = Color(0xFF82CDFF);

  // Neutrals derived from Mineral Grey
  static const Color surfaceLight = Color(0xFFF8FAFC);
  static const Color surfaceCard = Colors.white;
  static const Color mineralGreyLight = Color(0xFFEBEBEB);
  static const Color mineralGreyBorder = Color(0xFFDCDCDC);
  static const Color textPrimary = Color(0xFF13151A);
  static const Color textSecondary = Color(0xFF585D69);
  static const Color textMuted = Color(0xFF8E95A5);

  // Truth Flagging Colors
  static const Color truthGreen = Color(0xFF10B981);
  static const Color truthGreenBg = Color(0xFFECFDF5);
  static const Color truthGreenBorder = Color(0xFFA7F3D0);

  static const Color truthYellow = Color(0xFFF59E0B);
  static const Color truthYellowBg = Color(0xFFFFFBEB);
  static const Color truthYellowBorder = Color(0xFFFDE68A);

  // Status & Accents
  static const Color alertRed = Color(0xFFEF4444);
  static const Color successGreen = Color(0xFF10B981);

  // Gradients
  static const LinearGradient ultravioletGradient = LinearGradient(
    colors: [Color(0xFF6F3DFF), Color(0xFF8254FF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient glacierGradient = LinearGradient(
    colors: [Color(0xFFBFE9FF), Color(0xFFEBF7FF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroGradient = LinearGradient(
    colors: [Color(0xFF6F3DFF), Color(0xFF4D26C4), Color(0xFFBFE9FF)],
    stops: [0.0, 0.65, 1.0],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  static const LinearGradient cardGlassGradient = LinearGradient(
    colors: [Colors.white, Color(0xFFF9FBFE)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  // Soft Shadows for Depth
  static List<BoxShadow> softShadow = [
    BoxShadow(
      color: Colors.black.withOpacity(0.04),
      blurRadius: 16,
      offset: const Offset(0, 6),
    ),
    BoxShadow(
      color: ultraviolet.withOpacity(0.04),
      blurRadius: 24,
      offset: const Offset(0, 10),
    ),
  ];

  static List<BoxShadow> elevationGlow = [
    BoxShadow(
      color: ultraviolet.withOpacity(0.28),
      blurRadius: 20,
      offset: const Offset(0, 8),
    ),
  ];
}
