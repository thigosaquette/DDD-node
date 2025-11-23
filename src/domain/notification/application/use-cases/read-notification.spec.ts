import { InMemoryNotificationsRepository } from '@/test/repository/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { SendNotificationUseCase } from './send-notification'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase
let sut: ReadNotificationUseCase // System Under Test

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(inMemoryNotificationsRepository)
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should not be able to read a notification that does not exist', async () => {
    const result = await sut.execute({
      notificationId: 'non-existing-id',
      recipientId: '1',
    })

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(result.isLeft()).toBe(true)
  })

  it('should not be able to read a notification from another recipient', async () => {
    const sendResult = await sendNotification.execute({
      recipientId: '1',
      title: 'New notification',
      content: 'New notification content',
    })

    const notificationId = sendResult.isRight() ? sendResult.value.notification.id.toString() : ''

    const result = await sut.execute({
      notificationId,
      recipientId: '2',
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(result.isLeft()).toBe(true)
  })

  it('should be able to read a notification', async () => {
    const sendResult = await sendNotification.execute({
      recipientId: '1',
      title: 'New notification',
      content: 'New notification content',
    })

    const notificationId = sendResult.isRight() ? sendResult.value.notification.id.toString() : ''

    const result = await sut.execute({
      notificationId,
      recipientId: '1',
    })

    if (result.isRight()) {
      const { notification } = result.value

      expect(inMemoryNotificationsRepository.items[0]).toMatchObject({
        id: notification.id,
        recipientId: notification.recipientId,
        title: notification.title,
        content: notification.content,
        readAt: expect.any(Date),
      })
    }
    expect(result.isRight()).toBe(true)
  })
})

