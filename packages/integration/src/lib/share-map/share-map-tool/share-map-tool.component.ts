import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ToolComponent } from '@igo2/common';

import { ShareMapToolOptions } from './share-map-tool.interface';

@ToolComponent({
  name: 'shareMap',
  title: 'igo.integration.tools.shareMap',
  icon: 'share'
})
@Component({
  selector: 'igo-share-map-tool',
  templateUrl: './share-map-tool.component.html'
})
export class ShareMapToolComponent {
  public options: ShareMapToolOptions = {};

  get hasCopyLinkButton(): boolean {
    return this.options.hasCopyLinkButton === undefined
      ? false
      : this.options.hasCopyLinkButton;
  }

  get hasShareMapButton(): boolean {
    return this.options.hasShareMapButton === undefined
      ? true
      : this.options.hasShareMapButton;
  }

  constructor() {}
}
