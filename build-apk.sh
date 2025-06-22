#!/bin/bash
# Script para compilar o APK diretamente

cd android
./gradlew assembleDebug

echo "APK gerado em: android/app/build/outputs/apk/debug/app-debug.apk"