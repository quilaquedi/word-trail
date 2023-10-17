import type { PlaywrightTestConfig} from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	projects: [
	  /* Test against desktop firefox browser only */
	  {
		name: 'firefox',
		use: { ...devices['Desktop Firefox'] },
	  },
	]
};

export default config;
