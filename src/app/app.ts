import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Project = {
  title: string;
  status: string;
  subtitle: string;
  description: string;
  image: string;
  tone: string;
  tech: string[];
  meta: string[];
  link?: string;
};

type Job = {
  period: string;
  company: string;
  role: string;
  points: string[];
  tags: string[];
};

type Skill = {
  label: string;
  icon: string;
};

type SkillGroup = {
  title: string;
  items: Skill[];
};

type NavItem = {
  id: string;
  label: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private observer?: IntersectionObserver;
  private readonly timers = new Set<number>();

  readonly progress = signal(0);
  readonly activeSection = signal('home');
  readonly menuOpen = signal(false);
  readonly wipeState = signal<'idle' | 'enter' | 'leave' | 'snap'>('idle');
  readonly wipeLabel = signal('');
  readonly modalOpen = signal(false);
  readonly modalProject = signal<Project | null>(null);

  readonly nav: NavItem[] = [
    { id: 'about', label: 'Sobre' },
    { id: 'experience', label: 'Experiência' },
    { id: 'projects', label: 'Projetos' },
    { id: 'tech', label: 'Stack' },
  ];

  readonly ticker = [
    'Angular',
    'TypeScript',
    'Java',
    'Spring Boot',
    'PostgreSQL',
    'Next.js',
    'Docker',
    'RxJS',
    'Tailwind',
    'JWT',
  ];

  readonly projects: Project[] = [
    {
      title: 'Carros Auto Mall ERP',
      status: 'Produção',
      subtitle: 'Gestão de compra e venda de veículos',
      description:
        'Sistema ERP para gestão de compra e venda de carros. Cadastro de veículos, clientes e fornecedores, com regras de negócio para simulações e vendas.',
      image: 'assets/projetos/carros_erp.jpeg',
      tone: 'linear-gradient(160deg, #235347 0%, #051f20 100%)',
      tech: ['Angular', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Docker', 'API REST', 'JWT', 'Design System'],
      meta: ['API REST', 'JWT', 'Design System'],
    },
    {
      title: 'Carros Auto Mall Site',
      status: 'Produção',
      subtitle: 'Vitrine para venda de veículos',
      description: 'Site para venda de veículos.',
      image: 'assets/projetos/carros_site.jpeg',
      tone: 'linear-gradient(145deg, #163832 0%, #0b2b26 100%)',
      tech: ['Angular', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Docker', 'API REST', 'JWT', 'Design System'],
      meta: ['Angular', 'TypeScript', 'Spring Boot', 'PostgreSQL'],
    },
    {
      title: 'LawHubber',
      status: 'Pessoal',
      subtitle: 'Gestão de escritório de advocacia.',
      description:
        'Aplicação web de gestão jurídica (processos, contratos, clientes, advogados, tarefas e publicações do DJEN), com dashboard, auditoria, autenticação, rotas protegidas e carregamento sob demanda. Conta com guards de rota, interceptor HTTP, formulários reativos e proteção contra saída com alterações não salvas.',
      image: 'assets/projetos/lawhubber.png',
      tone: 'linear-gradient(150deg, #0b2b26 0%, #051f20 100%)',
      tech: ['Angular 21', 'TypeScript', 'RxJS', 'PrimeNG', 'Tailwind CSS', 'Chart.js', 'Vitest'],
      meta: [
        'Angular 21',
        'Standalone',
        'Signals',
        'Lazy loading',
        'SSR',
        'Guards de rota',
        'Interceptor HTTP',
        'Formulários reativos',
        'PrimeNG',
        'Tailwind CSS',
        'Chart.js',
        'Vitest',
      ],
    },
    {
      title: 'App Médico',
      status: 'Produção',
      subtitle: 'Agenda de médicos para uso no celular',
      description:
        'Plataforma web voltada à agenda de médicos, pensada para uso em dispositivos móveis, com acesso rápido e prático.',
      image: 'assets/projetos/app_medico.jpeg',
      tone: 'linear-gradient(160deg, #235347 0%, #0b2b26 100%)',
      tech: ['Angular', 'TypeScript', 'Angular Material', 'Bootstrap'],
      meta: ['Angular', 'TypeScript', 'Angular Material', 'Bootstrap'],
      link: 'https://www.appmedico.com.br/home',
    },
    {
      title: 'e-ITBI',
      status: 'Produção',
      subtitle: 'ITBI eletrônico da Prefeitura de Uberlândia',
      description:
        'Sistema web para o processo eletrônico do ITBI (imposto sobre transmissão de bens imóveis), digitalizando o atendimento ao contribuinte.',
      image: 'assets/projetos/itbi.png',
      tone: 'linear-gradient(150deg, #163832 0%, #051f20 100%)',
      tech: ['Angular', 'TypeScript', 'Angular Material'],
      meta: ['Angular', 'TypeScript', 'Angular Material'],
      link: 'https://eitbi.uberlandia.mg.gov.br/home',
    },
    {
      title: 'Minha Nova Casa',
      status: 'Produção',
      subtitle: 'ERP de crédito imobiliário',
      description:
        'ERP de gestão de crédito imobiliário para construtoras, integrado a uma jornada que vai do atendimento do lead até a contratação do financiamento. Atuação no front-end, com ajustes de layout e implementação de regras de negócio.',
      image: 'assets/projetos/minha_nova_casa.png',
      tone: 'linear-gradient(145deg, #0b2b26 0%, #235347 100%)',
      tech: ['React', 'TypeScript', 'Vite'],
      meta: ['React', 'TypeScript', 'Vite'],
      link: 'https://minhanova.casa/',
    },
    {
      title: 'Way',
      status: 'Produção',
      subtitle: 'Gestão de correspondências',
      description:
        'Plataforma web para gerenciar correspondências, solicitações, e-mails e tramitações entre concessionárias e órgãos reguladores. Possui controle de prazos, dashboard com métricas, permissões por perfil, suporte a múltiplos clientes com identidade visual própria e exportação de relatórios em PDF e Excel.',
      image: '',
      tone: 'linear-gradient(155deg, #163832 0%, #051f20 100%)',
      tech: [
        'Next.js',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'TanStack Query',
        'React Hook Form',
        'Zod',
        'Java',
        'API REST',
        'JWT',
      ],
      meta: [
        'Next.js',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'TanStack Query',
        'React Hook Form',
        'Zod',
        'Java',
        'API REST',
        'JWT',
      ],
    },
    {
      title: 'Migração eSocial',
      status: 'Entrega',
      subtitle: 'RH da Câmara Municipal de Uberlândia',
      description:
        'Migração dos eventos do eSocial do RH legado da Câmara Municipal de Uberlândia (PostgreSQL) para o GRH da Prefeitura (Oracle). Na fase de eventos, escrevi os scripts SQL que levam esses dados do banco antigo ao barramento eSocial do novo sistema. O mapeamento foi coluna a coluna nos eventos S-1010 (rubricas), S-2200 (admissão e dependentes), S-2300 (trabalhador sem vínculo), S-2298 (reintegração) e S-2299 (desligamento), com tratamento de retificações e recuperação do recibo original. Também migrei os XMLs enviados ao governo, criei a tabela de de-para dos dependentes e documentei os scripts da fase.',
      image: '',
      tone: 'linear-gradient(165deg, #235347 0%, #163832 100%)',
      tech: ['SQL', 'PostgreSQL', 'Oracle', 'eSocial', 'Git/GitLab'],
      meta: ['SQL', 'PostgreSQL', 'Oracle', 'eSocial', 'Git/GitLab'],
    },
  ];

  readonly jobs: Job[] = [
    {
      period: '07/2022 — 06/2026',
      company: 'Code Square',
      role: 'Desenvolvedor Full Stack',
      points: [
        'Desenvolvimento de interfaces de usuário (front-end) com Angular, aplicando boas práticas de design responsivo e interativo para garantir uma experiência de usuário fluida.',
        'Atuação no desenvolvimento Back-end utilizando Java com Spring Boot (padrão MVC), com foco na criação de APIs RESTful e regras de negócio eficientes.',
        'Refatoração de código para atualização de versões e melhoria da legibilidade e performance do projeto.',
        'Integração de APIs e serviços externos para ampliar as funcionalidades das aplicações.',
        'Utilização de bancos de dados PostgreSQL com ferramentas como pgAdmin e DBeaver para modelagem, consultas e manutenção.',
        'Correção de bugs, melhoria de desempenho e testes para assegurar a qualidade do produto final.',
        'Trabalho colaborativo com equipe multidisciplinar, aplicando metodologias ágeis (como Scrum/Kanban)',
      ],
      tags: ['Angular', 'Spring Boot', 'Java', 'PostgreSQL', 'RESTful', 'Scrum', 'Git', 'GitHub', 'pgAdmin', 'DBeaver', 'Postman', 'Insomnia'],
    },
    {
      period: '08/2026 — Atual',
      company: 'RTech Solutions',
      role: 'Desenvolvedor Full Stack',
      points: [
        'Realizei manutenção evolutiva de telas e layout em Angular no Portal ITBI-e da Prefeitura de Uberlândia, corrigindo problemas de usabilidade e fluxo nas telas de emissão e consulta do Imposto sobre Transmissão de Bens Imóveis para os contribuintes do município.',
        'Desenvolvi telas, formulários e fluxos de frontend em Next.js (React) de um sistema multi-tenant de gestão de correspondências, utilizado por concessionárias e órgãos reguladores para controle de solicitações, tramitações e prazos.',
        'Desenvolvi e versionei queries SQL avançadas para migração de dados de RH e folha de pagamento do sistema legado (PostgreSQL) para o módulo GRH, na Câmara Municipal de Uberlândia.',
        'Elaborei de-paras e processos de remigração e auditoria de dados, assegurando a conformidade dos eventos eSocial (admissão, remuneração, afastamento e desligamento) durante a migração.',
      ],
      tags: ['Angular', 'Next.js', 'React', 'TypeScript', 'PostgreSQL', 'SQL', 'eSocial', 'Multi-tenant'],
    },
  ];

  readonly skillGroups: SkillGroup[] = [
    {
      title: 'Front-end',
      items: [
        { label: 'Angular', icon: 'assets/icones-portfolio/01-angular.svg' },
        { label: 'Next.js', icon: 'assets/icones-portfolio/02-nextjs.svg' },
        { label: 'TypeScript', icon: 'assets/icones-portfolio/03-typescript.svg' },
        { label: 'JavaScript', icon: 'assets/icones-portfolio/04-javascript.svg' },
        { label: 'RxJS', icon: 'assets/icones-portfolio/05-rxjs.svg' },
        { label: 'PrimeNG', icon: 'assets/icones-portfolio/06-primeng.svg' },
        { label: 'Tailwind CSS', icon: 'assets/icones-portfolio/07-tailwind-css.svg' },
        { label: 'HTML5', icon: 'assets/icones-portfolio/08-html5.svg' },
        { label: 'CSS/SCSS', icon: 'assets/icones-portfolio/09-css-scss.svg' },
        { label: 'Formulários Reativos', icon: 'assets/icones-portfolio/10-formularios-reativos.svg' },
      ],
    },
    {
      title: 'Back-end',
      items: [
        { label: 'Java', icon: 'assets/icones-portfolio/11-java.svg' },
        { label: 'Spring Boot', icon: 'assets/icones-portfolio/12-spring-boot.svg' },
        { label: 'Spring Security', icon: 'assets/icones-portfolio/13-spring-security.svg' },
        { label: 'JPA/Hibernate', icon: 'assets/icones-portfolio/14-jpa-hibernate.svg' },
        { label: 'Bean Validation', icon: 'assets/icones-portfolio/15-bean-validation.svg' },
        { label: 'Maven', icon: 'assets/icones-portfolio/19-maven.svg' },
        { label: 'JasperReports', icon: 'assets/icones-portfolio/20-jasperreports.svg' },
        { label: 'APIs REST', icon: 'assets/icones-portfolio/21-apis-rest.svg' },
        { label: 'JWT', icon: 'assets/icones-portfolio/22-jwt.svg' },
        { label: 'APIs de veículos', icon: 'assets/icones-portfolio/24-apis-veiculos.svg' },
      ],
    },
    {
      title: 'Dados',
      items: [
        { label: 'PostgreSQL', icon: 'assets/icones-portfolio/16-postgresql.svg' },
        { label: 'SQL Server', icon: 'assets/icones-portfolio/17-sql-server.svg' },
        { label: 'Liquibase', icon: 'assets/icones-portfolio/18-liquibase.svg' },
      ],
    },
    {
      title: 'Entrega',
      items: [
        { label: 'Google Cloud Storage', icon: 'assets/icones-portfolio/23-google-cloud-storage.svg' },
        { label: 'Docker', icon: 'assets/icones-portfolio/25-docker.svg' },
        { label: 'Git/GitLab', icon: 'assets/icones-portfolio/26-git-gitlab.svg' },
        { label: 'Testes Unitários', icon: 'assets/icones-portfolio/27-testes-unitarios.svg' },
        { label: 'Code Review', icon: 'assets/icones-portfolio/28-code-review.svg' },
        { label: 'Scrum/Kanban', icon: 'assets/icones-portfolio/29-scrum-kanban.svg' },
        { label: 'Deploy', icon: 'assets/icones-portfolio/30-deploy.svg' },
      ],
    },
  ];

  private readonly onScroll = (): void => {
    const root = document.documentElement;
    const height = root.scrollHeight - root.clientHeight;
    this.progress.set(height > 0 ? (root.scrollTop / height) * 100 : 0);

    const marker = window.innerHeight * 0.38;
    let current = 'home';
    for (const id of ['home', 'about', 'experience', 'projects', 'tech', 'contact']) {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= marker) {
        current = id;
      }
    }
    this.activeSection.set(current);
  };

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.onScroll();
    window.addEventListener('scroll', this.onScroll, { passive: true });

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const elements = document.querySelectorAll<HTMLElement>('.reveal');

    if (reduce || typeof IntersectionObserver === 'undefined') {
      elements.forEach((element) => element.classList.add('is-in'));
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add('is-in');
          this.observer?.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((element) => this.observer?.observe(element));
    this.revealInView();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onScroll);
      document.documentElement.classList.remove('modal-open');
      this.timers.forEach((id) => window.clearTimeout(id));
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.modalOpen()) {
      this.closeProject();
      return;
    }
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      this.syncScrollLock();
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.syncScrollLock();
  }

  goTo(event: Event, id: string, label: string): void {
    event.preventDefault();
    if (!this.isBrowser || this.wipeState() !== 'idle') {
      return;
    }

    this.menuOpen.set(false);
    this.syncScrollLock();

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      this.jumpTo(id);
      return;
    }

    this.wipeLabel.set(label);
    this.wipeState.set('enter');
    this.later(() => {
      this.jumpTo(id);
      this.wipeState.set('leave');
      this.later(() => {
        this.wipeState.set('snap');
        this.later(() => this.wipeState.set('idle'), 50);
      }, 680);
    }, 560);
  }

  techIcon(label: string): string {
    for (const group of this.skillGroups) {
      const item = group.items.find((entry) => entry.label === label);
      if (item) {
        return item.icon;
      }
    }
    return '';
  }

  openProject(project: Project): void {
    this.modalProject.set(project);
    this.modalOpen.set(true);
    this.syncScrollLock();
  }

  closeProject(): void {
    this.modalOpen.set(false);
    this.syncScrollLock();
    this.later(() => {
      if (!this.modalOpen()) {
        this.modalProject.set(null);
      }
    }, 280);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).remove();
  }

  private jumpTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    this.activeSection.set(id);
    this.revealInView();
  }

  private revealInView(): void {
    document.querySelectorAll<HTMLElement>('.reveal').forEach((element) => {
      if (element.classList.contains('is-in')) {
        return;
      }
      const rect = element.getBoundingClientRect();
      const visible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
      if (visible) {
        element.classList.add('is-in');
        this.observer?.unobserve(element);
      }
    });
  }

  private syncScrollLock(): void {
    if (!this.isBrowser) {
      return;
    }
    document.documentElement.classList.toggle('modal-open', this.menuOpen() || this.modalOpen());
  }

  private later(fn: () => void, ms: number): void {
    const id = window.setTimeout(() => {
      this.timers.delete(id);
      fn();
    }, ms);
    this.timers.add(id);
  }
}
