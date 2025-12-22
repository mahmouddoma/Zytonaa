import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../shared/services/admin.service';
import { PdfFile } from '../../../shared/models/admin.models';

@Component({
  selector: 'app-admin-pdfs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pdfs.component.html',
  styleUrl: './admin-pdfs.component.css',
})
export class AdminPdfsComponent implements OnInit {
  pdfFiles: PdfFile[] = [];
  showModal = false;
  editMode = false;
  selectedPdf: PdfFile | null = null;

  formData: PdfFile = {
    name: '',
    path: '',
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPdfs();
  }

  loadPdfs(): void {
    this.adminService.getPdfFiles().subscribe((pdfs) => {
      this.pdfFiles = pdfs;
    });
  }

  openAddModal(): void {
    this.editMode = false;
    this.formData = { name: '', path: '' };
    this.showModal = true;
  }

  openEditModal(pdf: PdfFile): void {
    this.editMode = true;
    this.selectedPdf = pdf;
    this.formData = { ...pdf };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editMode = false;
    this.selectedPdf = null;
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formData.path = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('الرجاء اختيار ملف PDF فقط');
    }
  }

  savePdf(): void {
    if (!this.formData.name || !this.formData.path) {
      alert('الرجاء ملء جميع الحقول واختيار ملف PDF');
      return;
    }

    if (this.editMode && this.selectedPdf?.id) {
      this.adminService.updatePdfFile(this.selectedPdf.id, this.formData);
    } else {
      this.adminService.addPdfFile(this.formData);
    }

    this.closeModal();
  }

  deletePdf(pdf: PdfFile): void {
    if (confirm(`هل أنت متأكد من حذف ملف "${pdf.name}"؟`)) {
      if (pdf.id) {
        this.adminService.deletePdfFile(pdf.id);
      }
    }
  }
}
