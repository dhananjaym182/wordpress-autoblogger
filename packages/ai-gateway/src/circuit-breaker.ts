import { CircuitBreakerConfig } from './types.js';

interface CircuitState {
  failures: number;
  lastFailureTime: number | null;
  state: 'closed' | 'open' | 'half-open';
}

export class CircuitBreaker {
  private states: Map<string, CircuitState> = new Map();

  constructor(private config: CircuitBreakerConfig) {}

  canExecute(providerId: string): boolean {
    if (!this.config.enabled) return true;

    const state = this.getState(providerId);

    if (state.state === 'closed') return true;

    if (state.state === 'open') {
      // Check if cooldown has passed
      if (state.lastFailureTime && 
          Date.now() - state.lastFailureTime > this.config.cooldownMs) {
        state.state = 'half-open';
        return true;
      }
      return false;
    }

    // half-open state - allow one request through
    return true;
  }

  recordSuccess(providerId: string): void {
    if (!this.config.enabled) return;

    const state = this.getState(providerId);
    state.failures = 0;
    state.state = 'closed';
    state.lastFailureTime = null;
  }

  recordFailure(providerId: string): void {
    if (!this.config.enabled) return;

    const state = this.getState(providerId);
    state.failures++;
    state.lastFailureTime = Date.now();

    if (state.failures >= this.config.failureThreshold) {
      state.state = 'open';
    }
  }

  getState(providerId: string): CircuitState {
    if (!this.states.has(providerId)) {
      this.states.set(providerId, {
        failures: 0,
        lastFailureTime: null,
        state: 'closed',
      });
    }
    return this.states.get(providerId)!;
  }

  reset(providerId: string): void {
    this.states.set(providerId, {
      failures: 0,
      lastFailureTime: null,
      state: 'closed',
    });
  }
}
