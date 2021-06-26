import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MetaTag } from '../model/meta-tag'

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private urlMeta: string = "og:url";
  private titleMeta: string = "og:title";
  private descriptionMeta: string = "og:description";
  private imageMeta: string = "og:image";
  private secureImageMeta: string = "og:image:secure_url";

  constructor(private metaService: Meta) { }

  public setFacebookTags(url: string, title: string, description: string, image: string): void {
    var tags = [
      new MetaTag(this.urlMeta, url),
      new MetaTag(this.titleMeta, title),
      new MetaTag(this.descriptionMeta, description),
      new MetaTag(this.imageMeta, image),
      new MetaTag(this.secureImageMeta, image)
    ];
    this.setTags(tags);
    
  }

  private setTags(tags: MetaTag[]): void {
    tags.forEach(siteTag => {
      this.metaService.updateTag({ property: siteTag.name, content: siteTag.value });
    });
  }
}