import { Observable } from 'rxjs';

import { SearchResult } from '../search.interfaces';
import {
  SearchSourceOptions,
  TextSearchOptions,
  ReverseSearchOptions,
  SearchSourceSettings
} from './source.interfaces';

/**
 * Base search source class
 */
export class SearchSource {
  /**
   * Search source ID
   * @internal
   */
  static id = '';

  /**
   * Search source type
   * @internal
   */
  static type = '';

  /**
   * Search source options
   * @internal
   */
  protected options: SearchSourceOptions;

  /**
   * Get search source's id
   * @returns Search source's id
   */
  getId(): string {
    throw new Error('You have to implement the method "getId".');
  }

  /**
   * Get search source's default options
   * @returns Search source default options
   */
  protected getDefaultOptions(): SearchSourceOptions {
    throw new Error('You have to implement the method "getDefaultOptions".');
  }

  /**
   * Search source's title
   */
  get title(): string {
    return this.options.title;
  }

  /**
   * Whether the search source is available
   */
  get available(): boolean {
    return this.options.available !== false;
  }

  /**
   * Whether the search source is enabled
   */
  set enabled(value: boolean) {
    this.options.enabled = value;
  }
  get enabled(): boolean {
    return this.available && this.options.enabled !== false;
  }

  /**
   * Search url
   */
  get searchUrl(): string {
    return this.options.searchUrl;
  }

  /**
   * Search query params
   */
  get params(): { [key: string]: string } {
    return this.options.params === undefined ? {} : this.options.params;
  }

  /**
   * Search settings
   */
  get settings(): SearchSourceSettings[] {
    return this.options.settings === undefined ? [] : this.options.settings;
  }

  /**
   * Set params from selected settings
   */
  setParamFromSetting(setting: SearchSourceSettings) {
      switch (setting.type) {
        case 'radiobutton':
          setting.values.forEach( conf => {
            if (conf.enabled) {
              this.options.params = Object.assign( (this.options.params || {}),
                                                    { [setting.name] : conf.value } );
            }
          });
          break;
        case 'checkbox':
          let confValue = '';
          setting.values.forEach( conf => {
            if (conf.enabled) {
              confValue += conf.value + ',';
            }
          });
          confValue = confValue.slice(0, -1);
          this.options.params = Object.assign( (this.options.params || {}),
                                                { [setting.name] : confValue } );
          break;
      }
  }

  /**
   * Search results display order
   */
  get displayOrder(): number {
    return this.options.order === undefined ? 99 : this.options.order;
  }

  constructor(options: SearchSourceOptions) {
    this.options = Object.assign({}, this.getDefaultOptions(), options);

    // Set Default Params from Settings
    this.settings.forEach( setting => {
      this.setParamFromSetting(setting);
    });
  }

  /**
   * Check if hashtag is valid
   * @param hashtag hashtag from query
   * @param completeMatch boolean
   */
  hashtagValid(searchSourceSetting: SearchSourceSettings, hashtag: string, completeMatch = false): boolean {
    let hashtagIsValid = false;
    searchSourceSetting.values.forEach( conf => {
      const re = new RegExp('' + hashtag.substring(1) + '', 'g');
      if ( typeof conf.value === 'string') {
        if ( (completeMatch && conf.value === hashtag.substring(1)) ||
              ( !completeMatch && conf.value.match(re)) ) {
          hashtagIsValid = true;
        }
      }
    });
    return hashtagIsValid;
  }

  getSettingsValues(search: string): SearchSourceSettings {
    return this.getDefaultOptions().settings.find( (value: SearchSourceSettings) => {
      return value.name === search;
    });
  }

}

/**
 * Search sources that allow searching by text implement this class
 */
export interface TextSearch {
  /**
   * Search by text
   * @param term Text
   * @returns Observable or search results
   */
  search(
    term: string | undefined,
    options?: TextSearchOptions
  ): Observable<SearchResult[]>;
}

/**
 * Search sources that allow searching by coordinates implement this class
 */
export interface ReverseSearch {
  /**
   * Search by text
   * @param lonLat Coordinates
   * @param distance Optional: Search radius arounf lonLat
   * @returns Observable or search results
   */
  reverseSearch(
    lonLat: [number, number],
    options?: ReverseSearchOptions
  ): Observable<SearchResult[]>;
}