package com.aiclone.app.service

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

class NotificationListenerService : NotificationListenerService() {
    
    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    
    companion object {
        private const val TAG = "AICloneNotificationListener"
        
        // Supported messaging apps
        private val SUPPORTED_PACKAGES = setOf(
            "com.whatsapp",
            "com.instagram.android",
            "com.snapchat.android",
            "com.google.android.gm" // Gmail
        )
    }
    
    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        
        sbn?.let { notification ->
            val packageName = notification.packageName
            
            // Only process notifications from supported apps
            if (packageName in SUPPORTED_PACKAGES) {
                processNotification(notification)
            }
        }
    }
    
    private fun processNotification(sbn: StatusBarNotification) {
        serviceScope.launch {
            try {
                val extras = sbn.notification.extras
                val title = extras.getString("android.title") ?: ""
                val text = extras.getCharSequence("android.text")?.toString() ?: ""
                
                if (text.isNotBlank()) {
                    Log.i(TAG, "--------------------------------------------------")
                    Log.i(TAG, "🧠 AI CLONE ACTIVATED")
                    Log.i(TAG, "📩 Incoming Message from $title: \"$text\"")
                    Log.i(TAG, "📱 Platform: ${getPlatformName(sbn.packageName)}")
                    
                    // SIMULATED AI PROCESSING
                    val prompt = "User $title asked: $text. How would [YOUR NAME] reply?"
                    Log.d(TAG, "🤔 Analyzing context from chat history...")
                    Log.d(TAG, "⚡ Generating response details...")
                    
                    // Simple Pattern Matching for Demo
                    val aiReply = when {
                        text.contains("hello", ignoreCase = true) || text.contains("hi", ignoreCase = true) -> 
                            "Hey! What's up? Long time no see."
                        text.contains("busy", ignoreCase = true) -> 
                            "Yeah, caught up with some coding right now. TTYL?"
                        text.contains("where", ignoreCase = true) -> 
                            "I'm at home, just working on my AI project."
                        else -> "Haha, that's interesting! Tell me more."
                    }
                    
                    Log.i(TAG, "🤖 AI GENERATED REPLY: \"$aiReply\"")
                    Log.i(TAG, "✅ Reply ready for approval (Auto-send disabled in Demo)")
                    Log.i(TAG, "--------------------------------------------------")
                    
                    // TODO: Insert into database for the UI to show "New Smart Reply"
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error processing notification", e)
            }
        }
    }
    
    private fun getPlatformName(packageName: String): String {
        return when (packageName) {
            "com.whatsapp" -> "WhatsApp"
            "com.instagram.android" -> "Instagram"
            "com.snapchat.android" -> "Snapchat"
            "com.google.android.gm" -> "Gmail"
            else -> "Unknown"
        }
    }
    
    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        super.onNotificationRemoved(sbn)
        // Handle notification removal if needed
    }
}
