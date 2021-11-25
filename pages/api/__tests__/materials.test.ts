/**
 * @jest-environment node
 */

import httpMocks, { createMocks } from 'node-mocks-http'
import { NextApiRequest, NextApiResponse } from 'next'
import handleGetMaterials from '../materials'

describe('/api/materials', () => {
  test('GET以外のメソッドでリクエストした場合は405を返す', async () => {
    // @ts-ignore
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    })

    await handleGetMaterials(req, res)

    expect(res.statusCode).toBe(405)
  })
})
