import { Either, left, right } from "./either";

function doSomething(shouldSuccess: boolean): Either<string, { message: string }> {
  if (shouldSuccess) {
    return right({ message: 'success' })
  } else {
    return left('error')
  }
}

test('success result', () => {
  const successResult = doSomething(true)
  
/*   if (successResult.isRight()) {
    console.log(successResult.value)
  } */

  expect(successResult.isRight()).toBe(true)
})

test('error result', () => {
  const errorResult = doSomething(false)
  
/*   if (errorResult.isLeft()) {
    console.log(errorResult.value)
  } */

  expect(errorResult.isLeft()).toBe(true)
})