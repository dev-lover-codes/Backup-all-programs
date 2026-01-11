package com.aiclone.app.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.aiclone.app.ui.navigation.Screen
import com.aiclone.app.ui.theme.*

@Composable
fun HomeScreen(navController: NavController) {
    // Pulse Animation for the Brain/Core
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepSpaceBlack)
    ) {
        // Ambient background glow
        Box(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .offset(y = (-100).dp)
                .size(400.dp)
                .alpha(0.2f)
                .background(Brush.radialGradient(listOf(NeonBlue, Color.Transparent)))
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
        ) {
            // Header: Neural Link Status
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(StatusOnline)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "NEURAL LINK: ONLINE",
                        color = NeonCyan,
                        style = MaterialTheme.typography.labelMedium,
                        letterSpacing = 2.sp
                    )
                }
                IconButton(onClick = { navController.navigate(Screen.Settings.route) }) {
                    Icon(
                        Icons.Outlined.Settings,
                        contentDescription = "Settings",
                        tint = TextWhite.copy(alpha = 0.7f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(30.dp))

            // Central AI Visualization
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp),
                contentAlignment = Alignment.Center
            ) {
                // Outer Glow Rings
                Box(
                    modifier = Modifier
                        .size(200.dp)
                        .scale(pulseScale)
                        .border(1.dp, NeonPurple.copy(alpha = 0.3f), CircleShape)
                )
                Box(
                    modifier = Modifier
                        .size(160.dp)
                        .scale(pulseScale * 0.95f)
                        .border(1.dp, NeonBlue.copy(alpha = 0.3f), CircleShape)
                )
                
                // Core Brain Icon
                Icon(
                    imageVector = Icons.Default.Psychology,
                    contentDescription = "AI Core",
                    modifier = Modifier
                        .size(100.dp)
                        .scale(pulseScale),
                    tint = TextWhite
                )
                
                // Overlay text
                Text(
                    text = "MY AI CLONE",
                    modifier = Modifier.align(Alignment.BottomCenter),
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = TextWhite,
                    letterSpacing = 2.sp
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Training Status
            GlassCard {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("TRAINING SEQUENCE", color = TextGrey, style = MaterialTheme.typography.labelSmall)
                        Text("78%", color = NeonCyan, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    LinearProgressIndicator(
                        progress = 0.78f,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(RoundedCornerShape(3.dp)),
                        color = NeonCyan,
                        trackColor = SurfaceGlassStrong
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "Processing WhatsApp History...",
                        color = TextGrey.copy(alpha = 0.6f),
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Action Grid
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                GlassActionCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Default.Chat,
                    title = "TEST AI",
                    color = NeonPink,
                    onClick = { navController.navigate(Screen.ChatTest.route) }
                )
                GlassActionCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Default.Sync,
                    title = "SYNC DATA",
                    color = NeonBlue,
                    onClick = { navController.navigate(Screen.Import.route) }
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
             GlassActionCard(
                modifier = Modifier.fillMaxWidth(),
                icon = Icons.Default.AutoAwesome,
                title = "ENABLE AUTO-REPLY",
                color = StatusOnline,
                onClick = { navController.navigate(Screen.SmartReply.route) }
            )
        }
    }
}

@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    content: @Composable () -> Unit
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier),
        shape = RoundedCornerShape(24.dp),
        color = SurfaceGlass,
        border = androidx.compose.foundation.BorderStroke(1.dp, SurfaceGlassStrong)
    ) {
        content()
    }
}

@Composable
fun GlassActionCard(
    modifier: Modifier = Modifier,
    icon: ImageVector,
    title: String,
    color: Color,
    onClick: () -> Unit
) {
    GlassCard(modifier = modifier, onClick = onClick) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(32.dp)
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = title,
                color = TextWhite,
                fontWeight = FontWeight.SemiBold,
                style = MaterialTheme.typography.labelLarge
            )
        }
    }
}
