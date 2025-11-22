import { UniqueEntityID } from './unique-entity-id'

test('it should be able to create a unique UUID', () => {
  const uniqueEntityID = new UniqueEntityID()

  const uuid = uniqueEntityID.toString()
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  expect(uuidRegex.test(uuid)).toBe(true)
})
