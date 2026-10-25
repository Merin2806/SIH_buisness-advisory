import 'dart:async';
import 'package:flutter/material.dart';
import '../data/mock_advisory_repository.dart';
import '../models/advisory_models.dart';

class AdvisoryProvider extends ChangeNotifier {
  // Form State
  String _selectedCategoryId = 'poultry';
  double _seedCapital = 50000.0;
  String _locationName = 'Gram Panchayat: Shivajinagar, Baramati Rural (18.1512° N, 74.5771° E)';
  
  // Voice State (Bhashini Simulation)
  bool _isListeningVoice = false;
  String _bhashiniTranscript = '';
  String _selectedLanguage = 'हिन्दी (Hindi)';

  // Loading / Simulation State
  bool _isLoading = false;
  double _progress = 0.0;
  List<String> _activeLogs = [];
  Timer? _simulationTimer;

  // Dashboard State
  int _activeTab = 0; // 0 = Financial Structuring, 1 = Advisory & Feasibility
  String _truthFilter = 'all'; // 'all', 'hard_data', 'ai_projection'

  // Dynamic Unit Economics Budgeter State (for Poultry)
  double _materialCostPerUnit = 88.0; // ₹88 feed + chick cost per bird
  double _sellingPricePerUnit = 155.0; // ₹155 sale price per bird
  double _fixedOverheadMonthly = 3800.0; // Electricity, water, litter, vaccines
  int _targetDailyUnits = 12; // Expected birds sold per day

  // Getters
  String get selectedCategoryId => _selectedCategoryId;
  double get seedCapital => _seedCapital;
  String get locationName => _locationName;
  bool get isListeningVoice => _isListeningVoice;
  String get bhashiniTranscript => _bhashiniTranscript;
  String get selectedLanguage => _selectedLanguage;

  bool get isLoading => _isLoading;
  double get progress => _progress;
  List<String> get activeLogs => _activeLogs;

  int get activeTab => _activeTab;
  String get truthFilter => _truthFilter;

  double get materialCostPerUnit => _materialCostPerUnit;
  double get sellingPricePerUnit => _sellingPricePerUnit;
  double get fixedOverheadMonthly => _fixedOverheadMonthly;
  int get targetDailyUnits => _targetDailyUnits;

  BusinessCategoryOption get selectedCategory {
    return MockAdvisoryRepository.categories.firstWhere(
      (c) => c.id == _selectedCategoryId,
      orElse: () => MockAdvisoryRepository.categories.first,
    );
  }

  FinancialStructuringResult get financialResult {
    return MockAdvisoryRepository.calculateFinancials(
      capital: _seedCapital,
      categoryId: _selectedCategoryId,
    );
  }

  List<AdvisorySection> get advisorySections {
    final sections = MockAdvisoryRepository.getPoultryAdvisorySections();
    if (_truthFilter == 'all') {
      return sections;
    }

    final targetSource = _truthFilter == 'hard_data'
        ? TruthSource.hardDataOsm
        : TruthSource.aiProjection;

    return sections.map((sec) {
      final filteredItems = sec.items.where((item) => item.source == targetSource).toList();
      return AdvisorySection(
        id: sec.id,
        title: sec.title,
        subtitle: sec.subtitle,
        icon: sec.icon,
        items: filteredItems,
        strategicRecommendation: sec.strategicRecommendation,
      );
    }).where((sec) => sec.items.isNotEmpty).toList();
  }

  // Dynamic Unit Economics Calculations
  double get contributionMargin => _sellingPricePerUnit - _materialCostPerUnit;
  double get contributionMarginPct =>
      _sellingPricePerUnit > 0 ? (contributionMargin / _sellingPricePerUnit) * 100 : 0;
  
  double get dailyFixedCost => _fixedOverheadMonthly / 30.0;

  double get dailyBreakEvenUnits {
    if (contributionMargin <= 0) return 999.0;
    return dailyFixedCost / contributionMargin;
  }

  double get projectedDailyProfit {
    return (_targetDailyUnits * contributionMargin) - dailyFixedCost;
  }

  double get projectedMonthlyProfit {
    return projectedDailyProfit * 30;
  }

  // Mutators
  void setCategory(String categoryId) {
    _selectedCategoryId = categoryId;
    final cat = selectedCategory;
    _seedCapital = cat.suggestedCapital;
    notifyListeners();
  }

  void setSeedCapital(double capital) {
    _seedCapital = capital.clamp(10000.0, 1000000.0);
    notifyListeners();
  }

  void setActiveTab(int index) {
    _activeTab = index;
    notifyListeners();
  }

  void setTruthFilter(String filter) {
    _truthFilter = filter;
    notifyListeners();
  }

  void setMaterialCost(double val) {
    _materialCostPerUnit = val;
    notifyListeners();
  }

  void setSellingPrice(double val) {
    _sellingPricePerUnit = val;
    notifyListeners();
  }

  void setTargetDailyUnits(int units) {
    _targetDailyUnits = units;
    notifyListeners();
  }

  void setSelectedLanguage(String lang) {
    _selectedLanguage = lang;
    notifyListeners();
  }

  // Bhashini Voice Simulation
  void startVoiceListening() {
    _isListeningVoice = true;
    _bhashiniTranscript = 'सुन रहे हैं (Listening)...';
    notifyListeners();

    // Simulate multi-lingual speech-to-text
    Timer(const Duration(milliseconds: 1400), () {
      _bhashiniTranscript = '“मुर्गी पालन (Poultry Farm) शुरू करना है, ₹50,000 की पूंजी के साथ...”';
      notifyListeners();
    });

    Timer(const Duration(milliseconds: 2800), () {
      _isListeningVoice = false;
      _selectedCategoryId = 'poultry';
      _seedCapital = 50000.0;
      _bhashiniTranscript = 'पहचाना गया: पोल्ट्री फार्मिंग | पूंजी: ₹50,000';
      notifyListeners();
    });
  }

  void stopVoiceListening() {
    _isListeningVoice = false;
    notifyListeners();
  }

  // Geo-RAG Simulation Pipeline
  void startGeoRagPipeline({required VoidCallback onComplete}) {
    _isLoading = true;
    _progress = 0.0;
    _activeLogs = [];
    notifyListeners();

    final allLogs = MockAdvisoryRepository.getGeoRagPipelineLogs();
    int currentStep = 0;
    final stepDuration = const Duration(milliseconds: 260);

    _simulationTimer?.cancel();
    _simulationTimer = Timer.periodic(stepDuration, (timer) {
      if (currentStep < allLogs.length) {
        _activeLogs.add(allLogs[currentStep]);
        _progress = (currentStep + 1) / allLogs.length;
        currentStep++;
        notifyListeners();
      } else {
        timer.cancel();
        Timer(const Duration(milliseconds: 400), () {
          _isLoading = false;
          notifyListeners();
          onComplete();
        });
      }
    });
  }

  @override
  void dispose() {
    _simulationTimer?.cancel();
    super.dispose();
  }
}
