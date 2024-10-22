import { Uploader } from '@/domain/carrier/application/storage/uploader'
import { Module } from '@nestjs/common'
import { R2Storage } from '../storage/r2-storage'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {
  //
}
