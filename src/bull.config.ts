import { BullModule } from '@nestjs/bull';

export const BullModuleConfig = BullModule.forRoot({
  redis: {
    host: 'localhost',
    port: 6379,
  },
});
