package com.aiclone.app.domain.parser

import com.aiclone.app.data.model.Message
import java.text.SimpleDateFormat
import java.util.*

object WhatsAppParser {
    
    // Common WhatsApp export formats
    private val datePatterns = listOf(
        "dd/MM/yy, hh:mm a",  // 25/12/23, 10:30 PM
        "dd/MM/yyyy, hh:mm a", // 25/12/2023, 10:30 PM
        "M/d/yy, h:mm a",      // 12/25/23, 10:30 PM
        "yyyy-MM-dd HH:mm:ss"  // 2023-12-25 22:30:00
    )
    
    /**
     * Parse WhatsApp chat export text file
     * Format: [date time] sender: message
     * Example: 25/12/23, 10:30 PM - John: Hello there!
     */
    fun parseWhatsAppChat(
        chatText: String,
        userName: String,
        platform: String = "whatsapp"
    ): List<Message> {
        val messages = mutableListOf<Message>()
        val lines = chatText.lines()
        
        var currentMessage: StringBuilder? = null
        var currentSender: String? = null
        var currentTimestamp: Long? = null
        var currentIsFromUser: Boolean? = null
        
        for (line in lines) {
            if (line.isBlank()) continue
            
            // Try to parse as new message
            val parsedMessage = parseMessageLine(line, userName)
            
            if (parsedMessage != null) {
                // Save previous message if exists
                if (currentMessage != null && currentSender != null && 
                    currentTimestamp != null && currentIsFromUser != null) {
                    messages.add(
                        Message(
                            sender = currentSender,
                            content = currentMessage.toString().trim(),
                            timestamp = currentTimestamp,
                            platform = platform,
                            isFromUser = currentIsFromUser,
                            conversationId = "whatsapp_main"
                        )
                    )
                }
                
                // Start new message
                currentSender = parsedMessage.sender
                currentTimestamp = parsedMessage.timestamp
                currentIsFromUser = parsedMessage.isFromUser
                currentMessage = StringBuilder(parsedMessage.content)
            } else {
                // Continuation of previous message (multiline)
                currentMessage?.append("\n")?.append(line)
            }
        }
        
        // Add last message
        if (currentMessage != null && currentSender != null && 
            currentTimestamp != null && currentIsFromUser != null) {
            messages.add(
                Message(
                    sender = currentSender,
                    content = currentMessage.toString().trim(),
                    timestamp = currentTimestamp,
                    platform = platform,
                    isFromUser = currentIsFromUser,
                    conversationId = "whatsapp_main"
                )
            )
        }
        
        return messages.filter { 
            !it.content.contains("Messages and calls are end-to-end encrypted") &&
            !it.content.contains("<Media omitted>") &&
            it.content.isNotBlank()
        }
    }
    
    private data class ParsedMessage(
        val sender: String,
        val content: String,
        val timestamp: Long,
        val isFromUser: Boolean
    )
    
    private fun parseMessageLine(line: String, userName: String): ParsedMessage? {
        // Try different regex patterns for WhatsApp format
        val patterns = listOf(
            // Format: 25/12/23, 10:30 PM - John: Hello
            """(\d{1,2}/\d{1,2}/\d{2,4},?\s+\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*-\s*([^:]+):\s*(.+)""".toRegex(),
            // Format: [25/12/23, 10:30:00] John: Hello
            """\[([^\]]+)\]\s*([^:]+):\s*(.+)""".toRegex()
        )
        
        for (pattern in patterns) {
            val match = pattern.find(line)
            if (match != null) {
                val (dateStr, sender, content) = match.destructured
                val timestamp = parseDate(dateStr) ?: System.currentTimeMillis()
                val isFromUser = sender.trim().equals(userName.trim(), ignoreCase = true)
                
                return ParsedMessage(
                    sender = sender.trim(),
                    content = content.trim(),
                    timestamp = timestamp,
                    isFromUser = isFromUser
                )
            }
        }
        
        return null
    }
    
    private fun parseDate(dateStr: String): Long? {
        for (pattern in datePatterns) {
            try {
                val formatter = SimpleDateFormat(pattern, Locale.getDefault())
                formatter.isLenient = true
                return formatter.parse(dateStr)?.time
            } catch (e: Exception) {
                // Try next pattern
            }
        }
        return null
    }
}
