import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  data_ad_client: string = environment.data_ad_client;
  data_ad_slot1: string = environment.data_ad_slot1;
  data_ad_slot2: string = environment.data_ad_slot2;
  constructor() { }
  ngOnInit(): void { }
  ngAfterViewInit() {
    setTimeout(() => {
      try {
        (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
      } catch (e) { }
    }, 500);
  }
}
