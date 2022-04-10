import { NextFunction, Request, Response } from 'express'
import admin, { ServiceAccount } from 'firebase-admin'

import serviceAccount from '../secrets/firebase-service-account-key.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
})

export default async function authMiddleware(
  req: Request & { uid?: string },
  res: Response,
  next: NextFunction
) {
  const rawToken = req.headers.authorization

  if (!rawToken) {
    return res.status(403).json({ message: 'No auth token' })
  }

  try {
    const token = await admin
      .auth()
      .verifyIdToken(rawToken.split('Bearer ')[1], true)

    req.uid = token.uid
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }

  next()
}
