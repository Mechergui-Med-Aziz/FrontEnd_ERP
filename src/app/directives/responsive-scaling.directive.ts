import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResponsiveScaling]',
  standalone: true
})
export class ResponsiveScalingDirective implements OnInit {
  @Input() minScale: number = 0.5;
  @Input() maxScale: number = 1.2;
  private originalStyles: any = {};

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Store original styles
    this.originalStyles = {
      transform: this.el.nativeElement.style.transform,
      transformOrigin: this.el.nativeElement.style.transformOrigin,
      width: this.el.nativeElement.style.width,
      height: this.el.nativeElement.style.height,
      overflow: this.el.nativeElement.style.overflow
    };
    
    // Set initial properties
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
    this.renderer.setStyle(this.el.nativeElement, 'height', '100%');
    this.renderer.setStyle(this.el.nativeElement, 'transform-origin', 'top left');
    this.renderer.setStyle(this.el.nativeElement, 'overflow', 'auto');
    
    // Initial adjustment
    this.adjustScale();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustScale();
  }

  @HostListener('window:zoom', ['$event'])
  onZoom(event: Event) {
    this.adjustScale();
  }

  // Adjust scale based on the browser zoom level and window size
  private adjustScale() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Calculate scale based on device pixel ratio (zoom level)
    let scale = 1 / devicePixelRatio;
    
    // Ensure scale is within bounds
    scale = Math.max(this.minScale, Math.min(this.maxScale, scale));
    
    // Apply scale transformation
    this.renderer.setStyle(this.el.nativeElement, 'transform', `scale(${scale})`);
    
    // Adjust container size to account for scaling
    const width = `${100 / scale}%`;
    this.renderer.setStyle(this.el.nativeElement, 'width', width);
  }
}
