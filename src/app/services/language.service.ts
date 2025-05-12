import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$: Observable<string> = this.currentLanguageSubject.asObservable();
  private platformId = inject(PLATFORM_ID);

  constructor(private translate: TranslateService) {
    // Set default language to English
    this.initLanguage();
  }

  private initLanguage() {
    let savedLang = 'en'; // Default language
    
    // Only access localStorage when in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      savedLang = localStorage.getItem('language') || 'en';
    }
    
    this.setLanguage(savedLang);
  }

  public setLanguage(lang: string): void {
    // Save language to localStorage only in browser environment
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang);
    }
    
    // Update TranslateService
    this.translate.use(lang);
    
    // Update current language subject
    this.currentLanguageSubject.next(lang);
  }

  public getCurrentLang(): string {
    return this.currentLanguageSubject.value;
  }

  public toggleLanguage(): void {
    const currentLang = this.getCurrentLang();
    const newLang = currentLang === 'en' ? 'es' : 'en';
    this.setLanguage(newLang);
  }
}
