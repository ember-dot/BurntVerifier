import type { IVerificationProvider } from '../interfaces/IProvider';
import type { BurntAttributeCertificate, VerificationRequestOptions } from '../types';

export class MockAdapter implements IVerificationProvider {
    public readonly name = 'mock';

    async initializeSession(options: VerificationRequestOptions): Promise<{ url: string; sessionId: string }> {
        console.log('MockAdapter: initializing session', options);
        return {
            url: 'http://localhost:8080/mock-verification-page', // Dummy URL
            sessionId: `mock_session_${Date.now()}`,
        };
    }

    async waitForVerification(sessionId: string): Promise<BurntAttributeCertificate> {
        console.log(`MockAdapter: waiting for verification session ${sessionId}`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Return a mock certificate
        return {
            verificationTypeId: 'mock-provider',
            sessionId: sessionId,
            claims: {
                companyName: 'Mock Company Inc.',
                email: 'test@mockcompany.com',
                employmentStatus: 'Active'
            },
            timestampS: Math.floor(Date.now() / 1000),
            createdAt: Date.now(),
            context: { mock: true }
        };
    }
}
