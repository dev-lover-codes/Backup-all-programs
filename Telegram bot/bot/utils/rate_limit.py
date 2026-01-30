import asyncio
import time
from typing import Dict

class RateLimiter:
    """Per-user cooldown using a simple time-based approach."""
    
    def __init__(self, cooldown_seconds: int):
        self.cooldown_seconds = cooldown_seconds
        self.last_request: Dict[int, float] = {}
        self._lock = asyncio.Lock()
    
    async def check_rate_limit(self, user_id: int) -> bool:
        """
        Returns True if user can proceed, False if they're rate limited.
        """
        async with self._lock:
            current_time = time.time()
            last_time = self.last_request.get(user_id, 0)
            
            if current_time - last_time < self.cooldown_seconds:
                return False
            
            self.last_request[user_id] = current_time
            return True
    
    async def get_remaining_cooldown(self, user_id: int) -> float:
        """Returns remaining cooldown time in seconds."""
        current_time = time.time()
        last_time = self.last_request.get(user_id, 0)
        remaining = self.cooldown_seconds - (current_time - last_time)
        return max(0, remaining)
