import { Routes } from '@angular/router';
import { HomeComponentComponent } from './Feature/home-component/home-component.component';
import { AboutComponentComponent } from './Feature/about-component/about-component.component';
import { ProductsComponentComponent } from './Feature/products-component/products-component.component';
import { NewsComponentComponent } from './Feature/news-component/news-component.component';
import { ContactComponentComponent } from './Feature/contact-component/contact-component.component';
import { adminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponentComponent,
    title: 'زيتونة للأسمدة | الرئيسية',
  },
  {
    path: 'about',
    component: AboutComponentComponent,
    title: 'من نحن — زيتونة',
  },
  {
    path: 'products',
    component: ProductsComponentComponent,
    title: 'منتجاتنا — زيتونة',
  },
  {
    path: 'news',
    component: NewsComponentComponent,
    title: 'الأخبار — زيتونة',
  },
  {
    path: 'contact',
    component: ContactComponentComponent,
    title: 'تواصل معنا — زيتونة',
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./Feature/admin/admin-login/admin-login.component').then(
        (m) => m.AdminLoginComponent
      ),
    title: 'تسجيل دخول المدير — زيتونة',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./Feature/admin/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
    canActivate: [adminGuard],
    title: 'لوحة التحكم — زيتونة',
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './Feature/admin/admin-overview/admin-overview.component'
          ).then((m) => m.AdminOverviewComponent),
        title: 'نظرة عامة — لوحة التحكم',
      },
      {
        path: 'categories',
        loadComponent: () =>
          import(
            './Feature/admin/admin-categories/admin-categories.component'
          ).then((m) => m.AdminCategoriesComponent),
        title: 'إدارة الفئات — لوحة التحكم',
      },
      {
        path: 'products',
        loadComponent: () =>
          import(
            './Feature/admin/admin-products/admin-products.component'
          ).then((m) => m.AdminProductsComponent),
        title: 'إدارة المنتجات — لوحة التحكم',
      },
      {
        path: 'news',
        loadComponent: () =>
          import('./Feature/admin/admin-news/admin-news.component').then(
            (m) => m.AdminNewsComponent
          ),
        title: 'إدارة الأخبار — لوحة التحكم',
      },
      {
        path: 'pdfs',
        loadComponent: () =>
          import('./Feature/admin/admin-pdfs/admin-pdfs.component').then(
            (m) => m.AdminPdfsComponent
          ),
        title: 'إدارة ملفات PDF — لوحة التحكم',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
