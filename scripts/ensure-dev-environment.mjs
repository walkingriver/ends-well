import { copyFileSync, existsSync } from 'node:fs';

const target = 'src/environments/environment.development.ts';
const source = 'src/environments/environment.development.example.ts';

if (!existsSync(target)) {
  copyFileSync(source, target);
  console.log(`Created ${target} from example (mock data defaults).`);
}
