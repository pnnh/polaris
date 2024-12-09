import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';

/// My app class to display the date range picker
class MyDatePickerApp extends StatefulWidget {
  const MyDatePickerApp({super.key});

  @override
  MyAppState createState() => MyAppState();
}

/// State for MyApp
class MyAppState extends State<MyDatePickerApp> {
  void _onSelectionChanged(DateRangePickerSelectionChangedArgs args) {}

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        Positioned(
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          child: SfDateRangePicker(
            onSelectionChanged: _onSelectionChanged,
            selectionMode: DateRangePickerSelectionMode.range,
            initialSelectedRange: PickerDateRange(
                DateTime.now().subtract(const Duration(days: 4)),
                DateTime.now().add(const Duration(days: 3))),
          ),
        )
      ],
    );
  }
}
