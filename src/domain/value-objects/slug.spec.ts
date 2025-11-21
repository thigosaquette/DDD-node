import { Slug } from "./slug";

test('it should be able to create a new slug from text', () => {
  const slug = Slug.createFromText("It Doesn't matter")

  expect(slug.value).toEqual('it-doesnt-matter')
})