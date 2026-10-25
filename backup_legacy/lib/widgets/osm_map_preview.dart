import 'dart:math';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../theme/app_colors.dart';
import 'app_icon.dart';

class OsmMapPreview extends StatefulWidget {
  final double radiusKm;
  final String locationTitle;
  final String coordinates;

  const OsmMapPreview({
    super.key,
    this.radiusKm = 5.0,
    this.locationTitle = 'Shivajinagar, Baramati Rural',
    this.coordinates = '18.1512° N, 74.5771° E',
  });

  @override
  State<OsmMapPreview> createState() => _OsmMapPreviewState();
}

class _OsmMapPreviewState extends State<OsmMapPreview>
    with SingleTickerProviderStateMixin {
  late AnimationController _radarController;
  int? _selectedPinIndex;

  final List<MapPinData> _pins = [
    MapPinData(
      title: 'Your Planned Poultry Shed',
      subtitle: 'Anchor Coordinate (0.0 km)',
      offset: const Offset(0.0, 0.0),
      color: AppColors.ultraviolet,
      icon: FontAwesomeIcons.locationDot,
      isCenter: true,
      tag: 'Project Site',
    ),
    MapPinData(
      title: 'Baramati Pashu Chikitsalay',
      subtitle: 'Govt Veterinary Clinic (1.4 km NE)',
      offset: const Offset(0.35, -0.4),
      color: AppColors.truthGreen,
      icon: FontAwesomeIcons.hospital,
      tag: 'OSM Amenity: Veterinary',
    ),
    MapPinData(
      title: 'Shivajinagar Bi-Weekly Haat',
      subtitle: 'Rural Produce Market (2.1 km SE)',
      offset: const Offset(0.5, 0.45),
      color: AppColors.glacierBlueDark,
      icon: FontAwesomeIcons.store,
      tag: 'OSM Amenity: Marketplace',
    ),
    MapPinData(
      title: 'SH-10 Highway Feeder Road',
      subtitle: 'Paved all-weather road (450m W)',
      offset: const Offset(-0.25, 0.1),
      color: const Color(0xFFD97706),
      icon: FontAwesomeIcons.road,
      tag: 'OSM Highway: Secondary',
    ),
    MapPinData(
      title: 'Commercial Layer Farm (Competitor)',
      subtitle: '12,000 birds capacity (3.8 km NW)',
      offset: const Offset(-0.55, -0.6),
      color: const Color(0xFFDC2626),
      icon: FontAwesomeIcons.industry,
      tag: 'OSM Building: Agriculture',
    ),
    MapPinData(
      title: 'Baramati Agro Grape Cluster',
      subtitle: '6 Vineyards for Compost (3.2 km S)',
      offset: const Offset(0.1, 0.7),
      color: const Color(0xFF059669),
      icon: FontAwesomeIcons.wheatAwn,
      tag: 'OSM Landuse: Vineyard',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _radarController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat();
  }

  @override
  void dispose() {
    _radarController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0F1522),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.glacierBlue.withOpacity(0.3)),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Map Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
            decoration: const BoxDecoration(
              color: Color(0xFF161F30),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(24),
                topRight: Radius.circular(24),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Color(0xFF10B981),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'OPENSTREETMAP SPATIAL MESH',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.glacierBlue.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: AppColors.glacierBlue.withOpacity(0.3)),
                  ),
                  child: Text(
                    'RADIUS: ${widget.radiusKm} KM',
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: AppColors.glacierBlue,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Radar Canvas & Map Pin Overlays
          Expanded(
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Radar Painter (grid rings, lat/lon lines, radar beam)
                AnimatedBuilder(
                  animation: _radarController,
                  builder: (context, child) {
                    return CustomPaint(
                      size: Size.infinite,
                      painter: _RadarMapPainter(
                        animationValue: _radarController.value,
                      ),
                    );
                  },
                ),

                // Pins layout
                LayoutBuilder(
                  builder: (context, constraints) {
                    final centerX = constraints.maxWidth / 2;
                    final centerY = constraints.maxHeight / 2;
                    final radiusScale = min(centerX, centerY) * 0.85;

                    return Stack(
                      children: List.generate(_pins.length, (index) {
                        final pin = _pins[index];
                        final x = centerX + (pin.offset.dx * radiusScale);
                        final y = centerY + (pin.offset.dy * radiusScale);
                        final isSelected = _selectedPinIndex == index;

                        return Positioned(
                          left: x - (isSelected ? 20 : 16),
                          top: y - (isSelected ? 20 : 16),
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                _selectedPinIndex = isSelected ? null : index;
                              });
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: EdgeInsets.all(isSelected ? 9 : 7),
                              decoration: BoxDecoration(
                                color: pin.color,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: Colors.white,
                                  width: isSelected ? 2.5 : 1.5,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: pin.color.withOpacity(0.5),
                                    blurRadius: isSelected ? 16 : 8,
                                    spreadRadius: isSelected ? 2 : 0,
                                  ),
                                ],
                              ),
                              child: AppIcon(
                                pin.icon,
                                size: isSelected ? 15 : 12,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        );
                      }),
                    );
                  },
                ),

                // Coordinate Crosshair Legend (Bottom Left)
                Positioned(
                  bottom: 12,
                  left: 14,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.locationTitle,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          widget.coordinates,
                          style: const TextStyle(
                            fontSize: 10,
                            fontFamily: 'monospace',
                            color: AppColors.glacierBlue,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Selected Pin Callout Banner (Top/Center)
                if (_selectedPinIndex != null)
                  Positioned(
                    top: 14,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _pins[_selectedPinIndex!].color.withOpacity(0.6),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.4),
                            blurRadius: 12,
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  color: _pins[_selectedPinIndex!].color,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                _pins[_selectedPinIndex!].title,
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            _pins[_selectedPinIndex!].subtitle,
                            style: const TextStyle(
                              fontSize: 10,
                              color: Color(0xFF94A3B8),
                            ),
                          ),
                          Text(
                            _pins[_selectedPinIndex!].tag,
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: _pins[_selectedPinIndex!].color,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),

          // Map Footer Badges
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: const BoxDecoration(
              color: Color(0xFF131A29),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(24),
                bottomRight: Radius.circular(24),
              ),
            ),
            child: Wrap(
              spacing: 12,
              runSpacing: 6,
              alignment: WrapAlignment.center,
              children: [
                _buildMapLegend('Poultry Site', AppColors.ultraviolet),
                _buildMapLegend('Vet Clinics (2)', AppColors.truthGreen),
                _buildMapLegend('Haat Bazaars (2)', AppColors.glacierBlueDark),
                _buildMapLegend('SH-10 Highway', const Color(0xFFD97706)),
                _buildMapLegend('Competitor Farm (1)', const Color(0xFFDC2626)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMapLegend(String label, Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 7,
          height: 7,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 5),
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            color: Color(0xFFCBD5E1),
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}

class MapPinData {
  final String title;
  final String subtitle;
  final Offset offset;
  final Color color;
  final dynamic icon;
  final bool isCenter;
  final String tag;

  MapPinData({
    required this.title,
    required this.subtitle,
    required this.offset,
    required this.color,
    required this.icon,
    this.isCenter = false,
    required this.tag,
  });
}

class _RadarMapPainter extends CustomPainter {
  final double animationValue;

  _RadarMapPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final maxRadius = min(size.width, size.height) * 0.42;

    // Grid lines Paint
    final gridPaint = Paint()
      ..color = const Color(0xFF1E293B)
      ..strokeWidth = 1.0;

    // Subtle grid background
    const int gridCount = 8;
    for (int i = 0; i <= gridCount; i++) {
      final x = (size.width / gridCount) * i;
      final y = (size.height / gridCount) * i;
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    // Concentric Range Rings (1km, 2km, 3km, 5km)
    final ringPaint = Paint()
      ..color = AppColors.glacierBlue.withOpacity(0.2)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;

    for (double f in [0.25, 0.5, 0.75, 1.0]) {
      canvas.drawCircle(center, maxRadius * f, ringPaint);
    }

    // Crosshairs
    final crosshairPaint = Paint()
      ..color = AppColors.glacierBlue.withOpacity(0.3)
      ..strokeWidth = 1.0;
    canvas.drawLine(
      Offset(center.dx - maxRadius, center.dy),
      Offset(center.dx + maxRadius, center.dy),
      crosshairPaint,
    );
    canvas.drawLine(
      Offset(center.dx, center.dy - maxRadius),
      Offset(center.dx, center.dy + maxRadius),
      crosshairPaint,
    );

    // Rotating Radar Beam Sweep
    final sweepAngle = animationValue * 2 * pi;
    final sweepPaint = Paint()
      ..shader = SweepGradient(
        center: FractionalOffset(center.dx / size.width, center.dy / size.height),
        startAngle: sweepAngle - 0.5,
        endAngle: sweepAngle,
        colors: [
          Colors.transparent,
          AppColors.glacierBlue.withOpacity(0.22),
        ],
      ).createShader(Rect.fromCircle(center: center, radius: maxRadius));

    canvas.drawCircle(center, maxRadius, sweepPaint);

    // Radar Sweeping line
    final linePaint = Paint()
      ..color = AppColors.glacierBlue
      ..strokeWidth = 1.8;
    final lineEnd = Offset(
      center.dx + maxRadius * cos(sweepAngle),
      center.dy + maxRadius * sin(sweepAngle),
    );
    canvas.drawLine(center, lineEnd, linePaint);
  }

  @override
  bool shouldRepaint(covariant _RadarMapPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}
