import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdminService } from '../../shared/services/admin/admin.service';
import { PdfFile } from '../../shared/models/admin/admin.models';

@Component({
  selector: 'app-about-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-component.component.html',
  styleUrl: './about-component.component.css',
})
export class AboutComponentComponent implements OnInit {
  currentPdfUrl: SafeResourceUrl | null = null;
  currentPdfPath: string = '';
  pdfFiles: PdfFile[] = [];

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

  products: any[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.adminService.getPdfFiles().subscribe((pdfs) => {
      this.pdfFiles = pdfs;
      this.products = pdfs.map((pdf, i) => ({
        id: i + 1,
        name: pdf.name,
        pdfPath: pdf.path,
        image: this.productImages[i % this.productImages.length],
      }));
    });
  }

  openPdf(path: string) {
    this.currentPdfPath = path;
    this.currentPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }
}
