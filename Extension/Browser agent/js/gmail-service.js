// Gmail Service - Email automation and management
export class GmailService {
    constructor() {
        this.accessToken = null;
        this.gmailApiUrl = 'https://gmail.googleapis.com/gmail/v1/users/me';
    }

    async authenticate() {
        try {
            const token = await chrome.identity.getAuthToken({ interactive: true });
            this.accessToken = token.token;
            console.log('✅ Gmail authenticated');
            return true;
        } catch (error) {
            console.error('❌ Gmail authentication failed:', error);
            return false;
        }
    }

    async getRecentEmails(maxResults = 10) {
        if (!this.accessToken) {
            await this.authenticate();
        }

        try {
            const response = await fetch(
                `${this.gmailApiUrl}/messages?maxResults=${maxResults}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            const data = await response.json();
            const emails = [];

            for (const message of data.messages || []) {
                const email = await this.getEmailDetails(message.id);
                emails.push(email);
            }

            return { success: true, emails };
        } catch (error) {
            console.error('Error fetching emails:', error);
            return { success: false, error: error.message };
        }
    }

    async getEmailDetails(messageId) {
        try {
            const response = await fetch(
                `${this.gmailApiUrl}/messages/${messageId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            const data = await response.json();

            // Parse email data
            const headers = data.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || '';
            const from = headers.find(h => h.name === 'From')?.value || '';
            const date = headers.find(h => h.name === 'Date')?.value || '';

            // Get body
            let body = '';
            if (data.payload.body.data) {
                body = atob(data.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            } else if (data.payload.parts) {
                const textPart = data.payload.parts.find(p => p.mimeType === 'text/plain');
                if (textPart && textPart.body.data) {
                    body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                }
            }

            return {
                id: messageId,
                subject,
                from,
                date,
                body: body.substring(0, 500), // Limit body length
                snippet: data.snippet
            };
        } catch (error) {
            console.error('Error getting email details:', error);
            return null;
        }
    }

    async summarizeEmail(emailId, geminiAI) {
        const email = await this.getEmailDetails(emailId);

        if (!email) {
            return { success: false, error: 'Email not found' };
        }

        const prompt = `Summarize this email in 2-3 concise bullet points:

Subject: ${email.subject}
From: ${email.from}
Body: ${email.body}

Provide only the key points and action items.`;

        try {
            const summary = await geminiAI.generateContent(prompt);
            return {
                success: true,
                email: {
                    subject: email.subject,
                    from: email.from,
                    date: email.date
                },
                summary
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async generateReply(emailId, tone, geminiAI) {
        const email = await this.getEmailDetails(emailId);

        if (!email) {
            return { success: false, error: 'Email not found' };
        }

        const prompt = `Generate a ${tone} reply to this email:

Subject: ${email.subject}
From: ${email.from}
Body: ${email.body}

Write a professional ${tone} response that addresses the main points.`;

        try {
            const reply = await geminiAI.generateContent(prompt);
            return {
                success: true,
                originalEmail: {
                    subject: email.subject,
                    from: email.from
                },
                suggestedReply: reply
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async sendEmail(to, subject, body) {
        const email = [
            `To: ${to}`,
            `Subject: ${subject}`,
            '',
            body
        ].join('\n');

        const encodedEmail = btoa(email)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        try {
            await fetch(`${this.gmailApiUrl}/messages/send`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    raw: encodedEmail
                })
            });

            return { success: true };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    async createDraft(to, subject, body) {
        const email = [
            `To: ${to}`,
            `Subject: ${subject}`,
            '',
            body
        ].join('\n');

        const encodedEmail = btoa(email)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        try {
            await fetch(`${this.gmailApiUrl}/drafts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: {
                        raw: encodedEmail
                    }
                })
            });

            return { success: true };
        } catch (error) {
            console.error('Error creating draft:', error);
            return { success: false, error: error.message };
        }
    }

    async searchEmails(query) {
        try {
            const response = await fetch(
                `${this.gmailApiUrl}/messages?q=${encodeURIComponent(query)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            const data = await response.json();
            return { success: true, results: data.messages || [] };
        } catch (error) {
            console.error('Error searching emails:', error);
            return { success: false, error: error.message };
        }
    }

    async markAsRead(messageId) {
        try {
            await fetch(`${this.gmailApiUrl}/messages/${messageId}/modify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    removeLabelIds: ['UNREAD']
                })
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default GmailService;
