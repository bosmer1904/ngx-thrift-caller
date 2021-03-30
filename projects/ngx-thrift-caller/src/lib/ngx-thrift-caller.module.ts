import { ModuleWithProviders, NgModule, Optional, Provider, SkipSelf } from '@angular/core';
import { TransferHttpService } from './http/transfer-http.service';
import { HTTP_INTERCEPTORS, HttpBackend } from '@angular/common/http';
import { SeqIdInterceptor } from './http/seq-id-interceptor.';
import { BufferHttpXhrBackend } from './http/backend';
import { TRANSFER_CONFIG_TOKEN, TransferHttpServiceConfig } from './http/transfer-http-service-config';

@NgModule({
  providers: [
    BufferHttpXhrBackend,
    {
      provide: HttpBackend,
      useExisting: BufferHttpXhrBackend
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SeqIdInterceptor,
      multi: true
    }
  ]
})

export class NgxThriftCallerModule {
  constructor(@Optional() @SkipSelf() parentModule?: NgxThriftCallerModule) {
    if (parentModule) {
      throw new Error(
        'NgThriftCallerModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(ThriftService: Provider, config?: TransferHttpServiceConfig): ModuleWithProviders<NgxThriftCallerModule> {
    return {
      ngModule: NgxThriftCallerModule,
      providers: [
        ThriftService,
        { provide: TRANSFER_CONFIG_TOKEN, useValue: config},
        TransferHttpService
      ]
    };
  }

}
