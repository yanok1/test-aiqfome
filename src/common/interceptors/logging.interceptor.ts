import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    // Log request
    this.logger.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        type: 'request',
        method: request.method,
        url: request.url,
        userAgent: request.get('User-Agent'),
        ip: request.ip,
        body: request.body,
        query: request.query,
        params: request.params,
      }),
    );

    return next.handle().pipe(
      tap({
        next: data => {
          const duration = Date.now() - startTime;

          // Log response
          this.logger.log(
            JSON.stringify({
              timestamp: new Date().toISOString(),
              level: 'info',
              type: 'response',
              method: request.method,
              url: request.url,
              statusCode: response.statusCode,
              duration: `${duration}ms`,
              responseSize: JSON.stringify(data).length,
            }),
          );
        },
        error: error => {
          const duration = Date.now() - startTime;

          // Log error response
          this.logger.error(
            JSON.stringify({
              timestamp: new Date().toISOString(),
              level: 'error',
              type: 'response_error',
              method: request.method,
              url: request.url,
              statusCode: error.status || 500,
              duration: `${duration}ms`,
              error: error.message,
            }),
          );
        },
      }),
    );
  }
}
