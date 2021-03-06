import type { NextApiRequest, NextApiResponse } from 'next'
import connection from 'lib/db'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid/async'

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  interface RegisterData {
    email: string
    password: string
  }

  try {
    await connection.connect()
    const { email, password }: RegisterData = JSON.parse(req.body)

    if (email.length === 0 || password.length === 0) {
      throw new Error('Please provide an email and password!')
    }

    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!email.toLowerCase().match(emailPattern)) {
      throw new Error('Please provide a valid email address!')
    }

    const [[[numRowsWithEmail]]]: any = await connection.query(
      'SELECT COUNT(*) FROM users WHERE email = ?',
      [email]
    )

    if (numRowsWithEmail > 0) {
      throw new Error('That email is already in use!')
    }

    const user_id = await nanoid(11)
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)

    await connection.query(
      'INSERT INTO users(user_id, email, password) VALUES (?, ?, ?)',
      [user_id, email, hash]
    )
  } catch (e: any) {
    console.log(e)
    res.status(500).json({ error_code: e.code, error_message: e.message })
  }
}
