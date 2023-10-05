/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  UseGuards,
  Req,
  Request,
  Res,
  Post,
  Body,
  Header,
  Response,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('to-google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLoginCallback(@Req() req, @Res() res) {
    const { user } = req;
    return res.send(user);
  }

  @Post('google/cors')
  @Header('Cross-Origin-Opener-Policy', '*')
  async getFrontendData(
    @Body()
    body: {
      res: { credential: string; clientId: string };
    },
    @Response() response,
    @Request() req,
  ) {
    const isLogin = await this.userService.googleLoginAPI(body.res.credential);

    response.cookie('Authentication', `Bearer ${isLogin}`);

    return { message: '토큰을 성공적으로 받았습니다.', data: req.cookies };
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin(@Req() req, @Res() res: Response) {
    return res;
  }

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverLoginCallback(@Res() res: Response, @Request() req: Request) {
    return;
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(@Request() req) {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req, @Res() res) {
    const token = req.user;
  }

  @Post('logout')
  async logout(@Req() req, @Res() res) {
    req.logout();
    res.redirect('http://localhost:3000');
  }
}