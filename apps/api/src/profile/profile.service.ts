import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Logger, // Import Logger
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming PrismaService path
import { UpdateProfileDto } from './dto/update-profile.dto'; // Assuming this DTO exists
import { Role } from '@prisma/client'; // Assuming Role enum from Prisma client

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name); // Initialize logger

  constructor(private prisma: PrismaService) {}

  async getIdeaOwnerProfile(userId: number) {
    this.logger.log(`--- [Backend: ProfileService] getIdeaOwnerProfile for userId: ${userId} ---`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          ideas: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!user) {
        this.logger.warn(`--- [Backend: ProfileService] ⚠️ User with ID ${userId} not found. Throwing NotFoundException. ---`);
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      if (user.role !== Role.IDEA_OWNER) {
        this.logger.warn(`--- [Backend: ProfileService] ⚠️ User ${userId} is not an IDEA_OWNER. Current Role: ${user.role}. Throwing ForbiddenException. ---`);
        throw new ForbiddenException(
          'هذه البيانات متاحة لأصحاب الأفكار فقط',
        );
      }

      const idea = user.ideas[0];
      this.logger.log(`--- [Backend: ProfileService] ✅ Fetched idea-owner profile for userId: ${userId}. Idea found: ${!!idea} ---`);

      return {
        user_id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_image: user.profileImage,
        bio: user.bio,
        idea: idea
          ? {
              idea_id: idea.id,
              title: idea.title,
              status: idea.status,
              roadmap_stage: idea.roadmapStage,
            }
          : null,
      };
    } catch (error) {
      this.logger.error(`--- [Backend: ProfileService] 🔥 Error in getIdeaOwnerProfile: ${error instanceof Error ? error.message : String(error)}`);
      this.logger.error(error); // Log the full error object
      throw error;
    }
  }

  async getCommitteeMemberProfile(userId: number) {
    this.logger.log(`--- [Backend: ProfileService] getCommitteeMemberProfile for userId: ${userId} ---`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          committeeMembers: true,
        },
      });

      if (!user) {
        this.logger.warn(`--- [Backend: ProfileService] ⚠️ User with ID ${userId} not found. Throwing NotFoundException. ---`);
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      if (user.role !== Role.COMMITTEE_MEMBER) {
        this.logger.warn(`--- [Backend: ProfileService] ⚠️ User ${userId} is not a COMMITTEE_MEMBER. Current Role: ${user.role}. Throwing ForbiddenException. ---`);
        throw new ForbiddenException(
          'هذه البيانات متاحة لأعضاء اللجنة فقط',
        );
      }

      this.logger.log(`--- [Backend: ProfileService] ✅ Fetched committee-member profile for userId: ${userId}. ---`);
      return {
        user_id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_image: user.profileImage,
        bio: user.bio,
        committee_role: user.committeeMembers[0]?.roleInCommittee ?? null,
      };
    } catch (error) {
      this.logger.error(`--- [Backend: ProfileService] 🔥 Error in getCommitteeMemberProfile: ${error instanceof Error ? error.message : String(error)}`);
      this.logger.error(error);
      throw error;
    }
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    this.logger.log(`--- [Backend: ProfileService] updateProfile for userId: ${userId} with data: ${JSON.stringify(dto)} ---`);
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          phone: dto.phone,
          bio: dto.bio,
          profileImage: dto.profileImage,
        },
      });
      this.logger.log(`--- [Backend: ProfileService] ✅ Profile for userId: ${userId} updated in DB. ---`);

      return {
        message: 'تم تحديث البروفايل بنجاح',
        profile: {
          user_id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profile_image: user.profileImage,
          bio: user.bio,
        },
      };
    } catch (error) {
      this.logger.error(`--- [Backend: ProfileService] 🔥 Error in updateProfile: ${error instanceof Error ? error.message : String(error)}`);
      this.logger.error(error);
      throw error;
    }
  }

  async myCommitteeDashboard(userId: number) {
    this.logger.log(`--- [Backend: ProfileService] myCommitteeDashboard for userId: ${userId} ---`);
    try {
      const member = await this.prisma.committeeMember.findFirst({
        where: { userId },
        include: {
          committee: {
            include: {
              members: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      if (!member) {
        this.logger.warn(`--- [Backend: ProfileService] ⚠️ User ${userId} is not a member of any committee. Throwing ForbiddenException. ---`);
        throw new ForbiddenException('أنت لست عضوًا في أي لجنة');
      }

      const committee = member.committee;

      if (!committee) {
        this.logger.error(`--- [Backend: ProfileService] ❌ Committee not found for member ${userId}. This should not happen if member exists. Throwing NotFoundException. ---`);
        throw new NotFoundException('اللجنة غير موجودة');
      }

      this.logger.log(`--- [Backend: ProfileService] ✅ Fetched committee dashboard for userId: ${userId}. Committee: ${committee.name} ---`);
      return {
        committee_name: committee.name,
        description: committee.description,
        my_role: member.roleInCommittee,
        members: committee.members.map((m) => ({
          id: m.user.id,
          name: m.user.name,
          is_me: m.user.id === userId,
        })),
      };
    } catch (error) {
      this.logger.error(`--- [Backend: ProfileService] 🔥 Error in myCommitteeDashboard: ${error instanceof Error ? error.message : String(error)}`);
      this.logger.error(error);
      throw error;
    }
  }
}
