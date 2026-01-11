// YouTube Service - Video management and summarization
export class YouTubeService {
    constructor() {
        this.accessToken = null;
        this.apiKey = null;
        this.youtubeApiUrl = 'https://www.googleapis.com/youtube/v3';
    }

    async authenticate() {
        try {
            const token = await chrome.identity.getAuthToken({ interactive: true });
            this.accessToken = token.token;
            console.log('✅ YouTube authenticated');
            return true;
        } catch (error) {
            console.error('❌ YouTube authentication failed:', error);
            return false;
        }
    }

    async getVideoInfo(videoId) {
        try {
            const response = await fetch(
                `${this.youtubeApiUrl}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${this.apiKey}`,
                {
                    headers: this.accessToken ? {
                        'Authorization': `Bearer ${this.accessToken}`
                    } : {}
                }
            );

            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const video = data.items[0];
                return {
                    success: true,
                    video: {
                        id: video.id,
                        title: video.snippet.title,
                        description: video.snippet.description,
                        channelTitle: video.snippet.channelTitle,
                        publishedAt: video.snippet.publishedAt,
                        duration: video.contentDetails.duration,
                        viewCount: video.statistics.viewCount,
                        likeCount: video.statistics.likeCount,
                        thumbnails: video.snippet.thumbnails
                    }
                };
            }

            return { success: false, error: 'Video not found' };
        } catch (error) {
            console.error('Error getting video info:', error);
            return { success: false, error: error.message };
        }
    }

    async getCaptions(videoId) {
        try {
            const response = await fetch(
                `${this.youtubeApiUrl}/captions?part=snippet&videoId=${videoId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            const data = await response.json();
            return { success: true, captions: data.items || [] };
        } catch (error) {
            console.error('Error getting captions:', error);
            return { success: false, error: error.message };
        }
    }

    async summarizeVideo(videoId, geminiAI) {
        const videoInfo = await this.getVideoInfo(videoId);

        if (!videoInfo.success) {
            return videoInfo;
        }

        const prompt = `Summarize this YouTube video based on its metadata:

Title: ${videoInfo.video.title}
Channel: ${videoInfo.video.channelTitle}
Description: ${videoInfo.video.description}

Provide:
1. Main topic/theme
2. Key points (3-5 bullet points)
3. Target audience
4. Estimated value/usefulness`;

        try {
            const summary = await geminiAI.generateContent(prompt);
            return {
                success: true,
                video: videoInfo.video,
                summary
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async searchVideos(query, maxResults = 10) {
        try {
            const response = await fetch(
                `${this.youtubeApiUrl}/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${this.apiKey}`
            );

            const data = await response.json();

            const videos = data.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                channelTitle: item.snippet.channelTitle,
                publishedAt: item.snippet.publishedAt,
                thumbnail: item.snippet.thumbnails.medium.url
            }));

            return { success: true, videos };
        } catch (error) {
            console.error('Error searching videos:', error);
            return { success: false, error: error.message };
        }
    }

    async getTranscript(videoId) {
        // Note: YouTube doesn't provide direct transcript API
        // This would require third-party services or scraping
        // For now, return a placeholder
        return {
            success: false,
            message: 'Transcript extraction requires additional setup. Use caption API or third-party services.'
        };
    }

    extractVideoId(url) {
        // Extract video ID from various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    }

    async downloadVideo(videoId, quality = 'medium') {
        // Note: Direct video download requires compliance with YouTube TOS
        // This should only work with videos that allow downloads

        return {
            success: false,
            message: 'Video downloads must comply with YouTube Terms of Service. Use YouTube Premium download feature or authorized third-party tools.',
            alternatives: [
                'YouTube Premium (official download feature)',
                'Creator-authorized downloads',
                'Public domain/Creative Commons videos only'
            ]
        };
    }

    async getPlaylistVideos(playlistId, maxResults = 50) {
        try {
            const response = await fetch(
                `${this.youtubeApiUrl}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${this.apiKey}`
            );

            const data = await response.json();

            const videos = data.items.map(item => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                channelTitle: item.snippet.channelTitle,
                position: item.snippet.position
            }));

            return { success: true, videos };
        } catch (error) {
            console.error('Error getting playlist videos:', error);
            return { success: false, error: error.message };
        }
    }

    async getChannelInfo(channelId) {
        try {
            const response = await fetch(
                `${this.youtubeApiUrl}/channels?part=snippet,statistics&id=${channelId}&key=${this.apiKey}`
            );

            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const channel = data.items[0];
                return {
                    success: true,
                    channel: {
                        id: channel.id,
                        title: channel.snippet.title,
                        description: channel.snippet.description,
                        subscriberCount: channel.statistics.subscriberCount,
                        videoCount: channel.statistics.videoCount,
                        viewCount: channel.statistics.viewCount,
                        thumbnail: channel.snippet.thumbnails.medium.url
                    }
                };
            }

            return { success: false, error: 'Channel not found' };
        } catch (error) {
            console.error('Error getting channel info:', error);
            return { success: false, error: error.message };
        }
    }
}

export default YouTubeService;
