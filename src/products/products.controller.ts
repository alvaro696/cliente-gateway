import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

@Controller('products')
export class ProductsController {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.client.send("createProduct", createProductDto)
      .pipe(
        catchError(error => {
          throw new RpcException(error)
        })
      )
  }

  @Get()
  findAll() {
    return this.client.send("findAllProducts", {})
      .pipe(
        catchError(error => {
          console.log(error)
          throw new Error("an error happened")
        })
      )
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send("findOneProduct", id)
      .pipe(
        catchError(error => {
          throw new RpcException(error)
        })
      )
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.client.send("updateProduct", { id, updateProductDto })
      .pipe(
        catchError(error => {
          throw new RpcException(error)
        })
      )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send("removeProduct", id)
      .pipe(
        catchError(error => {
          throw new RpcException(error)
        })
      )
  }
}
