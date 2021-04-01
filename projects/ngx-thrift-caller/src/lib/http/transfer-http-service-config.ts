import { InjectionToken } from '@angular/core';

export interface TransferHttpServiceConfig {
  publicUrl: string;
  privateUrl: string;
}

export const TRANSFER_CONFIG_TOKEN = new InjectionToken<TransferHttpServiceConfig>('replace state key url to public');
