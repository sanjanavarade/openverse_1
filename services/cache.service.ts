import NodeCache from 'node-cache';
import { config } from '../config/env';
import logger from '../utils/logger.util';

class CacheService {
  private cache: NodeCache;

  constructor() {
    // Default TTL from config (in seconds)
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl,
      checkperiod: 120, // Check for expired keys every 2 minutes
      useClones: false
    });

    this.cache.on('expired', (key) => {
      logger.debug(`Cache key expired: ${key}`);
    });
  }

  /**
   * Get cached value
   */
  get<T>(key: string): T | undefined {
    try {
      return this.cache.get<T>(key);
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return undefined;
    }
  }

  /**
   * Set cached value
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    try {
      return this.cache.set(key, value, ttl || config.cache.ttl);
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete cached value
   */
  del(key: string): number {
    try {
      return this.cache.del(key);
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Delete all keys matching pattern
   */
  delPattern(pattern: string): number {
    try {
      const keys = this.cache.keys().filter(key => key.includes(pattern));
      return this.cache.del(keys);
    } catch (error) {
      logger.error(`Cache delete pattern error for ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Clear all cache
   */
  flush(): void {
    try {
      this.cache.flushAll();
      logger.info('Cache flushed');
    } catch (error) {
      logger.error('Cache flush error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return this.cache.getStats();
  }

  /**
   * Wrap a function with caching
   */
  async wrap<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try to get from cache
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      logger.debug(`Cache hit: ${key}`);
      return cached;
    }

    // Execute function and cache result
    logger.debug(`Cache miss: ${key}`);
    const result = await fn();
    this.set(key, result, ttl);
    return result;
  }
}

export default new CacheService();