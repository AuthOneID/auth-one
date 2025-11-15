// scripts/generate-ed25519.js
import { generateKeyPairSync } from 'node:crypto'
import { importSPKI, exportJWK, importPKCS8, SignJWT, JWTPayload } from 'jose'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'

export const existsAsync = async (path: string): Promise<boolean> => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export const generateKey = async () => {
  if ((await existsAsync('keys/private.pem')) && (await existsAsync('keys/public.pem'))) {
    console.log('Keys already exist, skipping generation')
    return
  }

  // Ensure keys directory exists
  if (!(await existsAsync('keys'))) {
    await mkdir('keys', { recursive: true })
  }

  const { publicKey, privateKey } = generateKeyPairSync('ed25519')

  await writeFile('keys/private.pem', privateKey.export({ type: 'pkcs8', format: 'pem' }))
  await writeFile('keys/public.pem', publicKey.export({ type: 'spki', format: 'pem' }))

  const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' }) as string
  const jwk = await exportJWK(await importSPKI(publicKeyPem, 'EdDSA'))
  jwk.kid = 'kid-' + Date.now()
  await writeFile('keys/public.jwk.json', JSON.stringify(jwk, null, 2))
  console.log('Generated keys in ./keys/, jwk:', jwk.kid)
}

export const signIdToken = async (payload: JWTPayload) => {
  const privPem = await readFile('keys/private.pem', 'utf8')
  const privateKey = await importPKCS8(privPem, 'EdDSA')

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'EdDSA', kid: 'kid-current' })
    .setIssuer('https://idp.example.com')
    .setAudience('my-client-id')
    .setExpirationTime('1h')
    .setIssuedAt()
    .sign(privateKey)

  console.log(jwt)
  return jwt
}
