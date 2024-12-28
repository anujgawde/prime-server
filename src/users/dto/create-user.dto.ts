export class CreateUserDto {
  _id: string;
  basicInformation: {
    firstName: string;
    lastName?: string;
    email: string;
  };
  contactInformation: {
    address?: string;
    phoneNumber: string;
  };
}
