// src/services/cleanup-task.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanupTaskService {
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  handleCleanup() {
    // Add logic for cleanup tasks here
    console.log('Running cleanup task at 3 AM');
  }
}
