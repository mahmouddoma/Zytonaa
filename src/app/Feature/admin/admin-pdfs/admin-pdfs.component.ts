import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PdfService } from '../../../shared/services/pdf.service';
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

  selectedFile: File | null = null;

  constructor(private pdfService: PdfService) {}

  ngOnInit(): void {  
    this.loadPdfs();
  }

  loadPdfs(): void {
    this.pdfService.getPdfs().subscribe({
      next: (pdfs) => {
        this.pdfFiles = pdfs;
      },
      error: (err) => {
        console.error('Error fetching pdfs:', err);
      },
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
      this.selectedFile = file;
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
    if (!this.formData.name || (!this.selectedFile && !this.editMode)) {
      alert('الرجاء ملء جميع الحقول واختيار ملف PDF');
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.formData.name);
    if (this.selectedFile) {
      formData.append('File', this.selectedFile);
    }

    if (this.editMode && this.selectedPdf?.id) {
      this.pdfService.updatePdf(this.selectedPdf.id, formData).subscribe({
        next: () => {
          this.loadPdfs();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error updating pdf', err);
          alert('حدث خطأ أثناء تحديث ملف PDF');
        },
      });
    } else {
      this.pdfService.createPdf(formData).subscribe({
        next: () => {
          this.loadPdfs();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating pdf', err);
          alert('حدث خطأ أثناء إضافة ملف PDF');
        },
      });
    }
  }

  deletePdf(pdf: PdfFile): void {
    if (confirm(`هل أنت متأكد من حذف ملف "${pdf.name}"؟`)) {
      if (pdf.id) {
        this.pdfService.deletePdf(pdf.id).subscribe({
          next: () => {
            this.loadPdfs();
          },
          error: (err) => {
            console.error('Error deleting pdf', err);
            alert('حدث خطأ أثناء حذف ملف PDF');
          },
        });
      }
    }
  }
}
