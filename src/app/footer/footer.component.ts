import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';

enum BrandMode {
  Tsl = 'TSL_BRAND',
  Default = 'DEFAULT_BRAND'
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() {
  }

  brandModeEnum = BrandMode;

  brandMode = this.getBrandMode();

  ngOnInit() {
  }


  private hasKeyAndNonEmptyValue(objectToCheck, keyName) {
    let hasKeyAndValue = true;
    if (!(keyName in objectToCheck)) {
      hasKeyAndValue = false;
    } else if (objectToCheck[keyName] === '') {
      hasKeyAndValue = false;
    } else if (objectToCheck[keyName] === undefined || objectToCheck[keyName] === 'undefined') {
      hasKeyAndValue = false;
    }
    return hasKeyAndValue;
  }

  /**
   * @returns {boolean} True if the host name in the browser is the URL for TLS-branding.
   */
  private isTslHostname(): boolean {
    let tlsSubDomainName = 'jobbometern-tsl';
    if (this.hasKeyAndNonEmptyValue(environment, 'tlsSubDomainName')) {
        tlsSubDomainName = environment['tlsSubDomainName'];
    }

    const hostname = window.location.hostname;
    return hostname.indexOf(tlsSubDomainName) >= 0;
  }

  /**
   * @returns {BrandMode} either from the browser host name or if brand mode is forced by env variable.
   * To force branding to TSL, use for 'Tsl' as value in the environment variable.
   */
  private getBrandMode(): BrandMode {
    let brandMode = BrandMode.Default;

    const isTslInDomainName = this.isTslHostname();

    if (isTslInDomainName) {
      brandMode = BrandMode.Tsl;
    }

    if (this.hasKeyAndNonEmptyValue(environment, 'forceBrandingMode')) {
      const envBrandingValue = environment['forceBrandingMode'];
      const envBrandingMode = BrandMode[envBrandingValue];
      if (envBrandingMode !== undefined) {
        brandMode = envBrandingMode;
      }
    }

    return brandMode;

  }
}
