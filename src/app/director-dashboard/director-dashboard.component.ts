import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { BesoinsService } from '../services/besoins.service';
import { ProfileService } from '../services/profile.service';
import { forkJoin } from 'rxjs';
import { ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-director-dashboard',
  standalone: true,
  imports: [NgChartsModule,CommonModule],
  templateUrl: './director-dashboard.component.html',
  styleUrls: ['./director-dashboard.component.css']
})
export class DirectorDashboardComponent implements OnInit, AfterViewInit {
  
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  constructor(private besoinService: BesoinsService, private cdRef: ChangeDetectorRef, private userService: ProfileService) {}

  besoins: any[] = [];
  lastYearBesoins: any[] = [];
  
  moisLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  statusLabels: string[] = ['A_TRAITER', 'ABANDONNÉ', 'OK_PREQUALIFIE', 'EN_COURS', 'GAGNÉ', 'PERDU', 'REPORTE'];
  
  totalBesoins: number = 0;
  besoinsGagnes: number = 0;
  besoinsPerdus: number = 0;
  besoinsReporte: number = 0;
  
  pourcentageGagnes: number = 0;
  pourcentagePerdus: number = 0;
  pourcentageReporte: number = 0;
  

  dataLoaded: boolean = false;

  ngOnInit(): void {
    this.loadData();
  }
  
  ngAfterViewInit(): void {
    if (this.dataLoaded) {
      this.updateCharts();
    }
  }
  
  loadData(): void {
    this.besoinService.findAllBesoins().subscribe((data: any) => {
      this.besoins = data;
      const userRequests = this.besoins.map(b =>
        this.userService.findUserById(b.createdBy).pipe()
      );

      forkJoin(userRequests).subscribe((users: any[]) => {
        this.besoins.forEach((b, index) => {
          b.createdBy = users[index];
        });

        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;

        this.lastYearBesoins = this.besoins.filter(b => new Date(b.creationDate).getFullYear() === lastYear);
        this.besoins = this.besoins.filter(b => new Date(b.creationDate).getFullYear() === currentYear);
        this.calculateSummaryMetrics();
        
        this.updateBesoinsParMois(this.besoins);
        this.updateLastYearBesoinsParMois(this.lastYearBesoins);
        this.updateBesoinsParStatut(this.besoins);
        this.updateBesoinsParUser(this.besoins);
        
        this.dataLoaded = true;
        
        this.cdRef.detectChanges();
        
        setTimeout(() => {
          this.updateCharts();
        }, 0);
      });
    });
  }
  
  updateCharts(): void {
    if (this.charts) {
      this.charts.forEach(chart => {
        if (chart && chart.chart) {
          chart.chart.update();
        }
      });
    }
  }

  calculateSummaryMetrics(): void {
    this.totalBesoins = this.besoins.length;
    this.besoinsGagnes = this.besoins.filter(b => b.status === 'GAGNÉ').length;
    this.besoinsPerdus = this.besoins.filter(b => b.status === 'PERDU').length;
    this.besoinsReporte = this.besoins.filter(b => b.status === 'REPORTE').length;
    
    this.pourcentageGagnes = this.totalBesoins ? Math.round((this.besoinsGagnes / this.totalBesoins) * 100) : 0;
    this.pourcentagePerdus = this.totalBesoins ? Math.round((this.besoinsPerdus / this.totalBesoins) * 100) : 0;
    this.pourcentageReporte = this.totalBesoins ? Math.round((this.besoinsReporte / this.totalBesoins) * 100) : 0;
  }

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          precision: 0
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000
    },
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      y: {
        display: false,
      }
    }
  };


  besoinsParMoisData = {
    labels: this.moisLabels,
    datasets: [
      {
        label: 'Besoins créés par mois cette année',
        data: [] as Number[],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }
    ]
  };

  besoinsParStatusData: { labels: string[], datasets: { label: string, data: number[], backgroundColor: string[] }[] } = {
    labels: this.statusLabels,
    datasets: [
      {
        label: 'Nombre par statut',
        data: [],
        backgroundColor: ['#facc15', '#3b82f6', '#10b981', '#6366f1', '#8b5cf6', '#ef4444', '#14b8a6']
      }
    ]
  };

  besoinsParUserData: { labels: (string | string[])[], datasets: { label: string, data: number[], backgroundColor: string[], borderColor?: string, borderWidth?: number }[] } = {
    labels: [],
    datasets: [
      {
        label: 'Besoins créés',
        data: [],
        backgroundColor: ['rgba(59, 130, 246, 0.7)'],
        borderColor: '#3b82f6',
        borderWidth: 1
      },
      {
        label: 'Besoins gagnés',
        data: [],
        backgroundColor: ['rgba(16, 185, 129, 0.7)'],
        borderColor: '#10b981',
        borderWidth: 1
      }
    ]
  };

  updateBesoinsParMois(besoins: any[]) {
    const data = new Array(12).fill(0);
    besoins.forEach(b => {
      const month = new Date(b.creationDate).getMonth();
      data[month]++;
    });
    this.besoinsParMoisData.datasets[0].data = data;
  }

  updateLastYearBesoinsParMois(besoins: any[]) {
    const data = new Array(12).fill(0);
    besoins.forEach(b => {
      const month = new Date(b.creationDate).getMonth();
      data[month]++;
    });

    this.besoinsParMoisData.datasets.push({
      label: 'Besoins créés par mois l\'année dernière',
      data: data,
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#f59e0b',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: '#f59e0b',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2
    });
  }

  updateBesoinsParStatut(besoins: any[]) {
    const counts: any = { A_TRAITER: 0, ABANDONNÉ: 0, OK_PREQUALIFIE: 0, EN_COURS: 0, GAGNÉ: 0, PERDU: 0, REPORTE: 0 };
    besoins.forEach(b => {
      if (counts[b.status] !== undefined) {
        counts[b.status]++;
      }
    });
    this.besoinsParStatusData.datasets[0].data = this.statusLabels.map(status => counts[status]);
  }

  updateBesoinsParUser(besoins: any[]) {
    const totalCounts: { [key: string]: number } = {};
    const wonCounts: { [key: string]: number } = {};
    const usersSet = new Set<string>();

    besoins.forEach(b => {
      const firstname = b.createdBy?.firstname ?? 'Inconnu';
      const lastname = b.createdBy?.lastname ?? '';
      const role = b.createdBy?.role ?? '';

      const userKey = firstname + ' ' + lastname + '|' + role; 
      usersSet.add(userKey);

      totalCounts[userKey] = (totalCounts[userKey] || 0) + 1;

      if (b.status === 'GAGNÉ') {
        wonCounts[userKey] = (wonCounts[userKey] || 0) + 1;
      }
    });

    const users = Array.from(usersSet);

    this.besoinsParUserData.labels = users.map(u => {
      const [name, role] = u.split('|');
      return [name, '(' + role + ')'];
    });

    this.besoinsParUserData.datasets[0].data = users.map(u => totalCounts[u]);
    this.besoinsParUserData.datasets[1].data = users.map(u => wonCounts[u] || 0);
  }
}