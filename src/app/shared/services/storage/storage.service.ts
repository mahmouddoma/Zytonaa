import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  setItem<T>(key: string, value: T): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }

  getItem<T>(key: string): T | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const jsonValue = localStorage.getItem(key);
        if (jsonValue) {
          return JSON.parse(jsonValue) as T;
        }
        return null;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }
  clear(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    }
  }

  hasItem(key: string): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key) !== null;
    }
    return false;
  }
  async imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
