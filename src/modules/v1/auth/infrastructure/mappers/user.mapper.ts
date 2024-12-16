import { User } from '../../domain/entities/user.entity'

export class UserMapper {
  static toDomain(user: any) {
    return new User({
      id: user.id,
      username: user.username,
      password: user.password,
      email: user.email,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
      isAdministrator: user.isAdministrator,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }
}
