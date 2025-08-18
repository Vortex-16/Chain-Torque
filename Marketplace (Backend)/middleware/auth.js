const { clerkClient, verifyToken } = require('@clerk/clerk-sdk-node');

/**
 * Clerk Authentication Middleware
 * Validates JWT tokens from Clerk and extracts user information
 */
const requireAuth = async (req, res, next) => {
  try {
    // TEMPORARY: Skip authentication for development/testing
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  DEVELOPMENT MODE: Skipping authentication');
      req.user = {
        id: 'dev-user-123',
        email: 'developer@chainforge.com',
        firstName: 'Development',
        lastName: 'User',
        walletAddress: '0x742d35cc6565C42cAc78A3Ee83BDf47EF2065E4b',
        fullName: 'Development User',
        createdAt: new Date(),
        lastSignInAt: new Date()
      };
      return next();
    }

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Missing or invalid authorization header' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the JWT token with Clerk using the correct method
    let decoded;
    try {
      // Try the newer verifyToken method first
      if (verifyToken) {
        decoded = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY
        });
      } else {
        // Fallback to older method if available
        decoded = await clerkClient.verifyToken(token);
      }
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return res.status(401).json({ 
        error: 'Invalid authentication token',
        message: 'Token verification failed'
      });
    }
    
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ 
        error: 'Invalid authentication token' 
      });
    }

    // Get user details from Clerk
    const user = await clerkClient.users.getUser(decoded.sub);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found' 
      });
    }

    // Extract wallet address from user metadata if available
    const walletAddress = user.publicMetadata?.walletAddress || 
                         user.privateMetadata?.walletAddress || 
                         null;

    // Attach user information to request object
    req.user = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      walletAddress: walletAddress,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      createdAt: new Date(user.createdAt),
      lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : null
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Don't expose internal error details in production
    const isProduction = process.env.NODE_ENV === 'production';
    const errorMessage = isProduction ? 
      'Authentication failed' : 
      `Authentication error: ${error.message}`;
    
    return res.status(401).json({ 
      error: errorMessage 
    });
  }
};

/**
 * Optional Authentication Middleware
 * Extracts user information if token is present, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = await clerkClient.verifyJwt(token);
    
    if (decoded) {
      const user = await clerkClient.users.getUser(decoded.sub);
      
      if (user) {
        const walletAddress = user.publicMetadata?.walletAddress || 
                             user.privateMetadata?.walletAddress || 
                             null;

        req.user = {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          walletAddress: walletAddress,
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          createdAt: new Date(user.createdAt),
          lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : null
        };
      } else {
        req.user = null;
      }
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    req.user = null;
    next();
  }
};

/**
 * Admin Authentication Middleware
 * Requires authentication and checks if user has admin role
 */
const requireAdmin = async (req, res, next) => {
  try {
    // First run regular auth
    await new Promise((resolve, reject) => {
      requireAuth(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Check if user has admin role in metadata
    const user = await clerkClient.users.getUser(req.user.id);
    const isAdmin = user.publicMetadata?.role === 'admin' || 
                   user.privateMetadata?.role === 'admin';

    if (!isAdmin) {
      return res.status(403).json({ 
        error: 'Admin access required' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(403).json({ 
      error: 'Admin authentication failed' 
    });
  }
};

/**
 * Wallet Validation Middleware
 * Ensures user has a connected wallet address
 */
const requireWallet = (req, res, next) => {
  // Development bypass - allow wallet-less operations in development
  if (process.env.NODE_ENV === 'development' || process.env.BYPASS_WALLET_AUTH === 'true') {
    console.log('⚠️  Development mode: Bypassing wallet requirement');
    
    // If user doesn't exist (due to auth bypass), create a mock user
    if (!req.user) {
      req.user = {
        id: 'dev-user-123',
        email: 'dev@example.com',
        firstName: 'Developer',
        lastName: 'User',
        walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Mock wallet
        fullName: 'Developer User',
        createdAt: new Date(),
        lastSignInAt: new Date()
      };
    }
    
    // Ensure user has a mock wallet address
    if (!req.user.walletAddress) {
      req.user.walletAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    }
    
    return next();
  }

  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required' 
    });
  }

  if (!req.user.walletAddress) {
    return res.status(400).json({ 
      error: 'Wallet connection required',
      message: 'Please connect your wallet to perform this action' 
    });
  }

  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin,
  requireWallet
};
