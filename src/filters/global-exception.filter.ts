// src/filters/global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // Decorator indicating that this filter will catch all types of exceptions
export class GlobalExceptionFilter implements ExceptionFilter {
  // Method required by the ExceptionFilter interface to handle exceptions
  catch(exception: any, host: ArgumentsHost) {
    // Extracting the request and response objects from the host
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determining the HTTP status code based on the type of exception
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extracting the error message from the exception (if it's an HttpException)
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    // Sending a JSON response with the appropriate status code, timestamp, request path, and error message
    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
