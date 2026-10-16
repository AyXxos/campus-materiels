import { isPlatformBrowser } from '@angular/common';
import { computed, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type Role = 'admin' | 'user';
export type User = { id: number; name: string; role: Role };
type AuthStatus = 'loading' | 'loaded' | 'error';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(null);
  readonly status = signal<AuthStatus>('loading');
  readonly isAdmin = computed(() => this.user()?.role === 'admin');

  private readonly storageKey = 'campus-materiel-auth-user';
  private readonly browser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.browser = isPlatformBrowser(platformId);
  }

  async ensureSession(): Promise<void> {
    if (this.status() !== 'loading') {
      return;
    }
    if (!this.browser) {
      this.status.set('loaded');
      return;
    }
    try {
      const storedUser = window.localStorage.getItem(this.storageKey);
      if (storedUser) {
        this.user.set(JSON.parse(storedUser) as User);
      }
      this.status.set('loaded');
    } catch {
      this.status.set('error');
    }
  }

  login(email: string, password: string): boolean {
    const accounts: Record<string, { password: string; user: User }> = {
      'admin@example.com': {
        password: 'admin',
        user: { id: 1, name: 'Administrateur', role: 'admin' },
      },
      'user@example.com': {
        password: 'user',
        user: { id: 2, name: 'Utilisateur', role: 'user' },
      },
    };
    const account = accounts[email.trim().toLowerCase()];
    if (!account || account.password !== password) {
      return false;
    }
    this.user.set(account.user);
    this.status.set('loaded');
    if (this.browser) {
      window.localStorage.setItem(this.storageKey, JSON.stringify(account.user));
    }
    return true;
  }

  logout(): void {
    this.user.set(null);
    if (this.browser) {
      window.localStorage.removeItem(this.storageKey);
    }
  }
}
