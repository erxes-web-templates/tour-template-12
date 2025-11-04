import { gql } from '@apollo/client';

const login = gql`
  mutation ClientPortalLogin(
    $clientPortalId: String!
    $login: String!
    $password: String!
  ) {
    clientPortalLogin(
      clientPortalId: $clientPortalId
      login: $login
      password: $password
    )
  }
`;

const createUser = gql`
  mutation ClientPortalRegister(
    $clientPortalId: String
    $email: String
    $firstName: String
    $lastName: String
    $password: String
    $phone: String
    $companyName: String
    $companyRegistrationNumber: String
    $type: String
    $username: String
    $avatar: String
  ) {
    clientPortalRegister(
      clientPortalId: $clientPortalId
      email: $email
      firstName: $firstName
      lastName: $lastName
      password: $password
      phone: $phone
      companyName: $companyName
      companyRegistrationNumber: $companyRegistrationNumber
      type: $type
      username: $username
      avatar: $avatar
    )
  }
`;

const logout = gql`
  mutation {
    clientPortalLogout
  }
`;

const getCode = gql`
  mutation sendVerificationCode($phone: String!) {
    sendVerificationCode(phone: $phone)
  }
`;
const resetPassword = gql`
  mutation clientPortalResetPassword($newPassword: String!, $token: String!) {
    clientPortalResetPassword(newPassword: $newPassword, token: $token)
  }
`;

const forgotPassword = gql`
  mutation ClientPortalForgotPassword(
    $clientPortalId: String!
    $email: String
  ) {
    clientPortalForgotPassword(clientPortalId: $clientPortalId, email: $email)
  }
`;

const userEdit = gql`
  mutation clientPortalUsersEdit(
    $_id: String!
    $email: String
    $firstName: String
    $lastName: String
    $phone: String
    $type: String
    $companyName: String
    $companyRegistrationNumber: String
    $password: String
    $avatar: String
  ) {
    clientPortalUsersEdit(
      _id: $_id
      email: $email
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      type: $type
      companyName: $companyName
      companyRegistrationNumber: $companyRegistrationNumber
      password: $password

      avatar: $avatar
    ) {
      _id
    }
  }
`;

const changePhone = gql`
  mutation changePhone($_id: String!, $phone: String) {
    clientPortalUsersEdit(_id: $_id, phone: $phone) {
      _id
    }
  }
`;

const userChangePassword = gql`
  mutation clientPortalUserChangePassword(
    $currentPassword: String!
    $newPassword: String!
  ) {
    clientPortalUserChangePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      _id
    }
  }
`;
const userVerify = gql`
  mutation ClientPortalVerifyOTP($userId: String!, $emailOtp: String) {
    clientPortalVerifyOTP(userId: $userId, emailOtp: $emailOtp)
  }
`;

const posChooseConfig = gql`
  mutation PosChooseConfig($token: String!) {
    posChooseConfig(token: $token)
  }
`;

const fbLogin = gql`
  mutation ClientPortalFacebookAuthentication(
    $clientPortalId: String!
    $accessToken: String!
  ) {
    clientPortalFacebookAuthentication(
      clientPortalId: $clientPortalId
      accessToken: $accessToken
    )
  }
`;

const googleLogin = gql`
  mutation ClientPortalGoogleAuthentication(
    $clientPortalId: String!
    $code: String!
  ) {
    clientPortalGoogleAuthentication(
      clientPortalId: $clientPortalId
      code: $code
    )
  }
`;

const socialPayLogin = gql`
  mutation clientPortalLoginWithSocialPay(
    $clientPortalId: String!
    $token: String!
  ) {
    clientPortalLoginWithSocialPay(
      clientPortalId: $clientPortalId
      token: $token
    )
  }
`;

const mutations = {
  login,
  logout,
  createUser,
  getCode,
  userEdit,
  resetPassword,
  userChangePassword,
  forgotPassword,
  userVerify,
  posChooseConfig,
  fbLogin,
  googleLogin,
  changePhone,
  socialPayLogin,
};

export default mutations;
