import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class AppIcon extends StatelessWidget {
  final dynamic icon;
  final double? size;
  final Color? color;

  const AppIcon(this.icon, {super.key, this.size, this.color});

  @override
  Widget build(BuildContext context) {
    if (icon == null) return const SizedBox.shrink();
    if (icon is FaIconData) {
      return FaIcon(icon as FaIconData, size: size, color: color);
    }
    if (icon is IconData) {
      return Icon(icon as IconData, size: size, color: color);
    }
    return const SizedBox.shrink();
  }
}
