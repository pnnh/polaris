import 'package:flutter/material.dart';

class HomeProvider with ChangeNotifier {
  bool _showFilter = true;
  bool _showDatePicker = false;

  bool get showFilter => _showFilter;

  bool get showDatePicker => _showDatePicker;

  switchFilter() {
    _showFilter = !_showFilter;
    notifyListeners();
  }

  switchDatePicker() {
    _showDatePicker = !_showDatePicker;
    notifyListeners();
  }

  closeDatePicker() {
    _showDatePicker = false;
    notifyListeners();
  }
}
