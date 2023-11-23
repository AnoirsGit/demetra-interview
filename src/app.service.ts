import { Injectable } from '@nestjs/common';

type GetCachedParams = {
  key: string;
  liveTime: number;
  storeAgain: boolean;
};

type StoreCachedParams = {
  key: string;
  value: any;
  liveTime: number;
};

@Injectable()
export class AppService {
  getCached({ key, liveTime, storeAgain }: GetCachedParams) {
    console.log(key, liveTime, storeAgain);
    return 'sdf';
  }

  storeCached({ key, value, liveTime }: StoreCachedParams) {
    console.log(key, value, liveTime);
    return 'sdf';
  }
}
