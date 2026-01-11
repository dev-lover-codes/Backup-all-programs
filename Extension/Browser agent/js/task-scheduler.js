// Task Scheduler Service - Schedule and execute recurring tasks
export class TaskScheduler {
    constructor() {
        this.scheduledTasks = new Map();
    }

    async initialize() {
        // Load scheduled tasks from storage
        const data = await chrome.storage.local.get('scheduled_tasks');

        if (data.scheduled_tasks) {
            this.scheduledTasks = new Map(Object.entries(data.scheduled_tasks));

            // Recreate alarms for all tasks
            for (const [taskId, task] of this.scheduledTasks) {
                await this.createAlarm(taskId, task);
            }
        }

        console.log('⏰ Task Scheduler initialized with', this.scheduledTasks.size, 'tasks');
    }

    async scheduleTask(task, sendResponse) {
        const taskId = this.generateTaskId(task.name);

        const scheduledTask = {
            id: taskId,
            name: task.name,
            command: task.command,
            schedule: task.schedule, // cron-like or interval
            enabled: true,
            createdAt: Date.now(),
            lastRun: null,
            nextRun: null
        };

        this.scheduledTasks.set(taskId, scheduledTask);

        await this.createAlarm(taskId, scheduledTask);
        await this.saveToStorage();

        if (sendResponse) {
            sendResponse({
                success: true,
                taskId,
                message: `Task "${task.name}" scheduled successfully`
            });
        }

        return taskId;
    }

    async createAlarm(taskId, task) {
        const schedule = this.parseSchedule(task.schedule);

        if (schedule.type === 'interval') {
            chrome.alarms.create(`task_${taskId}`, {
                periodInMinutes: schedule.minutes
            });

            task.nextRun = Date.now() + (schedule.minutes * 60 * 1000);
        } else if (schedule.type === 'daily') {
            // Calculate next occurrence
            const now = new Date();
            const targetTime = new Date();
            targetTime.setHours(schedule.hour, schedule.minute, 0, 0);

            if (targetTime <= now) {
                targetTime.setDate(targetTime.getDate() + 1);
            }

            chrome.alarms.create(`task_${taskId}`, {
                when: targetTime.getTime(),
                periodInMinutes: 24 * 60 // Daily
            });

            task.nextRun = targetTime.getTime();
        }
    }

    parseSchedule(schedule) {
        // Parse schedule string
        // Examples:
        // "every 30 minutes"
        // "daily at 8:00 AM"
        // "every Monday at 9:00 AM"

        if (schedule.includes('every') && schedule.includes('minute')) {
            const match = schedule.match(/every (\d+) minute/);
            return {
                type: 'interval',
                minutes: parseInt(match[1])
            };
        }

        if (schedule.includes('daily at')) {
            const match = schedule.match(/daily at (\d+):(\d+)/);
            return {
                type: 'daily',
                hour: parseInt(match[1]),
                minute: parseInt(match[2])
            };
        }

        // Default to hourly
        return {
            type: 'interval',
            minutes: 60
        };
    }

    async executeScheduledTask(alarmName) {
        const taskId = alarmName.replace('task_', '');
        const task = this.scheduledTasks.get(taskId);

        if (!task || !task.enabled) {
            return;
        }

        console.log('⚡ Executing scheduled task:', task.name);

        try {
            // Execute the command
            await chrome.runtime.sendMessage({
                type: 'EXECUTE_COMMAND',
                command: task.command
            });

            task.lastRun = Date.now();
            await this.saveToStorage();

            // Send notification
            chrome.notifications.create({
                type: 'basic',
                iconUrl: '../icons/icon48.png',
                title: '✅ Scheduled Task Completed',
                message: `Task "${task.name}" executed successfully`
            });
        } catch (error) {
            console.error('Error executing scheduled task:', error);

            chrome.notifications.create({
                type: 'basic',
                iconUrl: '../icons/icon48.png',
                title: '❌ Scheduled Task Failed',
                message: `Task "${task.name}" failed: ${error.message}`
            });
        }
    }

    async deleteTask(taskId) {
        this.scheduledTasks.delete(taskId);
        chrome.alarms.clear(`task_${taskId}`);
        await this.saveToStorage();
    }

    async toggleTask(taskId, enabled) {
        const task = this.scheduledTasks.get(taskId);

        if (task) {
            task.enabled = enabled;

            if (enabled) {
                await this.createAlarm(taskId, task);
            } else {
                chrome.alarms.clear(`task_${taskId}`);
            }

            await this.saveToStorage();
        }
    }

    getScheduledTasks() {
        return Array.from(this.scheduledTasks.values());
    }

    generateTaskId(name) {
        return `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    }

    async saveToStorage() {
        const tasksObj = Object.fromEntries(this.scheduledTasks);
        await chrome.storage.local.set({ scheduled_tasks: tasksObj });
    }
}

export default TaskScheduler;
