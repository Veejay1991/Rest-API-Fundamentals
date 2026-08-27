import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes)]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set the application title correctly', () => {
    expect(component.title).toBe('Product Management');
  });

  it('should render the title in the sidebar header', () => {
    const title = fixture.nativeElement.querySelector('.sidebar-header h1');

    expect(title?.textContent?.trim()).toBe('Product Management');
  });

  it('should render a navigation link to the Products page', () => {
    const link = fixture.debugElement.query(By.css('.sidebar-nav a')).nativeElement as HTMLAnchorElement;

    expect(link.textContent?.trim()).toContain('Products');
    expect(link.getAttribute('href')).toBe('/products');
  });
});
