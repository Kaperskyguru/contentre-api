import { Cookie } from '@types'
import { environment } from '@helpers/environment'
import { User as DBUser } from '@prisma/client'
import jwt from 'jsonwebtoken'

export function setJWT(user: DBUser, setCookies: Cookie[]): void {
  const token = jwt.sign(
    { userEmail: user.email, userId: user.id },
    environment.auth.tokenSecret,
    { expiresIn: '30 days' }
  )

  setCookies.push({
    name: 'token',
    value: token,
    options: {
      // domain: 'contentre.io',
      httpOnly: true,
      sameSite: 'None',
      secure: true
    }
  })
}

export default setJWT
