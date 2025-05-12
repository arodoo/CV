import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'CV';
  currentLang: string = 'en';
  isLanguageLoading = false;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });

    // Subscribe to loading state changes
    this.languageService.isLoading$.subscribe(isLoading => {
      this.isLanguageLoading = isLoading;
    });
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
