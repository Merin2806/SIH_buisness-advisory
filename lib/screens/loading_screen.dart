import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import '../providers/advisory_provider.dart';
import '../theme/app_colors.dart';

class LoadingScreen extends StatefulWidget {
  const LoadingScreen({super.key});

  @override
  State<LoadingScreen> createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<LoadingScreen> {
  final ScrollController _terminalScrollController = ScrollController();

  @override
  void dispose() {
    _terminalScrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    if (_terminalScrollController.hasClients) {
      _terminalScrollController.animateTo(
        _terminalScrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AdvisoryProvider>(context);

    // Schedule scroll to bottom as logs appear
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());

    final double progress = provider.progress.clamp(0.0, 1.0);
    final int percentInt = (progress * 100).toInt();

    return Scaffold(
      backgroundColor: const Color(0xFF141A24),
      body: Stack(
        children: [
          // Glacier Blue & Ultraviolet soft gradient background glow
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 320,
              height: 320,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.glacierBlue.withOpacity(0.2),
              ),
            ),
          ),
          Positioned(
            bottom: -80,
            left: -80,
            child: Container(
              width: 280,
              height: 280,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.ultraviolet.withOpacity(0.25),
              ),
            ),
          ),

          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Top Tech Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.glacierBlue.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: AppColors.glacierBlue.withOpacity(0.4)),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.hub_outlined, size: 12, color: AppColors.glacierBlue),
                                SizedBox(width: 6),
                                Text(
                                  'GEO-RAG PIPELINE ACTIVE',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.glacierBlue,
                                    letterSpacing: 0.8,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const Text(
                        'LAT: 18.1512° N',
                        style: TextStyle(
                          fontSize: 11,
                          fontFamily: 'monospace',
                          color: AppColors.mineralGrey,
                        ),
                      ),
                    ],
                  ),

                  const Spacer(flex: 1),

                  // Circular Progress Indicator in Ultraviolet with Percentage
                  Center(
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Glow ring
                        Container(
                          width: 140,
                          height: 140,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.ultraviolet.withOpacity(0.4),
                                blurRadius: 30,
                                spreadRadius: 4,
                              ),
                            ],
                          ),
                        ),
                        // Outer Glacier blue track
                        SizedBox(
                          width: 130,
                          height: 130,
                          child: CircularProgressIndicator(
                            value: 1.0,
                            strokeWidth: 4,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              AppColors.glacierBlue.withOpacity(0.18),
                            ),
                          ),
                        ),
                        // Ultraviolet Progress Indicator
                        SizedBox(
                          width: 130,
                          height: 130,
                          child: CircularProgressIndicator(
                            value: progress,
                            strokeWidth: 8,
                            strokeCap: StrokeCap.round,
                            valueColor: const AlwaysStoppedAnimation<Color>(
                              AppColors.ultravioletLight,
                            ),
                          ),
                        ),
                        // Center readout
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              '$percentInt%',
                              style: const TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                letterSpacing: 0.5,
                              ),
                            ),
                            const Text(
                              'SYNTHESIZING',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: AppColors.glacierBlue,
                                letterSpacing: 1.2,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Stage Title
                  Center(
                    child: Column(
                      children: [
                        Text(
                          provider.activeLogs.isEmpty
                              ? 'Initializing Spatial Mesh...'
                              : provider.activeLogs.last,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                            letterSpacing: 0.2,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'OpenStreetMap Overpass API + Llama 3 8B Micro-RAG Engine',
                          style: TextStyle(
                            fontSize: 11,
                            color: AppColors.mineralGrey,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const Spacer(flex: 1),

                  // Simulated Technical Console / Terminal Box
                  Container(
                    height: 210,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0C1017),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: AppColors.glacierBlue.withOpacity(0.3),
                        width: 1.2,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.4),
                          blurRadius: 18,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Terminal Bar
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(width: 9, height: 9, decoration: const BoxDecoration(color: Color(0xFFFF5F56), shape: BoxShape.circle)),
                                const SizedBox(width: 6),
                                Container(width: 9, height: 9, decoration: const BoxDecoration(color: Color(0xFFFFBD2E), shape: BoxShape.circle)),
                                const SizedBox(width: 6),
                                Container(width: 9, height: 9, decoration: const BoxDecoration(color: Color(0xFF27C93F), shape: BoxShape.circle)),
                                const SizedBox(width: 10),
                                const Text(
                                  'fastapi_rag_telemetry.log',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontFamily: 'monospace',
                                    color: AppColors.mineralGrey,
                                  ),
                                ),
                              ],
                            ),
                            const FaIcon(
                              FontAwesomeIcons.terminal,
                              size: 11,
                              color: AppColors.mineralGrey,
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        const Divider(color: Color(0xFF222938), height: 1),
                        const SizedBox(height: 8),

                        // Console Log Stream
                        Expanded(
                          child: ListView.builder(
                            controller: _terminalScrollController,
                            physics: const ClampingScrollPhysics(),
                            itemCount: provider.activeLogs.length,
                            itemBuilder: (context, index) {
                              final log = provider.activeLogs[index];
                              final isCurrent = index == provider.activeLogs.length - 1;

                              return Padding(
                                padding: const EdgeInsets.symmetric(vertical: 2.5),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '› ',
                                      style: TextStyle(
                                        fontFamily: 'monospace',
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: isCurrent
                                            ? AppColors.glacierBlue
                                            : AppColors.ultravioletLight,
                                      ),
                                    ),
                                    Expanded(
                                      child: Text(
                                        log,
                                        style: TextStyle(
                                          fontFamily: 'monospace',
                                          fontSize: 11,
                                          height: 1.3,
                                          color: isCurrent
                                              ? const Color(0xFF7DE6B8)
                                              : const Color(0xFFC7CBD4),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
