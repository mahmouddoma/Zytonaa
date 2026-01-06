import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MainInfoService } from '../../../shared/services/main-info/main-info.service';

@Component({
  selector: 'app-admin-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-info.component.html',
  styleUrls: ['./admin-info.component.css'],
})
export class AdminInfoComponent implements OnInit {
  infoForm!: FormGroup;
  selectedLogo: File | null = null;
  selectedLogoPreview: string | ArrayBuffer | null = null;
  submitSuccess: boolean = false;
  submitError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mainInfoService: MainInfoService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.infoForm = this.fb.group({
      name: ['', Validators.required],
      whoWeAre: ['', Validators.required],
      purpose: ['', Validators.required],
      addresses: this.fb.array([]),
      phones: this.fb.array([]),
    });

    // Add initial empty fields
    this.addAddress();
    this.addPhone();
  }

  get addresses(): FormArray {
    return this.infoForm.get('addresses') as FormArray;
  }

  get phones(): FormArray {
    return this.infoForm.get('phones') as FormArray;
  }

  addAddress(): void {
    const addressGroup = this.fb.group({
      line1: ['', Validators.required],
      line2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      isPrimary: [false],
    });
    this.addresses.push(addressGroup);
  }

  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  addPhone(): void {
    const phoneGroup = this.fb.group({
      number: ['', Validators.required],
      isPrimary: [false],
    });
    this.phones.push(phoneGroup);
  }

  removePhone(index: number): void {
    this.phones.removeAt(index);
  }

  onLogoSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedLogo = file;

      const reader = new FileReader();
      reader.onload = (e) => (this.selectedLogoPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.infoForm.valid) {
      const formValue = this.infoForm.value;
      const infoData = {
        ...formValue,
        logo: this.selectedLogo,
      };

      this.mainInfoService.submitInfo(infoData).subscribe({
        next: (res) => {
          this.submitSuccess = true;
          this.submitError = false;
          // specific success logic if needed
          setTimeout(() => (this.submitSuccess = false), 3000);
        },
        error: (err) => {
          console.error('Error submitting info', err);
          this.submitError = true;
          this.submitSuccess = false;
        },
      });
    } else {
      this.infoForm.markAllAsTouched();
    }
  }
}
