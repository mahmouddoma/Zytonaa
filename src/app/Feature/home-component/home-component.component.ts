import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-component',
  imports: [RouterLink],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.css',
})
export class HomeComponentComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('galleryTrack') galleryTrack!: ElementRef<HTMLDivElement>;

  private animationId: number | null = null;
  private scrollPosition = 0;
  private isPaused = false;
  private speed = 0.6;

  private singleSetWidth = 0;
  private manualScrollTimer: any;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.waitForImages();
  }

  ngOnDestroy(): void {
    this.stopAnimation();
  }

  // =========================
  // INIT
  // =========================

  private waitForImages(): void {
    const interval = setInterval(() => {
      if (this.galleryTrack?.nativeElement.scrollWidth) {
        clearInterval(interval);
        this.calculateSingleSetWidth();
        this.setupHoverPause();
        this.startAnimation();
      }
    }, 100);

    setTimeout(() => clearInterval(interval), 5000);
  }

  private calculateSingleSetWidth(): void {
    const track = this.galleryTrack.nativeElement;
    this.singleSetWidth = track.scrollWidth / 2;
  }

  // =========================
  // CONTROLS
  // =========================

  scrollPrev(): void {
    this.manualMove(-1);
  }

  scrollNext(): void {
    this.manualMove(1);
  }

  private manualMove(direction: number): void {
    this.isPaused = true;

    const itemWidth = 320 + 24; // width + gap
    this.scrollPosition += direction * itemWidth;

    this.fixLoop();
    this.applyTransform();

    clearTimeout(this.manualScrollTimer);
    this.manualScrollTimer = setTimeout(() => {
      this.isPaused = false;
    }, 2000);
  }

  // =========================
  // LOOP LOGIC
  // =========================

  private fixLoop(): void {
    if (this.scrollPosition >= this.singleSetWidth) {
      this.scrollPosition -= this.singleSetWidth;
    }

    if (this.scrollPosition < 0) {
      this.scrollPosition += this.singleSetWidth;
    }
  }

  // =========================
  // ANIMATION
  // =========================

  private startAnimation(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        if (!this.isPaused) {
          this.scrollPosition += this.speed;
          this.fixLoop();
          this.applyTransform();
        }

        this.animationId = requestAnimationFrame(animate);
      };

      this.animationId = requestAnimationFrame(animate);
    });
  }

  private stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    clearTimeout(this.manualScrollTimer);
  }

  // =========================
  // UI HELPERS
  // =========================

  private applyTransform(): void {
    this.galleryTrack.nativeElement.style.transform =
      `translate3d(-${this.scrollPosition}px, 0, 0)`;
  }

  private setupHoverPause(): void {
    const track = this.galleryTrack.nativeElement;

    track.addEventListener('mouseenter', () => {
      this.isPaused = true;
    });

    track.addEventListener('mouseleave', () => {
      this.isPaused = false;
    });
  }
}
