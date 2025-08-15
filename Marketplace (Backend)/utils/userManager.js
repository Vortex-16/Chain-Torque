const { clerkClient } = require('@clerk/clerk-sdk-node');

/**
 * User Management Utilities for Clerk Integration
 */
class UserManager {
  
  /**
   * Update user's wallet address in Clerk metadata
   * @param {string} userId - Clerk user ID
   * @param {string} walletAddress - Ethereum wallet address
   */
  static async updateUserWallet(userId, walletAddress) {
    try {
      if (!userId || !walletAddress) {
        throw new Error('User ID and wallet address are required');
      }

      // Validate wallet address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        throw new Error('Invalid wallet address format');
      }

      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          walletAddress: walletAddress,
          walletConnectedAt: new Date().toISOString()
        }
      });

      return { success: true, message: 'Wallet address updated successfully' };
    } catch (error) {
      console.error('Error updating user wallet:', error);
      throw error;
    }
  }

  /**
   * Set user role (admin, user, etc.)
   * @param {string} userId - Clerk user ID
   * @param {string} role - User role
   */
  static async setUserRole(userId, role) {
    try {
      if (!userId || !role) {
        throw new Error('User ID and role are required');
      }

      const validRoles = ['admin', 'user', 'moderator'];
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role. Must be one of: ' + validRoles.join(', '));
      }

      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          role: role,
          roleUpdatedAt: new Date().toISOString()
        }
      });

      return { success: true, message: 'User role updated successfully' };
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Get user profile with metadata
   * @param {string} userId - Clerk user ID
   */
  static async getUserProfile(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const user = await clerkClient.users.getUser(userId);
      
      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        walletAddress: user.publicMetadata?.walletAddress,
        role: user.publicMetadata?.role || 'user',
        createdAt: new Date(user.createdAt),
        lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : null,
        walletConnectedAt: user.publicMetadata?.walletConnectedAt
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Check if user exists in Clerk
   * @param {string} userId - Clerk user ID
   */
  static async userExists(userId) {
    try {
      await clerkClient.users.getUser(userId);
      return true;
    } catch (error) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  }
}

module.exports = UserManager;
