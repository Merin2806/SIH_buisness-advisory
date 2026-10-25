import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:sih_business_advisory/main.dart';
import 'package:sih_business_advisory/providers/advisory_provider.dart';
import 'package:sih_business_advisory/screens/dashboard_screen.dart';

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  testWidgets('SIH Advisory App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AdvisoryProvider()),
        ],
        child: const SihAdvisoryApp(),
      ),
    );
    await tester.pump();

    expect(find.byType(SihAdvisoryApp), findsOneWidget);
  });

  testWidgets('Responsive layouts render cleanly across all screen widths', (WidgetTester tester) async {
    final List<double> targetWidths = [320.0, 360.0, 375.0, 390.0, 414.0, 430.0, 600.0, 768.0];

    for (final width in targetWidths) {
      tester.view.physicalSize = Size(width * 2.0, 800.0 * 2.0);
      tester.view.devicePixelRatio = 2.0;

      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider(create: (_) => AdvisoryProvider()),
          ],
          child: const SihAdvisoryApp(),
        ),
      );
      await tester.pump();

      expect(find.byType(SihAdvisoryApp), findsOneWidget);
      expect(tester.takeException(), isNull, reason: 'No RenderFlex overflow on home at width $width px');
    }
  });

  testWidgets('DashboardScreen Financial & Advisory tabs render cleanly across all screen widths', (WidgetTester tester) async {
    final List<double> targetWidths = [320.0, 360.0, 375.0, 390.0, 414.0, 430.0, 600.0, 768.0];

    for (final width in targetWidths) {
      for (final activeTab in [0, 1]) {
        tester.view.physicalSize = Size(width * 2.0, 900.0 * 2.0);
        tester.view.devicePixelRatio = 2.0;

        final provider = AdvisoryProvider();
        provider.setActiveTab(activeTab);

        await tester.pumpWidget(
          MaterialApp(
            home: ChangeNotifierProvider<AdvisoryProvider>.value(
              value: provider,
              child: DashboardScreen(onBackToPlanner: () {}),
            ),
          ),
        );
        await tester.pump();

        expect(find.byType(DashboardScreen), findsOneWidget);
        expect(
          tester.takeException(),
          isNull,
          reason: 'No RenderFlex overflow on DashboardScreen tab $activeTab at width $width px',
        );
      }
    }
  });
}
