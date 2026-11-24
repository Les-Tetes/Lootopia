import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  it('returns an ok status', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    const controller = moduleRef.get(HealthController);
    const health = controller.getHealth();

    expect(health.status).toBe('ok');
    expect(health.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });
});
