import { ModuleWithProviders, NgModule, Optional, Provider, SkipSelf } from '@angular/core';
import { TransferHttpService } from './http/transfer-http.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SeqIdInterceptor } from './http/seq-id-interceptor.';

@NgModule({
  providers: [
    TransferHttpService,
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

  static forRoot(ThriftService: Provider): ModuleWithProviders<NgxThriftCallerModule> {
    return {
      ngModule: NgxThriftCallerModule,
      providers: [ThriftService]
    };
  }

}
