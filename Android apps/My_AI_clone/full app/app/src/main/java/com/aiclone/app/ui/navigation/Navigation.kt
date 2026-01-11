package com.aiclone.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.aiclone.app.ui.screens.ChatTestScreen
import com.aiclone.app.ui.screens.HomeScreen
import com.aiclone.app.ui.screens.ImportScreen
import com.aiclone.app.ui.screens.SettingsScreen
import com.aiclone.app.ui.screens.SmartReplyScreen

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Import : Screen("import")
    object ChatTest : Screen("chat_test")
    object SmartReply : Screen("smart_reply")
    object Settings : Screen("settings")
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        composable(Screen.Home.route) {
            HomeScreen(navController = navController)
        }
        composable(Screen.Import.route) {
            ImportScreen(navController = navController)
        }
        composable(Screen.ChatTest.route) {
            ChatTestScreen(navController = navController)
        }
        composable(Screen.SmartReply.route) {
            SmartReplyScreen(navController = navController)
        }
        composable(Screen.Settings.route) {
            SettingsScreen(navController = navController)
        }
    }
}
