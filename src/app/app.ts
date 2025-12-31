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
      title: 'Portal interno Angular',
      status: 'Produção',
      subtitle: 'Painéis dinâmicos, autenticação e UX acessível.',
      description:
        'Dashboard interno com cards configuráveis, autenticação JWT, gráficos em tempo real e navegação acessível seguindo Material 3.',
      preview:
        'linear-gradient(140deg, rgba(12, 32, 25, 0.78), rgba(8, 24, 19, 0.82)), url("https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1200&q=80")',
      tech: ['Angular', 'TypeScript', 'A11y'],
      meta: ['API REST', 'JWT', 'Design System'],
    },
    {
      title: 'APIs Spring Boot',
      status: 'Backend',
      subtitle: 'APIs RESTful com regras de negócio e monitoramento.',
      description:
        'Camada de serviços com Spring Boot (MVC), versionamento de endpoints, validação, métricas e integrações com PostgreSQL.',
      preview:
        'linear-gradient(150deg, rgba(13, 36, 29, 0.82), rgba(6, 22, 17, 0.78)), url("https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80")',
      tech: ['Spring Boot', 'PostgreSQL', 'Docker'],
      meta: ['RESTful', 'Observability', 'Clean Architecture'],
    },
    {
      title: 'Landing full height',
      status: 'Pessoal',
      subtitle: 'Landing 100vh com microinterações e scroll suave.',
      description:
        'Página one-page com seções ancoradas, animações suaves inspiradas em Material Motion e tipografia editorial.',
      preview:
        'linear-gradient(130deg, rgba(7, 28, 22, 0.78), rgba(9, 36, 27, 0.84)), url("https://images.unsplash.com/photo-1507537509458-b8312d35a233?auto=format&fit=crop&w=1200&q=80")',
      tech: ['Angular', 'Motion', 'Scroll suave'],
      meta: ['Microinterações', 'Animações', 'SEO'],
    },
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
}
