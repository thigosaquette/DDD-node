import { WatchedList } from "./watched-list";

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('Watched List', () => {
  it('should be able to create a watched list', () => {
    const watchedList = new NumberWatchedList([1, 2, 3])

    expect(watchedList.getItems()).toEqual([1, 2, 3])
    expect(watchedList.getNewItems()).toEqual([])
    expect(watchedList.getRemovedItems()).toEqual([])
  })

  it('should be able to add an item to the watched list', () => {
    const watchedList = new NumberWatchedList([1, 2, 3])
    watchedList.add(4)

    expect(watchedList.getItems()).toEqual([1, 2, 3, 4])
    expect(watchedList.getNewItems()).toEqual([4])
    expect(watchedList.getRemovedItems()).toEqual([])
  })

  it('should be able to remove an item from the watched list', () => {
    const watchedList = new NumberWatchedList([1, 2, 3])
    watchedList.remove(2)

    expect(watchedList.getItems()).toEqual([1, 3])
    expect(watchedList.getNewItems()).toEqual([])
    expect(watchedList.getRemovedItems()).toEqual([2])
  })

  it('should be able to update the watched list', () => {
    const watchedList = new NumberWatchedList([1, 2, 3])
    watchedList.update([1, 2, 4])

    expect(watchedList.getItems()).toEqual([1, 2, 4])
    expect(watchedList.getNewItems()).toEqual([4])
    expect(watchedList.getRemovedItems()).toEqual([3])
  })
})