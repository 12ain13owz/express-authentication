export const SUCCESS = {
  GENERIC: {
    OK: 'Operation successful',
    CREATED: 'Data created successfully',
    UPDATED: 'Data updated successfully',
    DELETED: 'Data deleted successfully',
  },
  AUTH: {
    REGISTER: 'Registered successfully',
    LOGGED_IN: 'Logged in successfully',
    LOGGED_OUT: 'Logged out successfully',
    PASSWORD_RESET: 'Password reset successfully',
  },
  EMAIL: {
    SENT: 'Email sent successfully',
    VERIFIED: 'Email verified successfully',
  },
  UTIL: {
    create: (name: string) => `Created ${name} successfully`,
    update: (name: string) => `Updated ${name} successfully`,
    delete: (name: string) => `Deleted ${name} successfully`,
    save: (name: string) => `Saved ${name} successfully`,
    upload: (name: string) => `Uploaded ${name} successfully`,
  },
}
