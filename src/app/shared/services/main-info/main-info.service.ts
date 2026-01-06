import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MainInfo } from '../../models/admin/admin.models';

@Injectable({
  providedIn: 'root',
})
export class MainInfoService {
  private apiUrl = `${environment.apiUrl}/Main`;

  constructor(private http: HttpClient) {}

  submitInfo(info: MainInfo): Observable<any> {
    const formData = new FormData();

    formData.append('Name', info.name);
    formData.append('whoWeAre', info.whoWeAre);
    formData.append('Purpose', info.purpose);

    if (info.logo) {
      formData.append('Logo', info.logo, info.logo.name);
    }

    // Append Addresses
    info.addresses.forEach((address, index) => {
      formData.append(`Addresses[${index}].Line1`, address.line1);
      if (address.line2) {
        formData.append(`Addresses[${index}].Line2`, address.line2);
      }
      formData.append(`Addresses[${index}].City`, address.city);
      formData.append(`Addresses[${index}].State`, address.state);
      formData.append(
        `Addresses[${index}].IsPrimary`,
        address.isPrimary.toString()
      );
    });

    // Append Phones
    info.phones.forEach((phone, index) => {
      formData.append(`Phones[${index}].Number`, phone.number);
      formData.append(`Phones[${index}].IsPrimary`, phone.isPrimary.toString());
    });

    return this.http.post(this.apiUrl, formData);
  }
}
