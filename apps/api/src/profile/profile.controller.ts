import {
  Controller,
  Request,
  Get,
  Patch,
  Req,
  Body,
  Param,
  UnauthorizedException,
  Logger, // Import Logger
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto'; // Assuming this DTO exists

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name); // Initialize logger

  constructor(private readonly profileService: ProfileService) {}

  @Get('idea-owner')
  async getIdeaOwnerProfile(@Req() req) {
    this.logger.log('--- [Backend: ProfileController] getIdeaOwnerProfile (idea-owner) called ---');
    try {
      const userId = req.user?.id; // Assuming 'sub' is the user ID from JWT payload
      this.logger.debug(`[Backend: ProfileController] Request user object: ${JSON.stringify(req.user)}`);

      if (!userId) {
        this.logger.error('--- [Backend: ProfileController] ❌ User ID not found in token for idea-owner profile. Throwing UnauthorizedException. ---');
        throw new UnauthorizedException('User not found in token');
      }
      this.logger.log(`[Backend: ProfileController] Fetching idea-owner profile for userId: ${userId}`);
      const profile = await this.profileService.getIdeaOwnerProfile(userId);
      this.logger.log('--- [Backend: ProfileController] ✅ Successfully fetched idea-owner profile. ---');
      return profile;
    } catch (error) {
      this.logger.error(`--- [Backend: ProfileController] 🔥 Error fetching idea-owner profile: ${error instanceof Error ? error.message : String(error)}`);
      this.logger.error(error); // Log the full error object
      throw error; // Re-throw to be caught by NestJS exception filter
    }
  }

  @Get('committee-member')
  async getCommitteeMemberProfile(@Req() req) {
    this.logger.log('--- [Backend: ProfileController] getCommitteeMemberProfile called ---');
    try {
      const userId = req.user?.id;
      this.logger.debug(`[Backend: ProfileController] Request user object: ${JSON.stringify(req.user)}`);

      if (!userId) {
        this.logger.error('--- [Backend: ProfileController] ❌ User ID not found in token for committee-member profile. Throwing UnauthorizedException. ---');
        throw new UnauthorizedException('User not found in token');
      }
      this.logger.log(`[Backend: ProfileController] Fetching committee-member profile for userId: ${userId}`);
      const profile = await this.profileService.getCommitteeMemberProfile(userId);
      this.logger.log('--- [Backend: ProfileController] ✅ Successfully fetched committee-member profile. ---');
      return profile;
    } catch (error) {
      this.logger.error(`--- [Backend: ProfileController] 🔥 Error fetching committee-member profile: ${error instanceof Error ? error.message : String(error)}`);
      this.logger.error(error);
      throw error;
    }
  }

  @Patch()
  async updateProfile(
    @Req() req,
    @Body() dto: UpdateProfileDto,
  ) {
    this.logger.log('--- [Backend: ProfileController] updateProfile called ---');
    try {
      const userId = req.user?.id;
      this.logger.debug(`[Backend: ProfileController] Request user object: ${JSON.stringify(req.user)}`);

      if (!userId) {
        this.logger.error('--- [Backend: ProfileController] ❌ User ID not found in token for profile update. Throwing UnauthorizedException. ---');
        throw new UnauthorizedException('User not found in token');
      }
      this.logger.log(`[Backend: ProfileController] Updating profile for userId: ${userId} with data: ${JSON.stringify(dto)}`);
      const updatedProfile = await this.profileService.updateProfile(userId, dto);
      this.logger.log('--- [Backend: ProfileController] ✅ Profile updated successfully. ---');
      return updatedProfile;
    } catch (error) {
      this.logger.error(`--- [Backend: ProfileController] 🔥 Error updating profile: ${error instanceof Error ? error.message : String(error)}`);
      this.logger.error(error);
      throw error;
    }
  }

  @Get('my-committee')
  async myCommittee(@Req() req) {
    this.logger.log('--- [Backend: ProfileController] myCommittee called ---');
    try {
      const userId = req.user?.id;
      this.logger.debug(`[Backend: ProfileController] Request user object: ${JSON.stringify(req.user)}`);

      if (!userId) {
        this.logger.error('--- [Backend: ProfileController] ❌ User ID not found in token for my-committee dashboard. Throwing UnauthorizedException. ---');
        throw new UnauthorizedException('User not found in token');
      }
      this.logger.log(`[Backend: ProfileController] Fetching my-committee dashboard for userId: ${userId}`);
      const committeeDashboard = await this.profileService.myCommitteeDashboard(userId);
      this.logger.log('--- [Backend: ProfileController] ✅ Successfully fetched my-committee dashboard. ---');
      return committeeDashboard;
    } catch (error) {
      this.logger.error(`--- [Backend: ProfileController] 🔥 Error fetching my-committee dashboard: ${error instanceof Error ? error.message : String(error)}`);
      this.logger.error(error);
      throw error;
    }
  }
}
