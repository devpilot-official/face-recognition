import { faker } from '@faker-js/faker'
import request from 'supertest'
import app from '@/app'
import logger from '@/config/logger'

describe('Home Routes', () => {

    beforeEach(async () => {
        logger.info('New test to be run!')
    })

    describe('Home Route - GET /', () => {
        it('should return 200 for home route', async () => {
            const res = await request(app).get('/').expect(200)
            expect(res.body).toHaveProperty('code')
            expect(res.body).toHaveProperty('message')
            expect(res.body).toHaveProperty('data')

            expect(res.body.code).toEqual(200)
        })

        it('should return 404 for unknown home route', async () => {
            const res = await request(app).post('/').expect(404)

            expect(res.body).toHaveProperty('code')
            expect(res.body).toHaveProperty('message')
            expect(res.body).toHaveProperty('stack')

            expect(res.body.code).toEqual(404)
            expect(res.body.message).toEqual("Not found")
        })
    })
})
