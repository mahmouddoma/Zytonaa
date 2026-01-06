import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WeatherService,
  WeatherForecast,
} from '../../../shared/services/weather/weather.service';

@Component({
  selector: 'app-admin-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-weather.component.html',
  styleUrl: './admin-weather.component.css',
})
export class AdminWeatherComponent implements OnInit {
  weatherData: WeatherForecast[] = [];
  loading = false;
  error: string | null = null;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeather();
  }

  loadWeather(): void {
    this.loading = true;
    this.error = null;

    this.weatherService.getWeatherForecast().subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching weather:', err);
        this.error = 'فشل تحميل بيانات الطقس';
        this.loading = false;
      },
    });
  }
}
