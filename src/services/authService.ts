// Mock service for OTP verification
// In production, integrate with services like Twilio, AWS SES, etc.

export interface OTPRequest {
  identifier: string; // phone or email
  type: 'citizen' | 'authority';
}

export interface OTPVerify {
  identifier: string;
  otp: string;
  type: 'citizen' | 'authority';
}

class AuthService {
  private mockOTPStore: Map<string, string> = new Map();
  private mockAuthIDs = ['AUTH001', 'AUTH002', 'AUTH003']; // Mock auth IDs

  // Generate and send OTP
  async sendOTP(request: OTPRequest): Promise<{ success: boolean; message: string }> {
    // Validate based on type
    if (request.type === 'citizen') {
      // Validate phone number format
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(request.identifier)) {
        return { success: false, message: 'Invalid phone number format. Use 10 digits.' };
      }
    } else if (request.type === 'authority') {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(request.identifier)) {
        return { success: false, message: 'Invalid email format' };
      }
      
      // In real app, check if email is associated with an authority account
      // For demo, we'll accept any email
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `${request.type}_${request.identifier}`;
    
    // Store OTP (in production, use database with expiration)
    this.mockOTPStore.set(key, otp);
    
    // Simulate sending OTP (in production, integrate with SMS/email service)
    console.log(`OTP for ${request.identifier}: ${otp}`);
    
    // Set expiration (5 minutes)
    setTimeout(() => {
      this.mockOTPStore.delete(key);
    }, 5 * 60 * 1000);

    return {
      success: true,
      message: request.type === 'citizen' 
        ? 'OTP sent to your phone number' 
        : 'OTP sent to your email'
    };
  }

  // Verify OTP
  async verifyOTP(verify: OTPVerify): Promise<{ success: boolean; message: string; token?: string }> {
    const key = `${verify.type}_${verify.identifier}`;
    const storedOTP = this.mockOTPStore.get(key);

    if (!storedOTP) {
      return { success: false, message: 'OTP expired or not found. Please request a new one.' };
    }

    if (storedOTP !== verify.otp) {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    // Clear OTP after successful verification
    this.mockOTPStore.delete(key);

    // Generate mock JWT token
    const mockToken = `mock-jwt-token-${Date.now()}-${verify.identifier}`;

    return {
      success: true,
      message: 'OTP verified successfully',
      token: mockToken
    };
  }

  // Validate Authority Auth ID (in real app, check against database)
  async validateAuthID(authID: string): Promise<{ valid: boolean; message: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const isValid = this.mockAuthIDs.includes(authID);
    
    return {
      valid: isValid,
      message: isValid ? 'Auth ID is valid' : 'Invalid Auth ID. Please contact admin.'
    };
  }

  // Verify if email exists in authority database (mock)
  async checkAuthorityEmail(email: string): Promise<{ exists: boolean; authorityName?: string }> {
    // Mock data - in real app, query your database
    const mockAuthorityDB = [
      { email: 'police@example.com', name: 'City Police Department', authID: 'AUTH001' },
      { email: 'municipal@example.com', name: 'Municipal Corporation', authID: 'AUTH002' },
      { email: 'traffic@example.com', name: 'Traffic Department', authID: 'AUTH003' }
    ];

    const authority = mockAuthorityDB.find(a => a.email === email);
    
    return {
      exists: !!authority,
      authorityName: authority?.name
    };
  }
}

export const authService = new AuthService();
