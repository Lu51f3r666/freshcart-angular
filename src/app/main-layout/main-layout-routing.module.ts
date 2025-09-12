import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../../components/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../../components/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'products',
        loadChildren: () => import('../../components/products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'products/category/:categoryName/:categoryId',
        loadChildren: () => import('../../components/products-by-category/products-by-category.module').then(m => m.ProductsByCategoryModule)
      },
      {
        path: 'products/brand/:brandName/:brandId',
        loadChildren: () => import('../../components/products-by-brand/products-by-brand.module').then(m => m.ProductsByBrandModule)
      },
      {
        path: 'product-details/:slug/:id',
        loadChildren: () => import('../../components/product-details/product-details.module').then(m => m.ProductDetailsModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../../components/categories/categories.module').then(m => m.CategoriesModule)
      },
      {
        path: 'brands',
        loadChildren: () => import('../../components/brands/brands.module').then(m => m.BrandsModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../components/cart/cart.module').then(m => m.CartModule)
      },
      {
        path: 'shippingAddress/:cartId',
        loadChildren: () => import('../../components/address/address.module').then(m => m.AddressModule)
      },
      {
        path: 'allorders',
        loadChildren: () => import('../../components/all-orders/all-orders.module').then(m => m.AllOrdersModule)
      },
      {
        path: 'order-details/:orderId',
        loadChildren: () => import('../../components/order-details/order-details.module').then(m => m.OrderDetailsModule)
      },
      {
        path: 'wishlist',
        loadChildren: () => import('../../components/wishlist/wishlist.module').then(m => m.WishlistModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule { } 