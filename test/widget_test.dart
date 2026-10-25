import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:sih_business_advisory/main.dart';
import 'package:sih_business_advisory/providers/advisory_provider.dart';

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
}
