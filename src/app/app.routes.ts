import { Routes } from '@angular/router';
import { HomeComponentComponent } from './Feature/home-component/home-component.component';
import { AboutComponentComponent } from './Feature/about-component/about-component.component';
import { ProductsComponentComponent } from './Feature/products-component/products-component.component';
import { NewsComponentComponent } from './Feature/news-component/news-component.component';
import { ContactComponentComponent } from './Feature/contact-component/contact-component.component';

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
  { path: '**', redirectTo: '' },
];
