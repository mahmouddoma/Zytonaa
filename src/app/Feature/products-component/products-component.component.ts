import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
type Product = {
  id: number;
  name: string;
  desc: string;
  tag?: string;
  img: string;
};
@Component({
  selector: 'app-products-component',
  imports: [CommonModule],
  templateUrl: './products-component.component.html',
  styleUrl: './products-component.component.css',
})
export class ProductsComponentComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Zy-Grow 20-20-20',
      desc: 'NPK متوازن للنمو الخضري المبكر.',
      tag: 'الأكثر طلبًا',
      img: 'assets/products/npk.jpg',
    },
    {
      id: 2,
      name: 'Zy-Cal Boron',
      desc: 'كالسيوم + بورون لتقوية الخلايا وتحسين العقد.',
      img: 'assets/products/calboron.jpg',
    },
    {
      id: 3,
      name: 'Zy-Micro Mix',
      desc: 'عناصر صغرى مخلبة لرفع كفاءة التمثيل.',
      img: 'assets/products/micro.jpg',
    },
    {
      id: 4,
      name: 'Zy-Root Booster',
      desc: 'منشّط جذور لزيادة الامتصاص.',
      img: 'assets/products/root.jpg',
    },
    {
      id: 5,
      name: 'Zy-K Potassium',
      desc: 'بوتاسيوم عالي للجودة وتحسين التلوّن.',
      img: 'assets/products/k.jpg',
    },
    {
      id: 6,
      name: 'Zy-Amino',
      desc: 'أحماض أمينية لتحمل الإجهاد.',
      img: 'assets/products/amino.jpg',
    },
  ];
}
