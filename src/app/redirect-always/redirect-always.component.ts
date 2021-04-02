import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-redirect-always',
  templateUrl: './redirect-always.component.html',
  styleUrls: ['./redirect-always.component.css']
})
export class RedirectAlwaysComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      let storyId = params['storyId'];
      let category = params['category'];
      let author = params['author'];
      let storyName = params['storyName'];
      let episode = params['episode'];
      if (episode == undefined) {
        episode = 1;
      }
      // this.router.navigate(['/' + category + '/கதை/' + author + '/' + storyId + '/' + storyName + '/' + episode]);
      this.router.navigate(['/story/' + storyId + '/episode/' + episode]);
    });

  }
}
