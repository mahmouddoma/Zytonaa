import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type Product = {
  id: number;
  name: string;
  desc: string;
  img: string;
};

@Component({
  selector: 'app-products-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-component.component.html',
  styleUrl: './products-component.component.css',
})
export class ProductsComponentComponent {
  selectedProduct: Product | null = null;

  products: Product[] = [
    {
      id: 1,
      name: 'كروب ماكس',
      desc: 'النمو الخضري-مقاومة الأمراض - زيادة المحصول - زيادة الجودة',
      img: 'assets/images/1765821549773.jpg',
    },
    {
      id: 2,
      name: 'زيتو جيب',
      desc: 'يحتوي على حمض الجبريليك (Gibberellic Acid) - يعمل على استطالة الخلايا وتنشيط النمو الحسي - يُستخدم لكسر طور السكون في البذور والبراعم - يساعد في زيادة حجم حبات العنب وتحسين مواصفات الثمار التصديرية.',
      img: 'assets/images/1765821612465.jpg',
    },
    {
      id: 3,
      name: 'زيتو زينك',
      desc: 'زنك مخلبي عالي التركيز وسريع الامتصاص - يعالج أعراض نقص الزنك مثل تقزم القمم النامية واصفرار الأوراق الحديثة - يلعب دوراً أساسياً في تخليق الحمض الأميني "تريبتوفان" المسؤول عن تكوين الهرمونات النباتية (الأوكسينات).',
      img: 'assets/images/1765891184328.jpg',
    },
    {
      id: 4,
      name: 'True P-K',
      desc: 'مركب سائل عالي المحتوى من الفوسفور والبوتاسيوم - مثالي لمراحل التزهير والعقد والتحجيم - يمد النبات بالطاقة اللازمة للعمليات الحيوية - يعمل على زيادة حجم الثمار ورفع نسبة السكريات وتحسين التلوين وجودة المحصول.',
      img: 'assets/images/1765891268333.jpg',
    },
    {
      id: 5,
      name: 'زيتو كال - Zayto Cal',
      desc: 'كالسيوم سائل مدعم بالبورون - يعمل على تقوية الجدر الخلوية وزيادة صلابة الثمار - يمنع ظهور الأمراض الفسيولوجية مثل عفن الطرف الزهري وتشقق الثمار - يحسن من القدرة التخزينية للمحصول ويطيل فترة الصلاحية.',
      img: 'assets/images/1765891276258.jpg',
    },
    {
      id: 6,
      name: 'أوميجا K - بوتاسيوم 145',
      desc: 'بوتاسيوم في صورة نترات مع الأسينات سريعه الامتصاص - يستخدم لزيادة حجم الثمار و الخضراوات و الفواكه و المحاصيل - يستخدم في تلوين الموالح و العنب و المانجو لاحتوائه علي الأحماض الكيرومسيلي’ - يزيدد نسبة السكر في البنجر  - يزيد من قوة و صلابه الساق ',
      img: 'assets/images/1765891283736.jpg',
    },
    {
      id: 7,
      name: 'فيتا ماكس - Vita Max',
      desc: 'سماد غني  بالطحالب البحرية و الاحماض العضوية و يحتوي علي عناصر البوتاسيوم و النتيتروجين سهله الامتصاصو الانتقال داخل النباتات ',
      img: 'assets/images/AQMpqWLJiUop2iM2iKs2PZbBgxCL1uaYU5LOUFKi_fCK10ka9wN6sQXMcH55LilCDpyoqp5Mq_r9eLwl7pGhoha-.jpeg',
    },
  ];

  title = 'منتجاتنا السبع المميزة';
  subtitle = 'اكتشف مجموعتنا المختارة من أفضل الأسمدة والمخصبات الزراعية.';

  openDetails(product: Product) {
    this.selectedProduct = product;
  }
}
