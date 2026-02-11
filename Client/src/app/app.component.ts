import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <span class="material-icons">shopping_bag</span>
          <h1>Product Management</h1>
        </div>
        
        <nav class="sidebar-nav">
          <a routerLink="/products" routerLinkActive="active" class="nav-item">
            <span class="material-icons">inventory_2</span>
            <span>Products</span>
          </a>
        </nav>
        
        <div class="sidebar-footer">
          <div class="api-info">
            <span class="material-icons">api</span>
            <span>REST API Demo</span>
          </div>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }
    
    .sidebar {
      width: 260px;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
    }
    
    .sidebar-header {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      .material-icons {
        font-size: 2rem;
      }
      
      h1 {
        font-size: 1.25rem;
        font-weight: 600;
        color: white;
        margin: 0;
      }
    }
    
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all 0.15s ease;
      
      .material-icons {
        font-size: 1.25rem;
      }
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
      }
      
      &.active {
        background-color: rgba(255, 255, 255, 0.15);
        color: white;
        border-left: 3px solid #60a5fa;
        padding-left: calc(1.5rem - 3px);
      }
    }
    
    .sidebar-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .api-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      
      .material-icons {
        font-size: 1rem;
      }
    }
    
    .main-content {
      flex: 1;
      margin-left: 260px;
      padding: 1.5rem;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'Product Management';
}
