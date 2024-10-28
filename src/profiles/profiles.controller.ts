import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService
  ) {}

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Param('userId') userId: string, @Req() req) {
    const authId = req.user.id
    return await this.profilesService.getProfile(authId,+userId)
  }

  @Patch('update/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    const updateProfile = await this.profilesService.updateProfile(req.user.id, updateProfileDto)
    return updateProfile.status
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.updateProfile(req.user.id, updateProfileDto)

  }

//   @Post()
//   create(@Body() createProfileDto: CreateProfileDto) {
//     return this.profilesService.create(createProfileDto);
//   }
//
//   @Get()
//   findAll() {
//     return this.profilesService.findAll();
//   }
//
//
//
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
//     return this.profilesService.update(+id, updateProfileDto);
//   }
//
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.profilesService.remove(+id);
//   }
}
