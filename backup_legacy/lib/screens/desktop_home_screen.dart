import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import '../data/mock_advisory_repository.dart';
import '../providers/advisory_provider.dart';
import '../theme/app_colors.dart';
import '../widgets/app_icon.dart';
import '../widgets/bhashini_mic_button.dart';
import '../widgets/osm_map_preview.dart';

class DesktopHomeScreen extends StatefulWidget {
  final VoidCallback onStartAnalysis;

  const DesktopHomeScreen({super.key, required this.onStartAnalysis});

  @override
  State<DesktopHomeScreen> createState() => _DesktopHomeScreenState();
}

class _DesktopHomeScreenState extends State<DesktopHomeScreen> {
  late TextEditingController _capitalController;

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<AdvisoryProvider>(context, listen: false);
    _capitalController = TextEditingController(
      text: provider.seedCapital.toInt().toString(),
    );
  }

  @override
  void dispose() {
    _capitalController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AdvisoryProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: Column(
        children: [
          // Desktop Top Navbar
          _buildDesktopNavbar(context, provider),

          // Main 2-Column Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Left Column: Interactive Planner Form (Width: 460)
                  SizedBox(
                    width: 480,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _buildHeroGreetingCard(context, provider),
                        const SizedBox(height: 20),
                        _buildCategoryGrid(context, provider),
                        const SizedBox(height: 20),
                        _buildCapitalSliderCard(context, provider),
                        const SizedBox(height: 20),
                        _buildGpsAnchorCard(context, provider),
                        const SizedBox(height: 24),
                        _buildGenerateCta(context, provider),
                        const SizedBox(height: 30),
                      ],
                    ),
                  ),

                  const SizedBox(width: 28),

                  // Right Column: OpenStreetMap GIS Spatial Intelligence Mesh (Flexible)
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Map Canvas Container
                        const SizedBox(
                          height: 480,
                          child: OsmMapPreview(
                            radiusKm: 5.0,
                            locationTitle: 'Shivajinagar Gram Panchayat, Baramati',
                            coordinates: '18.1512° N, 74.5771° E',
                          ),
                        ),

                        const SizedBox(height: 20),

                        // Geo-RAG Pre-Sanction Highlights Grid
                        Row(
                          children: [
                            Expanded(
                              child: _buildMetricTile(
                                icon: FontAwesomeIcons.hospital,
                                color: AppColors.truthGreen,
                                title: '2 Vet Clinics',
                                subtitle: 'Within 3.4 km radius',
                                tag: 'HARD DATA (OSM)',
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: _buildMetricTile(
                                icon: FontAwesomeIcons.store,
                                color: AppColors.glacierBlueDark,
                                title: '2 Weekly Haats',
                                subtitle: 'Tues & Sat cash bazaars',
                                tag: 'HARD DATA (OSM)',
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: _buildMetricTile(
                                icon: FontAwesomeIcons.shieldHalved,
                                color: AppColors.ultraviolet,
                                title: 'Zero Collateral',
                                subtitle: 'CGTMSE Credit Guarantee',
                                tag: 'MUDRA SHISHU',
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 16),

                        // AI Processing Architecture Note
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.mineralGreyLight),
                            boxShadow: AppColors.softShadow,
                          ),
                          child: const Row(
                            children: [
                              FaIcon(
                                FontAwesomeIcons.microchip,
                                color: AppColors.ultraviolet,
                                size: 18,
                              ),
                              SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Deterministic Subvention Engine + Geo-RAG Spatial Pipeline',
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.textPrimary,
                                      ),
                                    ),
                                    SizedBox(height: 2),
                                    Text(
                                      'Synthesizes OpenStreetMap nodes, NABARD guidelines, and micro-climate parameters to eliminate guesswork for rural entrepreneurs.',
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
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDesktopNavbar(BuildContext context, AdvisoryProvider provider) {
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
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const FaIcon(
                  FontAwesomeIcons.compassDrafting,
                  color: Colors.white,
                  size: 20,
                ),
              ),
              const SizedBox(width: 14),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'GRAM-ADVISOR AI',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      letterSpacing: 1.2,
                    ),
                  ),
                  Text(
                    'AI-Driven Hyper-Local Business Advisory & Financial Structuring',
                    style: TextStyle(
                      fontSize: 11,
                      color: Color(0xFFD6E4F5),
                    ),
                  ),
                ],
              ),
            ],
          ),

          // Center Telemetry Status Ticker
          Row(
            children: [
              _buildStatusPill(
                icon: Icons.hub_outlined,
                label: 'GEO-RAG MESH: ACTIVE',
                color: const Color(0xFF10B981),
              ),
              const SizedBox(width: 10),
              _buildStatusPill(
                icon: Icons.satellite_alt_outlined,
                label: 'OSM NODE #9281',
                color: AppColors.glacierBlue,
              ),
              const SizedBox(width: 10),
              _buildStatusPill(
                icon: Icons.psychology,
                label: 'LLAMA 3 8B RAG',
                color: const Color(0xFFF59E0B),
              ),
            ],
          ),

          // Right Controls: Language Selector & Hackathon Badge
          Row(
            children: [
              PopupMenuButton<String>(
                initialValue: provider.selectedLanguage,
                onSelected: (lang) => provider.setSelectedLanguage(lang),
                color: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.16),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white30),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.translate, size: 14, color: Colors.white),
                      const SizedBox(width: 6),
                      Text(
                        provider.selectedLanguage,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const Icon(Icons.arrow_drop_down, size: 16, color: Colors.white),
                    ],
                  ),
                ),
                itemBuilder: (ctx) => [
                  'हिन्दी (Hindi)',
                  'मराठी (Marathi)',
                  'English',
                  'বাংলা (Bengali)',
                  'தமிழ் (Tamil)',
                ].map((l) => PopupMenuItem(value: l, child: Text(l, style: const TextStyle(fontSize: 13)))).toList(),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusPill({
    required IconData icon,
    required String label,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: color,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroGreetingCard(BuildContext context, AdvisoryProvider provider) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.ultraviolet.withOpacity(0.08),
            AppColors.glacierBlue.withOpacity(0.12),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.glacierBlue.withOpacity(0.35)),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.record_voice_over_outlined, color: AppColors.ultraviolet, size: 18),
                  SizedBox(width: 8),
                  Text(
                    'BHASHINI VOICE INTERFACE',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: AppColors.ultraviolet,
                      letterSpacing: 0.8,
                    ),
                  ),
                ],
              ),
              const BhashiniMicButton(),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'Rural Micro-Enterprise Strategy',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Speak in your native dialect or configure seed capital below to extract hyper-local market intelligence and deterministic credit structuring.',
            style: TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryGrid(BuildContext context, AdvisoryProvider provider) {
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
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Business Category Selection',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                'Rural MSME / Agri-Allied',
                style: TextStyle(fontSize: 11, color: AppColors.textMuted),
              ),
            ],
          ),
          const SizedBox(height: 14),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: MockAdvisoryRepository.categories.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 1.8,
            ),
            itemBuilder: (context, index) {
              final cat = MockAdvisoryRepository.categories[index];
              final isSelected = provider.selectedCategoryId == cat.id;

              return InkWell(
                onTap: () {
                  provider.setCategory(cat.id);
                  _capitalController.text = provider.seedCapital.toInt().toString();
                },
                borderRadius: BorderRadius.circular(14),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.ultraviolet.withOpacity(0.08)
                        : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isSelected ? AppColors.ultraviolet : AppColors.mineralGreyLight,
                      width: isSelected ? 2.0 : 1.0,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.ultraviolet : Colors.white,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: AppIcon(
                          cat.icon,
                          size: 16,
                          color: isSelected ? Colors.white : AppColors.ultraviolet,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              cat.title.split(' ')[0],
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w800,
                                color: isSelected ? AppColors.ultraviolet : AppColors.textPrimary,
                              ),
                            ),
                            Text(
                              '₹${(cat.suggestedCapital / 1000).toInt()}k suggested',
                              style: const TextStyle(
                                fontSize: 10,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildCapitalSliderCard(BuildContext context, AdvisoryProvider provider) {
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Planned Seed Capital',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.glacierBlueSoft,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  provider.seedCapital <= 50000 ? 'PMMY SHISHU TIER' : 'PMMY KISHORE TIER',
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: AppColors.glacierBlueDark,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Numeric Display Row
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.ultraviolet.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Text(
                  '₹',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    color: AppColors.ultraviolet,
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: TextField(
                  controller: _capitalController,
                  keyboardType: TextInputType.number,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    color: AppColors.textPrimary,
                  ),
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    hintText: 'Enter seed amount',
                  ),
                  onChanged: (val) {
                    final d = double.tryParse(val);
                    if (d != null) {
                      provider.setSeedCapital(d);
                    }
                  },
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Preset Chips
          Row(
            children: [25000, 50000, 100000, 200000].map((amt) {
              final isSelected = provider.seedCapital == amt.toDouble();
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: InkWell(
                  onTap: () {
                    provider.setSeedCapital(amt.toDouble());
                    _capitalController.text = amt.toString();
                  },
                  borderRadius: BorderRadius.circular(14),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.ultraviolet : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isSelected ? AppColors.ultraviolet : AppColors.mineralGreyLight,
                      ),
                    ),
                    child: Text(
                      '₹${amt >= 100000 ? '${(amt / 100000).toStringAsFixed(0)} Lakh' : '${(amt / 1000).toInt()}k'}',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : AppColors.textSecondary,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildGpsAnchorCard(BuildContext context, AdvisoryProvider provider) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.glacierBlueSoft.withOpacity(0.6),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.glacierBlue.withOpacity(0.35)),
      ),
      child: const Row(
        children: [
          FaIcon(FontAwesomeIcons.locationCrosshairs, color: AppColors.glacierBlueDark, size: 22),
          SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Anchored Location Coordinates',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppColors.glacierBlueDark,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Shivajinagar Gram Panchayat, Baramati Rural',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  'Bounding Box: 5.0 km OpenStreetMap Search Radius (18.1512° N, 74.5771° E)',
                  style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGenerateCta(BuildContext context, AdvisoryProvider provider) {
    return Container(
      height: 56,
      decoration: BoxDecoration(
        gradient: AppColors.ultravioletGradient,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.elevationGlow,
      ),
      child: ElevatedButton(
        onPressed: widget.onStartAnalysis,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FaIcon(FontAwesomeIcons.satelliteDish, color: Colors.white, size: 18),
            SizedBox(width: 12),
            Text(
              'Ping GPS Location & Generate Strategy',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: Colors.white,
                letterSpacing: 0.3,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricTile({
    required dynamic icon,
    required Color color,
    required String title,
    required String subtitle,
    required String tag,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.mineralGreyLight),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: AppIcon(icon, color: color, size: 14),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  tag,
                  style: TextStyle(
                    fontSize: 8,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w900,
              color: AppColors.textPrimary,
            ),
          ),
          Text(
            subtitle,
            style: const TextStyle(
              fontSize: 11,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
