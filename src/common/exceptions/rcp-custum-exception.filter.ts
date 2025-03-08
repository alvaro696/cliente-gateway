
import { Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {

    catch(exception: RpcException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();


        const rpcError = exception.getError();

        if( 
            typeof rpcError === "object" &&
            "statusCode" in rpcError &&
            "message" in rpcError
        ){
            const statusCode = rpcError.statusCode;

            return response.status(+statusCode!).json({
                statusCode,
                message: rpcError.message
            })
        }

        return response.status(500).json({
            statusCode: 500,
            error: rpcError
        })


    }
}