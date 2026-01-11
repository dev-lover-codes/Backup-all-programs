package com.aiclone.app.data.local

import androidx.room.*
import com.aiclone.app.data.model.Message
import kotlinx.coroutines.flow.Flow

@Dao
interface MessageDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: Message): Long
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessages(messages: List<Message>)
    
    @Query("SELECT * FROM messages ORDER BY timestamp DESC")
    fun getAllMessages(): Flow<List<Message>>
    
    @Query("SELECT * FROM messages WHERE platform = :platform ORDER BY timestamp DESC")
    fun getMessagesByPlatform(platform: String): Flow<List<Message>>
    
    @Query("SELECT * FROM messages WHERE conversationId = :conversationId ORDER BY timestamp ASC")
    fun getMessagesByConversation(conversationId: String): Flow<List<Message>>
    
    @Query("SELECT * FROM messages WHERE isFromUser = 1 ORDER BY timestamp DESC LIMIT :limit")
    suspend fun getUserMessages(limit: Int = 1000): List<Message>
    
    @Query("SELECT COUNT(*) FROM messages")
    fun getMessageCount(): Flow<Int>
    
    @Query("SELECT COUNT(DISTINCT platform) FROM messages")
    fun getPlatformCount(): Flow<Int>
    
    @Query("DELETE FROM messages")
    suspend fun deleteAllMessages()
    
    @Query("DELETE FROM messages WHERE platform = :platform")
    suspend fun deleteMessagesByPlatform(platform: String)
}
