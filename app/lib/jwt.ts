// scripts/generate-ed25519.js
import { generateKeyPairSync } from 'node:crypto'
import { importSPKI, exportJWK, importPKCS8, SignJWT, JWTPayload } from 'jose'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import app from '@adonisjs/core/services/app'

export const existsAsync = async (path: string): Promise<boolean> => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export const generateKey = async () => {
  if (
    (await existsAsync(app.makePath('storage/keys/private.pem'))) &&
    (await existsAsync(app.makePath('storage/keys/public.pem')))
  ) {
    return
  }

  // Ensure keys directory exists
  if (!(await existsAsync(app.makePath('storage/keys')))) {
    await mkdir(app.makePath('storage/keys'), { recursive: true })
  }

  const { publicKey, privateKey } = generateKeyPairSync('ed25519')

  await writeFile(
    app.makePath('storage/keys/private.pem'),
    privateKey.export({ type: 'pkcs8', format: 'pem' })
  )
  await writeFile(
    app.makePath('storage/keys/public.pem'),
    publicKey.export({ type: 'spki', format: 'pem' })
  )

  const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' }) as string
  const jwk = await exportJWK(await importSPKI(publicKeyPem, 'EdDSA'))
  jwk.kid = 'kid-' + Date.now()
  await writeFile(app.makePath('storage/keys/public.jwk.json'), JSON.stringify(jwk, null, 2))
  console.log(`Generated keys in ${app.makePath('storage/keys')}, jwk:`, jwk.kid)
}

export const signAuthToken = async (
  payload: JWTPayload,
  {
    expiry,
    audience,
    issuer,
    subject,
  }: { expiry: string; audience: string; issuer: string; subject: string }
) => {
  const privPem = await readFile(app.makePath('storage/keys/private.pem'), 'utf8')
  const privateKey = await importPKCS8(privPem, 'EdDSA')

  // Read the kid from the JWK file
  const jwkContent = await readFile(app.makePath('storage/keys/public.jwk.json'), 'utf8')
  const jwk = JSON.parse(jwkContent)
  const kid = jwk.kid

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'EdDSA', kid })
    .setSubject(subject)
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(expiry)
    .setIssuedAt()
    .sign(privateKey)

  return jwt
}
