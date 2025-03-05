export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};

export interface UserPayload {
  _id: string;
  username: string;
  name: string;
  age: number;
  createdAt: Date;
  deleted: boolean;
}

export interface JwtPayload {
  username: string;
  sub: string;
  name: string;
  age: number;
}
