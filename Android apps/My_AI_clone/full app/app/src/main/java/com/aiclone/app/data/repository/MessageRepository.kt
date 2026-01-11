package com.aiclone.app.data.repository

import com.aiclone.app.data.local.MessageDao
import com.aiclone.app.data.model.Message
import com.aiclone.app.data.remote.AIService
import com.aiclone.app.data.model.AIRequest
import com.aiclone.app.data.model.ChatMessage
import kotlinx.coroutines.flow.Flow

class MessageRepository(
    private val messageDao: MessageDao,
    private val aiService: AIService
) {
    
    // Database operations
    fun getAllMessages(): Flow<List<Message>> = messageDao.getAllMessages()
    
    fun getMessagesByPlatform(platform: String): Flow<List<Message>> = 
        messageDao.getMessagesByPlatform(platform)
    
    fun getMessagesByConversation(conversationId: String): Flow<List<Message>> =
        messageDao.getMessagesByConversation(conversationId)
    
    fun getMessageCount(): Flow<Int> = messageDao.getMessageCount()
    
    fun getPlatformCount(): Flow<Int> = messageDao.getPlatformCount()
    
    suspend fun insertMessage(message: Message) = messageDao.insertMessage(message)
    
    suspend fun insertMessages(messages: List<Message>) = messageDao.insertMessages(messages)
    
    suspend fun getUserMessages(limit: Int = 1000): List<Message> = 
        messageDao.getUserMessages(limit)
    
    suspend fun deleteAllMessages() = messageDao.deleteAllMessages()
    
    suspend fun deleteMessagesByPlatform(platform: String) = 
        messageDao.deleteMessagesByPlatform(platform)
    
    // AI operations
    suspend fun generateAIResponse(
        apiKey: String,
        userMessage: String,
        conversationHistory: List<Message> = emptyList(),
        model: String = "gpt-3.5-turbo"
    ): Result<String> {
        return try {
            // Build context from conversation history
            val messages = mutableListOf<ChatMessage>()
            
            // System prompt to set the AI's personality
            messages.add(
                ChatMessage(
                    role = "system",
                    content = buildSystemPrompt(conversationHistory)
                )
            )
            
            // Add recent conversation history for context
            conversationHistory.takeLast(10).forEach { msg ->
                messages.add(
                    ChatMessage(
                        role = if (msg.isFromUser) "assistant" else "user",
                        content = msg.content
                    )
                )
            }
            
            // Add the current message
            messages.add(
                ChatMessage(
                    role = "user",
                    content = userMessage
                )
            )
            
            val request = AIRequest(
                model = model,
                messages = messages,
                temperature = 0.7,
                max_tokens = 500
            )
            
            val response = aiService.generateResponse(
                authorization = "Bearer $apiKey",
                request = request
            )
            
            val aiReply = response.choices.firstOrNull()?.message?.content
                ?: throw Exception("No response from AI")
            
            Result.success(aiReply)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    private fun buildSystemPrompt(conversationHistory: List<Message>): String {
        val userMessages = conversationHistory.filter { it.isFromUser }
        
        return if (userMessages.isEmpty()) {
            """You are an AI assistant trained to respond like the user. 
            |Be helpful, friendly, and match the user's communication style.
            |Keep responses concise and natural.""".trimMargin()
        } else {
            """You are an AI clone trained to respond exactly like the user based on their chat history.
            |Analyze their communication style, tone, vocabulary, and typical responses.
            |Match their personality, humor, and way of expressing thoughts.
            |Keep responses authentic and natural, as if the user themselves is replying.
            |Here are some examples of how the user typically communicates:
            |${userMessages.take(20).joinToString("\n") { "- ${it.content}" }}
            """.trimMargin()
        }
    }
}
