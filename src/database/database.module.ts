import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: configService.getOrThrow('DB_HOST'),
        username: configService.getOrThrow('DB_USER'),
        database: configService.getOrThrow('DB_DATABASE'),
        password: configService.getOrThrow('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
