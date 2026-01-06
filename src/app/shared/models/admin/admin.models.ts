export interface Category {
  id?: any;
  name: string;
  img?: string;
  imageUrl?: string;
  size: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface Product {
  id: number;
  name: string;
  desc: string;
  img: string;
}

export interface NewsArticle {
  id?: string;
  title: string;
  content: string;
  image: string;
  publishDate: Date;
  author?: string;
}

export interface PdfFile {
  id?: string;
  name: string;
  path: string;
  uploadDate?: Date;
}

export interface AdminUser {
  username: string;
  password: string;
}

export interface AddressDto {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  isPrimary: boolean;
}

export interface PhoneDto {
  number: string;
  isPrimary: boolean;
}

export interface MainInfo {
  name: string;
  whoWeAre: string;
  purpose: string;
  logo?: File;
  addresses: AddressDto[];
  phones: PhoneDto[];
}
