const { clerkClient } = require('@clerk/clerk-sdk-node');

/**
 * Clerk Authentication Middleware
 * Validates JWT tokens from Clerk and extracts user information
 */
const requireAuth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Missing or invalid authorization header' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the JWT token with Clerk
    const decoded = await clerkClient.verifyJwt(token);
    
    if (!decoded) {
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
