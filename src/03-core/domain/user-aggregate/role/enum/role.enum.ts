// export enum RoleEnum {
//   ADMIN = 'ROLE_ADMIN', // Administrator with full access to the system
//   INSTRUCTOR = 'ROLE_INSTRUCTOR', // Instructors who create and manage classes
//   LEARNER = 'ROLE_LEARNER', // Learners who enroll in classes
//   SUPPORT = 'ROLE_SUPPORT', // Support staff for technical or customer assistance
//   MODERATOR = 'ROLE_MODERATOR', // Moderators who manage content and users
//   GUEST = 'ROLE_GUEST', // Unauthenticated or limited access users
//   DEFAULT = RoleEnum.GUEST,
// }

export const RoleEnum = {
  ADMIN: {
    id: '6438d2e5-e076-449b-830e-97057230925e',
    description: 'ROLE_ADMIN',
  },
  INSTRUCTOR: {
    id: 'fb68ced9-13ab-40ba-a406-17569417cbbc',
    description: 'ROLE_INSTRUCTOR',
  },
  LEARNER: {
    id: '7651f30b-f16b-4a87-8638-326908368d1a',
    description: 'ROLE_LEARNER',
  },
  SUPPORT: {
    id: '509a1394-fdc2-4140-890a-02fddeb995e4',
    description: 'ROLE_SUPPORT',
  },
  MODERATOR: {
    id: 'bfd14739-4550-495d-a3ae-d434fe69bdd2',
    description: 'ROLE_MODERATOR',
  },
  GUEST: {
    id: '8b3f6819-e524-4bbd-ad70-eb3fb146bd87',
    description: 'ROLE_GUEST',
  },
};
