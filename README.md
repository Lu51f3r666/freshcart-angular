# FreshCart Angular

A modern e-commerce application built with Angular 17, featuring a complete shopping experience with user authentication, product management, shopping cart, and order processing.

## Features

- **User Authentication**: Sign up, sign in, forgot password, and reset password functionality
- **Product Management**: Browse products by categories and brands
- **Shopping Cart**: Add, remove, and update cart items
- **Wishlist**: Save favorite products
- **Order Management**: View order history and track orders
- **Responsive Design**: Mobile-friendly interface using Bootstrap 5
- **Real-time Updates**: Live cart updates and notifications
- **Offline Detection**: Shows offline status when internet connection is lost

## Tech Stack

- **Frontend Framework**: Angular 17
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms
- **Routing**: Angular Router with Guards
- **State Management**: RxJS BehaviorSubject
- **Notifications**: ngx-toastr
- **Authentication**: JWT Token-based
- **API**: RESTful API integration

## Project Structure

```
src/
├── app/
│   ├── auth-layout/          # Authentication layout
│   ├── main-layout/          # Main application layout
│   └── app.module.ts         # Root module
├── components/               # Shared components
│   ├── auth/                 # Authentication components
│   ├── home/                 # Home page component
│   ├── navbar/               # Navigation component
│   └── footer/               # Footer component
├── services/                 # API services
├── guards/                   # Route guards
├── interfaces/               # TypeScript interfaces
└── interceptors/             # HTTP interceptors
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd freshcart-angular
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

## API Integration

The application integrates with the FreshCart API endpoints:

- **Authentication**: `/auth/signin`, `/auth/signup`, `/auth/forgotPasswords`
- **Products**: `/products`, `/categories`, `/brands`
- **Cart**: `/cart`
- **Orders**: `/orders`

## Key Components

### Authentication
- **SignInComponent**: User login with email and password
- **SignUpComponent**: User registration with form validation
- **AuthGuard**: Protects routes requiring authentication
- **GuestGuard**: Prevents authenticated users from accessing auth pages

### Shopping
- **HomeComponent**: Landing page with featured products and categories
- **ProductService**: Handles all product-related API calls
- **CartService**: Manages shopping cart state and operations

### Layout
- **MainLayoutComponent**: Main application layout with navbar and footer
- **AuthLayoutComponent**: Authentication pages layout
- **NavbarComponent**: Navigation with cart count and user menu

## Development

### Adding New Components

1. Create component files:
```bash
ng generate component components/new-component
```

2. Add to appropriate module:
```typescript
@NgModule({
  declarations: [NewComponent],
  imports: [CommonModule, RouterModule]
})
export class NewComponentModule { }
```

3. Add routing if needed:
```typescript
{
  path: 'new-route',
  loadChildren: () => import('./components/new-component/new-component.module').then(m => m.NewComponentModule)
}
```

### Styling

- Global styles are in `src/styles.css`
- Component-specific styles use Angular's component styling
- Bootstrap classes are used for responsive design
- Custom CSS classes follow BEM methodology

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository. 