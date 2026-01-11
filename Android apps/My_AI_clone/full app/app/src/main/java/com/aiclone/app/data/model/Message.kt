package com.aiclone.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "messages")
data class Message(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val sender: String,
    val content: String,
    val timestamp: Long,
    val platform: String, // "whatsapp", "instagram", "email", etc.
    val isFromUser: Boolean,
    val conversationId: String = "" // To group messages by conversation
)
