import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { appConfig } from './app.config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  private availableConfigs = { appConfig: appConfig(this.configService) };

  get(configName) {
    return this.availableConfigs[configName];
  }
}
