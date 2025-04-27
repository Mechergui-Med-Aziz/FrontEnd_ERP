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

  constructor(private besoinService: BesoinsService, private cdRef: ChangeDetectorRef,private userService:ProfileService) {}

  besoins: any[] = [];
  lastYearBesoins: any[] = []; 
  moisLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  statusLabels: string[] = ['A_TRAITER', 'ABANDONNÉ', 'OK_PREQUALIFIE', 'EN_COURS', 'GAGNÉ', 'PERDU', 'REPORTE'];

  besoinsParMoisData = {
    labels: this.moisLabels,
    datasets: [
      {
        label: 'Besoins créés par mois cette année',
        data: [] as Number[], // Initialement vide
        borderColor: '#3b82f6', // Couleur de la ligne
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // Couleur de fond de la ligne (transparente)
        fill: true, // Remplir la zone sous la ligne
        tension: 0.4, // Lissage de la courbe
        pointRadius: 5, // Taille des points
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

  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true, // L'axe Y commence à zéro
      }
    }
  };


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
        this.updateBesoinsParUser(this.besoins); // Maintenant c'est safe de l'appeler !
  
        this.cdRef.markForCheck();
      });
    });
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
      borderColor: '#f59e0b', // Couleur différente pour l'année précédente
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
    });
  }

  updateBesoinsParUser(besoins: any[]) {
    const counts: { [key: string]: number } = {};
  
    besoins.forEach(b => {
      const userName = b.createdBy?.firstname+' '+b.createdBy?.lastname || 'Inconnu'; // Adapte selon comment tu stockes l'utilisateur
      if (counts[userName]) {
        counts[userName]++;
      } else {
        counts[userName] = 1;
      }
    });
  
    this.besoinsParUserData.labels = Object.keys(counts);
    this.besoinsParUserData.datasets[0].data = Object.values(counts);
  }

  besoinsParUserData: { labels: string[], datasets: { label: string, data: number[], backgroundColor: string[] }[] } = {
    labels: [],
    datasets: [
      {
        label: 'Besoins par utilisateur cette année',
        data: [],
        backgroundColor: ['#3b82f6', '#10b981', '#f97316', '#facc15', '#8b5cf6', '#ef4444', '#14b8a6', '#ec4899', '#0ea5e9']
      }
    ]
  };
  
  
  

  updateBesoinsParMois(besoins: any[]) {
    const data = new Array(12).fill(0);
    this.besoins = this.besoins.filter(b => new Date(b.creationDate).getFullYear() === new Date().getFullYear()); // Filtrer les besoins de cette année uniquement
    besoins.forEach(b => {
      const month = new Date(b.creationDate).getMonth();
      data[month]++;
    });
    this.besoinsParMoisData.datasets[0].data = data;
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
}
