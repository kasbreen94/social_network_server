import { Body, Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    console.log(req.user)
    return this.authService.login(req.user)

  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async authMe(@Req() req) {
    return req.user
  }

  //
  // @Post('/login')
  // async logIn(@Res({ passthrough: true }) res: Response,
  //             @Body() body: LogInDto) {
  //
  //   const authId: string = await this.authService.logIn(body.email, body.password);
  //   if (authId && body) {
  //     res.cookie('authId', authId, { httpOnly: true });
  //     return { authId: authId }
  //   }
  // }
  //
  // @Get('/me')
  // async setAuth(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  //   const authId: string = req.cookies.authId
  //   if (authId) {
  //     return { authId: authId }
  //   } else {
  //     return res.status(HttpStatus.BAD_REQUEST)
  //   }
  // }

  @Delete('/login')
  async logOut(@Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('authId')
    return {message: 'logOut'}
  }
}