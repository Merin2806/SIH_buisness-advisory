import 'package:flutter/material.dart';

/// STRICT ADHERENCE COLOR PALETTE:
/// - Glacier Blue: #71A6D2 (Primary Accent / Highlights / Soft Backgrounds)
/// - Ultraviolet: #5F4B8B (Primary Brand / CTA Buttons / Headers / Active States)
/// - Mineral Grey: #B5B5B7 (Backgrounds / Text / Secondary Elements / Cards)
class AppColors {
  // Brand Triad
  static const Color ultraviolet = Color(0xFF5F4B8B);
  static const Color glacierBlue = Color(0xFF71A6D2);
  static const Color mineralGrey = Color(0xFFB5B5B7);

  // Extended Tones for High Contrast & Premium Readability
  static const Color ultravioletDark = Color(0xFF3F3060);
  static const Color ultravioletLight = Color(0xFF8672B5);
  static const Color glacierBlueSoft = Color(0xFFE8F1F9);
  static const Color glacierBlueDark = Color(0xFF437AA8);

  // Neutrals derived from Mineral Grey
  static const Color surfaceLight = Color(0xFFF6F7FA);
  static const Color surfaceCard = Colors.white;
  static const Color mineralGreyLight = Color(0xFFE5E5E8);
  static const Color textPrimary = Color(0xFF26262B);
  static const Color textSecondary = Color(0xFF5E6068);
  static const Color textMuted = Color(0xFF8C8E96);

  // Truth Flagging Colors
  static const Color truthGreen = Color(0xFF1E824C);
  static const Color truthGreenBg = Color(0xFFE6F4EA);
  static const Color truthGreenBorder = Color(0xFFA6E0B9);

  static const Color truthYellow = Color(0xFFB78103);
  static const Color truthYellowBg = Color(0xFFFFF8E1);
  static const Color truthYellowBorder = Color(0xFFFFE082);

  // Status & Accents
  static const Color alertRed = Color(0xFFD9534F);
  static const Color successGreen = Color(0xFF28A745);

  // Gradients
  static const LinearGradient ultravioletGradient = LinearGradient(
    colors: [Color(0xFF5F4B8B), Color(0xFF7A64A8)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient glacierGradient = LinearGradient(
    colors: [Color(0xFF71A6D2), Color(0xFF8CBDE6)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroGradient = LinearGradient(
    colors: [Color(0xFF5F4B8B), Color(0xFF4A3870), Color(0xFF71A6D2)],
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
