import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { BesoinsService } from '../services/besoins.service';
import { ProfileService } from '../services/profile.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-director-dashboard',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './director-dashboard.component.html',
  styleUrls: ['./director-dashboard.component.css']
})
export class DirectorDashboardComponent implements OnInit {

  constructor(private besoinService: BesoinsService, private cdRef: ChangeDetectorRef, private userService: ProfileService) {}

  besoins: any[] = [];
  lastYearBesoins: any[] = [];
  moisLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  statusLabels: string[] = ['A_TRAITER', 'ABANDONNÉ', 'OK_PREQUALIFIE', 'EN_COURS', 'GAGNÉ', 'PERDU', 'REPORTE'];


  ngOnInit(): void {
    this.besoinService.findAllBesoins().subscribe((data: any) => {
      this.besoins = data;
      const userRequests = this.besoins.map(b =>
        this.userService.findUserById(b.createdBy).pipe()
      );

      forkJoin(userRequests).subscribe((users: any[]) => {
        // Associer chaque user à son besoin
        this.besoins.forEach((b, index) => {
          b.createdBy = users[index];
        });

        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;

        this.lastYearBesoins = this.besoins.filter(b => new Date(b.creationDate).getFullYear() === lastYear);
        this.besoins = this.besoins.filter(b => new Date(b.creationDate).getFullYear() === currentYear);

        this.updateBesoinsParMois(this.besoins);
        this.updateLastYearBesoinsParMois(this.lastYearBesoins);
        this.updateBesoinsParStatut(this.besoins);
        this.updateBesoinsParUser(this.besoins);

        this.cdRef.markForCheck();
      });
    });
  }


  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true
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
      }
    ]
  };

  besoinsParStatusData: { labels: string[], datasets: { label: string, data: number[], backgroundColor: string[] }[] } = {
    labels: this.statusLabels,
    datasets: [
      {
        label: 'Nombre par statut',
        data: [],
        backgroundColor: ['#facc15', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f97316', '#14b8a6']
      }
    ]
  };

  besoinsParUserData: { labels: (string | string[])[], datasets: { label: string, data: number[], backgroundColor: string[] }[] } = {
    labels: [],
    datasets: [
      {
        label: 'Besoins créés',
        data: [],
        backgroundColor: ['#3b82f6']
      },
      {
        label: 'Besoins gagnés',
        data: [],
        backgroundColor: ['#10b981']
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

      const userKey = firstname + ' ' + lastname + '|' + role; // Séparateur temporaire
      usersSet.add(userKey);

      // Compter tous les besoins
      totalCounts[userKey] = (totalCounts[userKey] || 0) + 1;

      // Compter les besoins "GAGNÉ"
      if (b.status === 'GAGNÉ') {
        wonCounts[userKey] = (wonCounts[userKey] || 0) + 1;
      }
    });

    const users = Array.from(usersSet);

    this.besoinsParUserData.labels = users.map(u => {
      const [name, role] = u.split('|');
      return [name, '(' + role + ')']; // --> pour faire 2 lignes
    });

    this.besoinsParUserData.datasets[0].data = users.map(u => totalCounts[u]);
    this.besoinsParUserData.datasets[1].data = users.map(u => wonCounts[u] || 0);
  }
}