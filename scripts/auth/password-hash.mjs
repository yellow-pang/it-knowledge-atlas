import { randomBytes, scryptSync } from 'node:crypto';
import { writeFileSync } from 'node:fs';
if (!process.stdin.isTTY) throw new Error('터미널에서 실행하세요.');
process.stdout.write('긴 비밀번호를 입력하세요 (화면에 표시되지 않습니다): ');
process.stdin.setRawMode(true);
let password = '';
input: for await (const chunk of process.stdin) {
  for (const c of chunk.toString()) {
    if (c === '\u0003') { process.stdin.setRawMode(false); process.exit(1); }
    if (c === '\r' || c === '\n') break input;
    if (c === '\u007f') password = password.slice(0, -1); else password += c;
  }
}
process.stdin.setRawMode(false);
process.stdout.write('\n');
if (password.length < 16 || Buffer.byteLength(password) > 1024) throw new Error('비밀번호는 16자 이상, 1024바이트 이하여야 합니다.');
const salt = randomBytes(16);
const hash = `scrypt:${salt.toString('hex')}:${scryptSync(password, salt, 64).toString('hex')}`;
writeFileSync('.env.auth-hash', `AUTH_PASSWORD_HASH=${hash}\n`, { mode: 0o600, flag: 'wx' });
console.log('.env.auth-hash에 해시를 저장했습니다. 환경 파일에 옮기고 안전하게 보관하세요.');
