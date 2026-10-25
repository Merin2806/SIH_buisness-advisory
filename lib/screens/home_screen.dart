import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import '../data/mock_advisory_repository.dart';
import '../providers/advisory_provider.dart';
import '../theme/app_colors.dart';
import '../widgets/app_icon.dart';
import '../widgets/bhashini_mic_button.dart';

class HomeScreen extends StatefulWidget {
  final VoidCallback onStartAnalysis;

  const HomeScreen({super.key, required this.onStartAnalysis});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
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
      backgroundColor: AppColors.surfaceLight,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Hero Header with Ultraviolet and Glacier Blue accents
              _buildHeroHeader(context, provider),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Voice AI Banner with Bhashini Mic
                    _buildVoiceAssistantBanner(context, provider),

                    const SizedBox(height: 24),

                    // SECTION 1: Business Category Selection
                    _buildCategorySection(context, provider),

                    const SizedBox(height: 24),

                    // SECTION 2: Seed Capital Input
                    _buildCapitalSection(context, provider),

                    const SizedBox(height: 24),

                    // SECTION 3: GPS Telemetry Card
                    _buildGpsCard(context, provider),

                    const SizedBox(height: 32),

                    // CTA Button: Ping GPS Location & Generate Strategy
                    _buildGenerateButton(context, provider),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeroHeader(BuildContext context, AdvisoryProvider provider) {
    return Container(
      padding: const EdgeInsets.fromLTRB(22, 20, 22, 28),
      decoration: const BoxDecoration(
        gradient: AppColors.heroGradient,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Row: App Logo & Bhashini Lang Selector
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(9),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.18),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const FaIcon(
                        FontAwesomeIcons.compassDrafting,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 10),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'RURALBIZ AI',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              letterSpacing: 1.2,
                            ),
                          ),
                          Text(
                            'SIH 26091 • Rural Advisory',
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
                  ],
                ),
              ),
              const SizedBox(width: 8),
              // Language Selector Pill
              PopupMenuButton<String>(
                initialValue: provider.selectedLanguage,
                onSelected: (lang) => provider.setSelectedLanguage(lang),
                color: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                itemBuilder: (ctx) => [
                  'हिन्दी (Hindi)',
                  'मराठी (Marathi)',
                  'English',
                  'বাংলা (Bengali)',
                  'தமிழ் (Tamil)',
                ].map((l) => PopupMenuItem(value: l, child: Text(l, style: const TextStyle(fontSize: 13)))).toList(),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white30),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.translate, size: 14, color: Colors.white),
                      const SizedBox(width: 6),
                      Text(
                        provider.selectedLanguage.split(' ')[0],
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const Icon(Icons.arrow_drop_down, size: 16, color: Colors.white),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 22),
          const Text(
            'Hyper-Local Advisory &\nFinancial Structuring',
            style: TextStyle(
              fontSize: 24,
              height: 1.2,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Deterministic Mudra structuring & Geo-RAG feasibility for rural micro-entrepreneurs.',
            style: TextStyle(
              fontSize: 13,
              color: Color(0xFFD6E4F5),
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVoiceAssistantBanner(BuildContext context, AdvisoryProvider provider) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.glacierBlue.withOpacity(0.4)),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: AppColors.glacierBlue,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    const Expanded(
                      child: Text(
                        'VOICE-FIRST INTERFACE',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: AppColors.glacierBlueDark,
                          letterSpacing: 0.8,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const BhashiniMicButton(compact: true),
            ],
          ),
          const SizedBox(height: 10),
          const Text(
            'Speak your business plan',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 2),
          const Text(
            'Powered by Bhashini AI Multilingual Engine',
            style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildCategorySection(BuildContext context, AdvisoryProvider provider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                'Select Business Category',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            Text(
              'Rural MSME / Allied Agri',
              style: TextStyle(
                fontSize: 11,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        // Dropdown Container
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.mineralGreyLight),
            boxShadow: AppColors.softShadow,
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: provider.selectedCategoryId,
              isExpanded: true,
              itemHeight: 64.0,
              icon: const Icon(Icons.keyboard_arrow_down, color: AppColors.ultraviolet),
              items: MockAdvisoryRepository.categories.map((cat) {
                return DropdownMenuItem<String>(
                  value: cat.id,
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.ultraviolet.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: AppIcon(cat.icon, size: 16, color: AppColors.ultraviolet),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              cat.title,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                              ),
                            ),
                            Text(
                              cat.subtitle,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
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
                );
              }).toList(),
              onChanged: (newId) {
                if (newId != null) {
                  provider.setCategory(newId);
                  _capitalController.text = provider.seedCapital.toInt().toString();
                }
              },
            ),
          ),
        ),

        const SizedBox(height: 12),

        // Quick Category Chips
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: MockAdvisoryRepository.categories.map((cat) {
            final isSelected = provider.selectedCategoryId == cat.id;
            return ChoiceChip(
              selected: isSelected,
              showCheckmark: false,
              label: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AppIcon(
                    cat.icon,
                    size: 11,
                    color: isSelected ? Colors.white : AppColors.textSecondary,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    cat.title.split(' ')[0],
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: isSelected ? Colors.white : AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
              selectedColor: AppColors.ultraviolet,
              backgroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(
                  color: isSelected ? AppColors.ultraviolet : AppColors.mineralGreyLight,
                ),
              ),
              onSelected: (selected) {
                if (selected) {
                  provider.setCategory(cat.id);
                  _capitalController.text = provider.seedCapital.toInt().toString();
                }
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildCapitalSection(BuildContext context, AdvisoryProvider provider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Expanded(
              child: Text(
                'Planned Seed Capital',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
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
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.mineralGreyLight),
            boxShadow: AppColors.softShadow,
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.ultraviolet.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Text(
                  '₹',
                  style: TextStyle(
                    fontSize: 20,
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
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary,
                  ),
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    hintText: 'Enter seed amount',
                    hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 16),
                  ),
                  onChanged: (val) {
                    final d = double.tryParse(val);
                    if (d != null) {
                      provider.setSeedCapital(d);
                    }
                  },
                ),
              ),
              const Icon(Icons.edit_note, color: AppColors.textMuted),
            ],
          ),
        ),

        const SizedBox(height: 10),

        // Quick amount chips
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          child: Row(
            children: [25000, 50000, 100000, 200000].map((amt) {
              final isSelected = provider.seedCapital == amt.toDouble();
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: InkWell(
                  onTap: () {
                    provider.setSeedCapital(amt.toDouble());
                    _capitalController.text = amt.toString();
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.ultraviolet : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected ? AppColors.ultraviolet : AppColors.mineralGreyLight,
                      ),
                    ),
                    child: Text(
                      '₹${amt >= 100000 ? '${(amt / 100000).toStringAsFixed(0)} Lakh' : '${(amt / 1000).toInt()}k'}',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : AppColors.textSecondary,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildGpsCard(BuildContext context, AdvisoryProvider provider) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.glacierBlueSoft.withOpacity(0.6),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.glacierBlue.withOpacity(0.35)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: AppColors.glacierBlueDark.withOpacity(0.1),
                  blurRadius: 8,
                ),
              ],
            ),
            child: const FaIcon(
              FontAwesomeIcons.locationCrosshairs,
              color: AppColors.glacierBlueDark,
              size: 20,
            ),
          ),
          const SizedBox(width: 14),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        'Pushed GPS Anchor',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: AppColors.glacierBlueDark,
                        ),
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.check_circle, size: 12, color: AppColors.truthGreen),
                  ],
                ),
                SizedBox(height: 2),
                Text(
                  'Baramati Rural (18.1512° N, 74.5771° E)',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  'Bounding Box: 5.0 km OpenStreetMap Search Radius',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGenerateButton(BuildContext context, AdvisoryProvider provider) {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        gradient: AppColors.ultravioletGradient,
        borderRadius: BorderRadius.circular(18),
        boxShadow: AppColors.elevationGlow,
      ),
      child: ElevatedButton(
        onPressed: widget.onStartAnalysis,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FaIcon(FontAwesomeIcons.satelliteDish, color: Colors.white, size: 16),
            SizedBox(width: 10),
            Flexible(
              child: Text(
                'Ping GPS Location & Generate Strategy',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                  letterSpacing: 0.3,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
