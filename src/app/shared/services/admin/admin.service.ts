import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import {
  Category,
  Product,
  NewsArticle,
  PdfFile,
} from '../../models/admin/admin.models';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly CATEGORIES_KEY = 'zytonaa_categories';
  private readonly PRODUCTS_KEY = 'zytonaa_products';
  private readonly NEWS_KEY = 'zytonaa_news';
  private readonly PDFS_KEY = 'zytonaa_pdfs';

  // Observables للبيانات
  private categoriesSubject!: BehaviorSubject<Category[]>;
  private productsSubject!: BehaviorSubject<Product[]>;
  private newsSubject!: BehaviorSubject<NewsArticle[]>;
  private pdfsSubject!: BehaviorSubject<PdfFile[]>;

  public categories$!: Observable<Category[]>;
  public products$!: Observable<Product[]>;
  public news$!: Observable<NewsArticle[]>;
  public pdfs$!: Observable<PdfFile[]>;

  constructor(private storageService: StorageService) {
    // Initialize BehaviorSubjects after storageService is injected
    this.categoriesSubject = new BehaviorSubject<Category[]>(
      this.loadCategories()
    );
    this.productsSubject = new BehaviorSubject<Product[]>(this.loadProducts());
    this.newsSubject = new BehaviorSubject<NewsArticle[]>(this.loadNews());
    this.pdfsSubject = new BehaviorSubject<PdfFile[]>(this.loadPdfs());

    this.categories$ = this.categoriesSubject.asObservable();
    this.products$ = this.productsSubject.asObservable();
    this.news$ = this.newsSubject.asObservable();
    this.pdfs$ = this.pdfsSubject.asObservable();

    this.initializeDefaultData();
  }

  // ==================== CATEGORIES ====================

  private loadCategories(): Category[] {
    const categories = this.storageService.getItem<Category[]>(
      this.CATEGORIES_KEY
    );
    return categories || [];
  }

  private saveCategories(categories: Category[]): void {
    this.storageService.setItem(this.CATEGORIES_KEY, categories);
    this.categoriesSubject.next(categories);
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  addCategory(category: Category): void {
    const categories = this.categoriesSubject.value;
    category.id = this.generateId();
    categories.push(category);
    this.saveCategories(categories);
  }

  updateCategory(id: string, updatedCategory: Category): void {
    const categories = this.categoriesSubject.value;
    const index = categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories[index] = { ...updatedCategory, id };
      this.saveCategories(categories);
    }
  }

  deleteCategory(id: string): void {
    const categories = this.categoriesSubject.value.filter((c) => c.id !== id);
    this.saveCategories(categories);
  }

  // ==================== PRODUCTS ====================

  private loadProducts(): Product[] {
    const products = this.storageService.getItem<Product[]>(this.PRODUCTS_KEY);
    return products || [];
  }

  private saveProducts(products: Product[]): void {
    this.storageService.setItem(this.PRODUCTS_KEY, products);
    this.productsSubject.next(products);
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  addProduct(product: Product): void {
    const products = this.productsSubject.value;
    product.id =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    products.push(product);
    this.saveProducts(products);
  }

  updateProduct(id: number, updatedProduct: Product): void {
    const products = this.productsSubject.value;
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products[index] = { ...updatedProduct, id };
      this.saveProducts(products);
    }
  }

  deleteProduct(id: number): void {
    const products = this.productsSubject.value.filter((p) => p.id !== id);
    this.saveProducts(products);
  }

  // ==================== NEWS ARTICLES ====================

  private loadNews(): NewsArticle[] {
    const news = this.storageService.getItem<NewsArticle[]>(this.NEWS_KEY);
    return news || [];
  }

  private saveNews(news: NewsArticle[]): void {
    this.storageService.setItem(this.NEWS_KEY, news);
    this.newsSubject.next(news);
  }

  getNewsArticles(): Observable<NewsArticle[]> {
    return this.news$;
  }

  addNewsArticle(article: NewsArticle): void {
    const news = this.newsSubject.value;
    article.id = this.generateId();
    article.publishDate = new Date();
    news.push(article);
    this.saveNews(news);
  }

  updateNewsArticle(id: string, updatedArticle: NewsArticle): void {
    const news = this.newsSubject.value;
    const index = news.findIndex((n) => n.id === id);
    if (index !== -1) {
      news[index] = { ...updatedArticle, id };
      this.saveNews(news);
    }
  }

  deleteNewsArticle(id: string): void {
    const news = this.newsSubject.value.filter((n) => n.id !== id);
    this.saveNews(news);
  }

  // ==================== PDF FILES ====================

  private loadPdfs(): PdfFile[] {
    const pdfs = this.storageService.getItem<PdfFile[]>(this.PDFS_KEY);
    return pdfs || [];
  }

  private savePdfs(pdfs: PdfFile[]): void {
    this.storageService.setItem(this.PDFS_KEY, pdfs);
    this.pdfsSubject.next(pdfs);
  }

  getPdfFiles(): Observable<PdfFile[]> {
    return this.pdfs$;
  }

  addPdfFile(pdf: PdfFile): void {
    const pdfs = this.pdfsSubject.value;
    pdf.id = this.generateId();
    pdf.uploadDate = new Date();
    pdfs.push(pdf);
    this.savePdfs(pdfs);
  }

  updatePdfFile(id: string, updatedPdf: PdfFile): void {
    const pdfs = this.pdfsSubject.value;
    const index = pdfs.findIndex((p) => p.id === id);
    if (index !== -1) {
      pdfs[index] = { ...updatedPdf, id };
      this.savePdfs(pdfs);
    }
  }

  deletePdfFile(id: string): void {
    const pdfs = this.pdfsSubject.value.filter((p) => p.id !== id);
    this.savePdfs(pdfs);
  }

  // ==================== HELPERS ====================

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // تهيئة البيانات الافتراضية إذا لم تكن موجودة
  private initializeDefaultData(): void {
    // إضافة الفئات الافتراضية إذا كانت فارغة
    if (this.categoriesSubject.value.length === 0) {
      const defaultCategories: Category[] = [
        {
          id: this.generateId(),
          name: 'منظمات النمو',
          img: 'assets/images/1765821612465.jpg',
          size: 'large',
        },
        {
          id: this.generateId(),
          name: 'مغذيات نباتية',
          img: 'assets/images/1765891184328.jpg',
          size: 'small',
        },
        {
          id: this.generateId(),
          name: 'أسمدة سائلة',
          img: 'assets/images/1765891268333.jpg',
          size: 'small',
        },
        {
          id: this.generateId(),
          name: 'محفزات نمو',
          img: 'assets/images/1765891276258.jpg',
          size: 'large',
        },
        {
          id: this.generateId(),
          name: 'مخصبات حيوية',
          img: 'assets/images/1765821549773.jpg',
          size: 'small',
        },
      ];
      this.saveCategories(defaultCategories);
    }

    // إضافة المنتجات الافتراضية
    if (this.productsSubject.value.length === 0) {
      const defaultProducts: Product[] = [
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
          desc: "بوتاسيوم في صورة نترات مع الأسينات سريعه الامتصاص - يستخدم لزيادة حجم الثمار و الخضراوات و الفواكه و المحاصيل - يستخدم في تلوين الموالح و العنب و المانجو لاحتوائه علي الأحماض الكيرومسيلي' - يزيدد نسبة السكر في البنجر  - يزيد من قوة و صلابه الساق ",
          img: 'assets/images/1765891283736.jpg',
        },
        {
          id: 7,
          name: 'فيتا ماكس - Vita Max',
          desc: 'سماد غني  بالطحالب البحرية و الاحماض العضوية و يحتوي علي عناصر البوتاسيوم و النتيتروجين سهله الامتصاصو الانتقال داخل النباتات ',
          img: 'assets/images/AQMpqWLJiUop2iM2iKs2PZbBgxCL1uaYU5LOUFKi_fCK10ka9wN6sQXMcH55LilCDpyoqp5Mq_r9eLwl7pGhoha-.jpeg',
        },
      ];
      this.saveProducts(defaultProducts);
    }

    // إضافة ملفات PDF الافتراضية
    if (this.pdfsSubject.value.length === 0) {
      const defaultPdfs: PdfFile[] = [
        {
          id: this.generateId(),
          name: 'أوميجا ك 1 لتر',
          path: 'assets/PDF/أوميجا ك 1 لتر.pdf',
        },
        {
          id: this.generateId(),
          name: 'ترو بي كي',
          path: 'assets/PDF/ترو بي كي.pdf',
        },
        {
          id: this.generateId(),
          name: 'زيتو بوتاس 1 لتر',
          path: 'assets/PDF/زيتو بوتاس 1 لتر.pdf',
        },
        {
          id: this.generateId(),
          name: 'زيتو حديد',
          path: 'assets/PDF/زيتو حديد.pdf',
        },
        {
          id: this.generateId(),
          name: 'زيتو زنك',
          path: 'assets/PDF/زيتو زنك.pdf',
        },
        {
          id: this.generateId(),
          name: 'زيتو فوس 1 لتر',
          path: 'assets/PDF/زيتو فوس 1 لتر.pdf',
        },
        {
          id: this.generateId(),
          name: 'زيتو كال 1 لتر',
          path: 'assets/PDF/زيتو كال 1 لتر.pdf',
        },
        {
          id: this.generateId(),
          name: 'فيتا ماكس',
          path: 'assets/PDF/فيتا ماكس.pdf',
        },
        {
          id: this.generateId(),
          name: 'وايت روتس 1 لتر',
          path: 'assets/PDF/وايت روتس 1 لتر.pdf',
        },
      ];
      this.savePdfs(defaultPdfs);
    }
  }
}
