package com.aiclone.app.ui.theme

import androidx.compose.ui.graphics.Color

// Premium AI Theme Colors (Cyberpunk / Deep Space)
val NeonCyan = Color(0xFF00F2FE)
val NeonBlue = Color(0xFF4FACFE)
val NeonPurple = Color(0xFFB721FF)
val NeonPink = Color(0xFF21D4FD)

val AIPrimary = NeonCyan
val AISecondary = NeonPurple
val AITertiary = NeonBlue

// Backgrounds
val DeepSpaceBlack = Color(0xFF050510) // Darker, richer black
val SurfaceBlack = Color(0xFF0E0E1B)   // Slightly lighter for cards
val SurfaceGlass = Color(0x1AFFFFFF)   // 10% White for glass effect
val SurfaceGlassStrong = Color(0x33FFFFFF) // 20% White

// Text
val TextWhite = Color(0xFFFFFFFF)
val TextGrey = Color(0xFFE2E2E2)
val TextDark = Color(0xFF0F0F1E)

// Gradients
val GradientNeon = listOf(NeonBlue, NeonCyan)
val GradientPurple = listOf(NeonPurple, Color(0xFF6B00B6))
val GradientBrain = listOf(NeonCyan, NeonPurple, NeonBlue)

// Status
val StatusOnline = Color(0xFF00FF9D)
val StatusOffline = Color(0xFFFF3B30)
val StatusSync = Color(0xFFFFD700)
