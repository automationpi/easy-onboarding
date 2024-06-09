import { createApiRef, DiscoveryApi, fetchApiRef } from '@backstage/core-plugin-api';

export const onboardingApiRef = createApiRef<OnboardingApi>({
    id: 'plugin.easy-onboard.api',
});

export interface OnboardingApi {
    getOnboardingData(): Promise<any>;
}

export class OnboardingApiClient implements OnboardingApi {
    constructor(private readonly discoveryApi: DiscoveryApi) { }

    async getOnboardingData(): Promise<any> {
        const url = await this.discoveryApi.getBaseUrl('onboarding');
        const response = await fetch(`${url}/onboarding`);
        return await response.json();
    }
}

export const onboardingApiFactory = {
    deps: {
        discoveryApi: fetchApiRef,
    },
    factory: ({ discoveryApi }: { discoveryApi: DiscoveryApi }) => new OnboardingApiClient(discoveryApi),
};
