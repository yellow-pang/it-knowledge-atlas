// 새 형식은 환경 변수 확장을 피한다. 기존 형식도 이미 설정한 계정을 위해 유지한다.
export function parsePasswordHash(encoded: string) {
  const match = /^scrypt(?::([a-f0-9]{32}):([a-f0-9]{128})|\$([a-f0-9]{32})\$([a-f0-9]{128}))$/.exec(encoded);
  if (!match) return null;
  return { salt: Buffer.from(match[1] || match[3], "hex"), hash: Buffer.from(match[2] || match[4], "hex") };
}
