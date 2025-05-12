import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$: Observable<string> = this.currentLanguageSubject.asObservable();
  private platformId = inject(PLATFORM_ID);

  // Add a loading state subject
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

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
    // Set loading state to true
    this.isLoadingSubject.next(true);

    // Save language to localStorage only in browser environment
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang);
    }

    // Update TranslateService with a small delay to ensure the loading state is visible
    this.translate.use(lang).pipe(
      delay(300) // Add a 300ms delay to make loading state visible
    ).subscribe({
      next: () => {
        // Update current language subject
        this.currentLanguageSubject.next(lang);
        // Set loading state to false when language is set
        this.isLoadingSubject.next(false);
      },
      error: () => {
        // Set loading state to false even if there's an error
        this.isLoadingSubject.next(false);
      }
    });
  }

  public getCurrentLang(): string {
    return this.currentLanguageSubject.value;
  }

  public toggleLanguage(): void {
    // Only toggle if not currently loading
    if (!this.isLoadingSubject.value) {
      const currentLang = this.getCurrentLang();
      const newLang = currentLang === 'en' ? 'es' : 'en';
      this.setLanguage(newLang);
    }
  }
}