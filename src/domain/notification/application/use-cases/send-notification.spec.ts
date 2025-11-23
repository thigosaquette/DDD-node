import { InMemoryNotificationsRepository } from '@/test/repository/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase // System Under Test

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'New notification',
      content: 'New notification content',
    })

    if (result.isRight()) {
      const { notification } = result.value

      expect(inMemoryNotificationsRepository.items[0]).toMatchObject({
        id: notification.id,
        recipientId: notification.recipientId,
        title: notification.title,
        content: notification.content,
      })
      expect(notification.id).toBeTruthy()
    }
    expect(result.isRight()).toBe(true)
  })
})

