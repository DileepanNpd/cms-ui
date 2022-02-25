import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  data_ad_client: string = '';
  data_ad_slot1: string = '';
  data_ad_slot2: string = '';
  constructor() {
    this.data_ad_client = environment.data_ad_client;
    this.data_ad_slot1 = environment.data_ad_slot1;
    this.data_ad_slot2 = environment.data_ad_slot2;
  }
  ngOnInit(): void { }
  ngAfterViewInit() {
    setTimeout(() => {
      try {
        (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
      } catch (e) { }
    }, 2000);
  }
}
