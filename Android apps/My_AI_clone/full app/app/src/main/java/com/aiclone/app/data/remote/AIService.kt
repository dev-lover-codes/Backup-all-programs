package com.aiclone.app.data.remote

import com.aiclone.app.data.model.AIRequest
import com.aiclone.app.data.model.AIResponse
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface AIService {
    
    @POST("v1/chat/completions")
    suspend fun generateResponse(
        @Header("Authorization") authorization: String,
        @Body request: AIRequest
    ): AIResponse
}
