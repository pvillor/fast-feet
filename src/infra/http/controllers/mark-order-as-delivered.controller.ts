import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { MarkOrderAsDeliveredUseCase } from '@/domain/carrier/application/use-cases/mark-order-as-delivered'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { FileInterceptor } from '@nestjs/platform-express'
import { InvalidAttachmentTypeError } from '@/domain/carrier/application/use-cases/errors/invalid-attachment-type'

const markOrderAsDeliveredParamsSchema = z.object({
  orderId: z.string().uuid(),
  courierId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(
  markOrderAsDeliveredParamsSchema,
)

type MarkOrderAsDeliveredParamsSchema = z.infer<
  typeof markOrderAsDeliveredParamsSchema
>

@Controller('/couriers/:courierId/deliver/:orderId')
export class MarkOrderAsDeliveredController {
  constructor(private markOrderAsDelivered: MarkOrderAsDeliveredUseCase) {
    //
  }

  @Patch()
  @HttpCode(204)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @Param(paramsValidationPipe) params: MarkOrderAsDeliveredParamsSchema,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2 mb
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: UserPayload,
  ) {
    const { orderId, courierId } = params

    if (courierId !== user.sub) {
      throw new UnauthorizedException()
    }

    const result = await this.markOrderAsDelivered.execute({
      orderId,
      courierId,
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
