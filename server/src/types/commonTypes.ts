import User from '@/models/User';

export type UserToken = {
  user: User;
  token: string;
};

export type DishCategory = {
  name: string;
  fullName: string;
};

export type DifficultLevel = {
  difficultLevelId: string;
  levelName: string;
};
