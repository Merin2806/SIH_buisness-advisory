import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'providers/advisory_provider.dart';
import 'screens/dashboard_screen.dart';
import 'screens/desktop_dashboard_screen.dart';
import 'screens/desktop_home_screen.dart';
import 'screens/home_screen.dart';
import 'screens/loading_screen.dart';
import 'theme/app_colors.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AdvisoryProvider()),
      ],
      child: const SihAdvisoryApp(),
    ),
  );
}

class SihAdvisoryApp extends StatelessWidget {
  const SihAdvisoryApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RuralBiz AI | SIH 26091',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF1F5F9),
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.ultraviolet,
          primary: AppColors.ultraviolet,
          secondary: AppColors.glacierBlue,
          surface: Colors.white,
          onPrimary: Colors.white,
          onSecondary: Colors.white,
        ),
        fontFamily: GoogleFonts.inter().fontFamily,
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 0,
            backgroundColor: AppColors.ultraviolet,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        ),
      ),
      home: const MainAppNavigator(),
    );
  }
}

class MainAppNavigator extends StatefulWidget {
  const MainAppNavigator({super.key});

  @override
  State<MainAppNavigator> createState() => _MainAppNavigatorState();
}

class _MainAppNavigatorState extends State<MainAppNavigator> {
  // Navigation states: 'home', 'loading', 'dashboard'
  String _currentScreen = 'home';

  // Toggle between native responsive desktop vs phone simulator
  bool _forceMobileView = false;

  void _startGeoRagProcess() {
    final provider = Provider.of<AdvisoryProvider>(context, listen: false);
    setState(() {
      _currentScreen = 'loading';
    });

    provider.startGeoRagPipeline(
      onComplete: () {
        if (mounted) {
          setState(() {
            _currentScreen = 'dashboard';
          });
        }
      },
    );
  }

  void _returnToHome() {
    setState(() {
      _currentScreen = 'home';
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final bool isWideScreen = screenWidth >= 960;
    final bool renderDesktopMode = isWideScreen && !_forceMobileView;

    Widget activeWidget;

    if (renderDesktopMode) {
      // DESKTOP / WEB EXPANSIVE VIEW
      switch (_currentScreen) {
        case 'loading':
          activeWidget = const LoadingScreen();
          break;
        case 'dashboard':
          activeWidget = DesktopDashboardScreen(onBackToPlanner: _returnToHome);
          break;
        case 'home':
        default:
          activeWidget = DesktopHomeScreen(onStartAnalysis: _startGeoRagProcess);
          break;
      }
    } else {
      // MOBILE PHONE VIEW
      switch (_currentScreen) {
        case 'loading':
          activeWidget = const LoadingScreen();
          break;
        case 'dashboard':
          activeWidget = DashboardScreen(onBackToPlanner: _returnToHome);
          break;
        case 'home':
        default:
          activeWidget = HomeScreen(onStartAnalysis: _startGeoRagProcess);
          break;
      }
    }

    // If on wide screen and force mobile view is active, wrap in realistic phone container
    if (isWideScreen && _forceMobileView) {
      return Scaffold(
        backgroundColor: const Color(0xFF0F172A),
        body: Stack(
          children: [
            Center(
              child: Container(
                width: 420,
                height: MediaQuery.of(context).size.height * 0.94,
                decoration: BoxDecoration(
                  color: AppColors.surfaceLight,
                  borderRadius: BorderRadius.circular(36),
                  border: Border.all(color: Colors.white24, width: 4),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.5),
                      blurRadius: 40,
                      offset: const Offset(0, 16),
                    ),
                  ],
                ),
                clipBehavior: Clip.antiAlias,
                child: activeWidget,
              ),
            ),
            _buildDeviceSwitcherFloatingPill(isWideScreen),
          ],
        ),
      );
    }

    // Default: Full expansive screen layout
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: Stack(
        children: [
          Positioned.fill(child: activeWidget),
          if (isWideScreen && _currentScreen != 'loading')
            _buildDeviceSwitcherFloatingPill(isWideScreen),
        ],
      ),
    );
  }

  Widget _buildDeviceSwitcherFloatingPill(bool isWideScreen) {
    return Positioned(
      bottom: 20,
      right: 24,
      child: Material(
        elevation: 12,
        borderRadius: BorderRadius.circular(30),
        color: const Color(0xFF1E293B),
        child: InkWell(
          onTap: () {
            setState(() {
              _forceMobileView = !_forceMobileView;
            });
          },
          borderRadius: BorderRadius.circular(30),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(30),
              border: Border.all(color: AppColors.glacierBlue.withOpacity(0.5)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  _forceMobileView ? Icons.laptop_mac : Icons.phone_iphone,
                  size: 16,
                  color: AppColors.glacierBlue,
                ),
                const SizedBox(width: 8),
                Text(
                  _forceMobileView ? 'Switch to Desktop Web View' : 'Preview Phone Simulator',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
