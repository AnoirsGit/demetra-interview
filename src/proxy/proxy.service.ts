// proxy.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProxyService {
  private readonly proxyConfig = {
    host: '45.196.48.9',
    port: 5435,
    auth: { username: 'jtzhwqur', password: 'jnf0t0n2tecg' },
  };

  async makeProxyRequest(url: string): Promise<any> {
    try {
      const response = await axios.get(url, {
        proxy: this.proxyConfig,
      });

      return response.data;
    } catch (error) {
      throw new Error(`Proxy request failed: ${error.message}`);
    }
  }
}
