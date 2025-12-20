import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-about-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-component.component.html',
  styleUrl: './about-component.component.css',
})
export class AboutComponentComponent {
  constructor(private sanitizer: DomSanitizer) {}

  currentPdfUrl: SafeResourceUrl | null = null;
  currentPdfPath: string = '';

  // Images for thumbnails
  productImages = [
    'assets/images/OmegaK.png',
    'assets/images/truep-k.png',
    'assets/images/zyto-botas.png',
    'assets/images/zayto-ferro.png',
    'assets/images/zayto-zinc.png',
    'assets/images/zayto-fos.png',
    'assets/images/zayto-cal.png',
    'assets/images/vita-max.png',
    'assets/images/white-roots.png',
  ];

  // List of PDF files
  pdfFiles = [
    { name: 'أوميجا ك 1 لتر', path: 'assets/PDF/أوميجا ك 1 لتر.pdf' },
    { name: 'ترو بي كي', path: 'assets/PDF/ترو بي كي.pdf' },
    { name: 'زيتو بوتاس 1 لتر', path: 'assets/PDF/زيتو بوتاس 1 لتر.pdf' },
    { name: 'زيتو حديد', path: 'assets/PDF/زيتو حديد.pdf' },
    { name: 'زيتو زنك', path: 'assets/PDF/زيتو زنك.pdf' },
    { name: 'زيتو فوس 1 لتر', path: 'assets/PDF/زيتو فوس 1 لتر.pdf' },
    { name: 'زيتو كال 1 لتر', path: 'assets/PDF/زيتو كال 1 لتر.pdf' },
    { name: 'فيتا ماكس', path: 'assets/PDF/فيتا ماكس.pdf' },
    { name: 'وايت روتس 1 لتر', path: 'assets/PDF/وايت روتس 1 لتر.pdf' },
  ];

  products = this.pdfFiles.map((pdf, i) => ({
    id: i + 1,
    name: pdf.name,
    pdfPath: pdf.path,
    image: this.productImages[i % this.productImages.length],
  }));

  openPdf(path: string) {
    this.currentPdfPath = path;
    // Bypass security to allow iframe to load the PDF
    this.currentPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }
}
