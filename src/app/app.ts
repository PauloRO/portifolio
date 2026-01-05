import {
  AfterViewInit,
  Component,
  OnDestroy,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

type Project = {
  title: string;
  status: string;
  subtitle: string;
  description: string;
  preview: string;
  tech: string[];
  meta: string[];
};

type Tech = {
  label: string;
  icon: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [CommonModule],
})
export class App implements AfterViewInit, OnDestroy {
  readonly title = signal('portifolio');

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private observer?: IntersectionObserver;
  readonly projects: Project[] = [
    {
      title: 'Carros Auto Mall ERP',
      status: 'Produção',
      subtitle: '',
      description:
        'Sistema ERP para gestão de compra e venda de carros. Sistema de cadastro de veiculos, clientes, fornecedores.. com regras de negocio para simulações e vendas.',
      preview:
        'linear-gradient(140deg, rgba(12, 32, 25, 0.78), rgba(8, 24, 19, 0.82)), url("assets/projetos/carros_erp.jpeg")',
      tech: ['Angular', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Docker', 'API REST', 'JWT', 'Design System'],
      meta: ['API REST', 'JWT', 'Design System'],
    },
    {
      title: 'Carros Auto Mall Site',
      status: 'Produção',
      subtitle: '',
      description:
        'Site para venda de veiculos.',
      preview:
        'linear-gradient(150deg, rgba(13, 36, 29, 0.82), rgba(6, 22, 17, 0.78)), url("assets/projetos/carros_site.jpeg")',
      tech: ['Angular', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Docker', 'API REST', 'JWT', 'Design System'],
      meta: ['Angular', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Docker', 'API REST', 'JWT', 'Design System'],
    },
    /* {
      title: 'Landing full height',
      status: 'Pessoal',
      subtitle: 'Landing 100vh com microinterações e scroll suave.',
      description:
        'Página one-page com seções ancoradas, animações suaves inspiradas em Material Motion e tipografia editorial.',
      preview:
        'linear-gradient(130deg, rgba(7, 28, 22, 0.78), rgba(9, 36, 27, 0.84)), url("https://images.unsplash.com/photo-1507537509458-b8312d35a233?auto=format&fit=crop&w=1200&q=80")',
      tech: ['Angular', 'Motion', 'Scroll suave'],
      meta: ['Microinterações', 'Animações', 'SEO'],
    }, */
  ];
  readonly selectedProject = signal<Project | null>(null);
  readonly techs: Tech[] = [
    { label: 'Angular', icon: '🅰️' },
    { label: 'TypeScript', icon: '🟦' },
    { label: 'Java', icon: '☕' },
    { label: 'Spring Boot', icon: '🌱' },
    { label: 'PostgreSQL', icon: '🐘' },
    { label: 'APIs REST', icon: '🔗' },
    { label: 'Node.js', icon: '🟢' },
    { label: 'NPM', icon: '📦' },
    { label: 'Firebase', icon: '🔥' },
    { label: 'Git', icon: '🔀' },
    { label: 'GitHub', icon: '🐙' },
    { label: 'Postman', icon: '✉️' },
    { label: 'Insomnia', icon: '🌙' },
    { label: 'Scrum', icon: '📈' },
    { label: 'Ionic', icon: '💠' },
    { label: 'HTML', icon: '🟧' },
    { label: 'CSS', icon: '🎨' },
  ];

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    elements.forEach((element) => {
      this.observer?.observe(element);
      const rect = element.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.9;
      if (inView) {
        element.classList.add('visible');
        this.observer?.unobserve(element);
      }
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.isBrowser) {
      document.documentElement.classList.remove('modal-open');
    }
  }

  openProject(project: Project): void {
    this.selectedProject.set(project);

    if (this.isBrowser) {
      document.documentElement.classList.add('modal-open');
    }
  }

  closeProject(): void {
    this.selectedProject.set(null);

    if (this.isBrowser) {
      document.documentElement.classList.remove('modal-open');
    }
  }

  getPreviewImage(preview: string): string {
    const match = preview.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : preview;
  }
}
