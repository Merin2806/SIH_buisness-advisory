import 'dart:html' as html;
import 'dart:ui_web' as ui_web;
import 'package:flutter/material.dart';

Widget getWebAppView({String url = 'http://localhost:5173/'}) {
  final String viewType = 'ruralbiz-ai-live-app';
  
  // Register the view factory for live web app parity
  ui_web.platformViewRegistry.registerViewFactory(
    viewType,
    (int viewId) {
      final iframe = html.IFrameElement()
        ..src = url
        ..style.border = 'none'
        ..style.width = '100vw'
        ..style.height = '100vh'
        ..style.position = 'fixed'
        ..style.top = '0'
        ..style.left = '0'
        ..style.right = '0'
        ..style.bottom = '0'
        ..allow = 'geolocation; microphone; camera';
      return iframe;
    },
  );

  return const HtmlElementView(viewType: 'ruralbiz-ai-live-app');
}

bool get isWebPlatform => true;
