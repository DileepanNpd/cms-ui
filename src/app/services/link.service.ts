import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class LinkService {
  constructor(@Inject(DOCUMENT) private dom) { }

  createCanonicalURL(url?: string) {
    let canURL = url == undefined ? this.dom.URL : url;
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', canURL);
  }
}