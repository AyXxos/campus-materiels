import { isPlatformBrowser } from '@angular/common';
import { computed, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Role } from '../interfaces/compte';

export type User = { id: number; name: string; role: Role };
type AuthStatus = 'loading' | 'loaded' | 'error';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(null);
  readonly status = signal<AuthStatus>('loading');
  readonly isAdmin = computed(() => this.user()?.role === 'manager');
  readonly isBrowser: boolean;

  private readonly storageKey = 'campus-materiel-auth-user';

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.restoreSession();
    }
  }

  async ensureSession(): Promise<void> {
    if (this.status() !== 'loading') {
      return;
    }
    if (!this.isBrowser) {
      this.status.set('loaded');
      return;
    }
    this.restoreSession();
  }

  login(email: string, password: string): boolean {
    const accounts: Record<string, { password: string; user: User }> = {
      'admin@example.com': {
        password: 'admin',
        user: { id: 3, name: 'Camille Dupont', role: 'manager' },
      },
      'user@example.com': {
        password: 'user',
        user: { id: 1, name: 'Alice Martin', role: 'student' },
      },
      'yanis@example.com': {
        password: 'yanis',
        user: { id: 2, name: 'Yanis Bernard', role: 'student' },
      },
    };
    const account = accounts[email.trim().toLowerCase()];
    if (!account || account.password !== password) {
      return false;
    }
    this.user.set(account.user);
    this.status.set('loaded');
    if (this.isBrowser) {
      window.localStorage.setItem(this.storageKey, JSON.stringify(account.user));
    }
    return true;
  }

  logout(): void {
    this.user.set(null);
    if (this.isBrowser) {
      window.localStorage.removeItem(this.storageKey);
    }
  }

  private restoreSession(): void {
    try {
      const storedUser = window.localStorage.getItem(this.storageKey);
      if (storedUser) {
        const storedUserData = JSON.parse(storedUser) as Omit<User, 'role'> & {
          role: Role | 'admin' | 'user';
        };
        this.user.set({
          ...storedUserData,
          role: storedUserData.role === 'admin' ? 'manager' : storedUserData.role === 'user' ? 'student' : storedUserData.role,
        });
      }
      this.status.set('loaded');
    } catch {
      this.status.set('error');
    }
  }
}
